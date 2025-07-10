import { describe, it, expect } from "vitest";
import { createSetupApp } from "./createSetupApp";

const setupApp = createSetupApp(3300);

describe("test routing", () => {
    it("should hit a route", async () => {
        const { app, appPort } = setupApp();

        app.get("/test/", (_, res) => {
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/test`);
        expect(await response.text()).toEqual("Hello, World!");
    });

    it("should hit a deep route", async () => {
        const { app, appPort } = setupApp();

        app.get("/admin/dashboard/users/user", (_, res) => {
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/admin/dashboard/users/user/`);
        expect(await response.text()).toEqual("Hello, World!");
    });

    it("should respond with 404 if route is not found", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/admin`);
        expect(await response.text()).toBe("Not Found");
        expect(response.status).toBe(404);
    });

    it("should respond with 404 if no route with supported method found", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.send("Hello!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, { method: "PUT" });
        expect(response.status).toBe(404);
    });
});
