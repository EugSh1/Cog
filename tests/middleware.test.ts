import { describe, it, expect } from "vitest";
import { createSetupApp } from "./createSetupApp";

const setupApp = createSetupApp(3200);

describe("test middleware", () => {
    it("middleware should execute before hitting the endpoint", async () => {
        const { app, appPort } = setupApp();

        let endpointHit = false;

        app.use("*", (_req, res) => {
            res.send("Forbidden", 403);
        });

        app.get("/", (_, res) => {
            endpointHit = true;
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(await response.text()).toBe("Forbidden");
        expect(response.status).toBe(403);
        expect(endpointHit).toBe(false);
    });

    it("middleware should allow requests to go through", async () => {
        const { app, appPort } = setupApp();

        let middlewareHit = false;

        app.use("*", (_req, _res, next) => {
            middlewareHit = true;
            next();
        });

        app.get("/", (_, res) => {
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(await response.text()).toBe("Hello, World!");
        expect(middlewareHit).toBe(true);
    });

    it("route-specific middleware should work properly", async () => {
        const { app, appPort } = setupApp();

        const middlewareHitRoutes: string[] = [];

        app.use("/admin", (req, _res, next) => {
            middlewareHitRoutes.push(req.url);
            next();
        });

        app.get("/", (_, res) => {
            res.send("Hello, World!");
        });

        app.get("/ping", (_, res) => {
            res.send("Pong!");
        });

        app.get("/admin/", (_, res) => {
            res.send("Hello, Admin!");
        });

        app.get("/admin/dashboard", (_, res) => {
            res.send("Hello from Dashboard!");
        });

        await fetch(`http://127.0.0.1:${appPort}`);
        await fetch(`http://127.0.0.1:${appPort}/ping`);
        await fetch(`http://127.0.0.1:${appPort}/admin`);
        await fetch(`http://127.0.0.1:${appPort}/admin/dashboard`);

        expect(middlewareHitRoutes).toStrictEqual(["/admin", "/admin/dashboard"]);
    });

    it("multiple middleware should execute in the correct order", async () => {
        const { app, appPort } = setupApp();

        const middlewaresHit: string[] = [];

        app.use("*", (_req, _res, next) => {
            middlewaresHit.push("first middleware");
            next();
        });

        app.use("/admin", (_req, _res, next) => {
            middlewaresHit.push("second middleware");
            next();
        });

        app.use("/admin/", (_req, _res, next) => {
            middlewaresHit.push("third middleware");
            next();
        });

        app.get("/admin", (_, res) => {
            res.send("Hello, Admin!");
        });

        await fetch(`http://127.0.0.1:${appPort}/admin`);
        expect(middlewaresHit).toStrictEqual([
            "first middleware",
            "second middleware",
            "third middleware"
        ]);
    });

    it("middleware should execute even if no route found", async () => {
        const { app, appPort } = setupApp();

        let middlewareHit = false;

        app.use("*", (_req, _res, next) => {
            middlewareHit = true;
            next();
        });

        app.get("/admin", (_, res) => {
            res.send("Hello, Admin!");
        });

        await fetch(`http://127.0.0.1:${appPort}/non-existent-route`);
        expect(middlewareHit).toBe(true);
    });
});
