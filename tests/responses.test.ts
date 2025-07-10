import { describe, it, expect } from "vitest";
import { createSetupApp } from "./createSetupApp";

const setupApp = createSetupApp(3700);

describe("test sending html responses", () => {
    it("sending html response should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.html("<h2>Hello World</h2>");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(response.headers.get("content-type")).toBe("text/html");
        expect(await response.text()).toBe("<h2>Hello World</h2>");
    });

    it("sending html response with custom status should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.html("<h2>Not Found</h2>", 404);
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(response.headers.get("content-type")).toBe("text/html");
        expect(response.status).toBe(404);
        expect(await response.text()).toBe("<h2>Not Found</h2>");
    });
});

describe("test redirect", () => {
    it("redirect to external routes should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.redirect("https://google.com");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, { redirect: "follow" });
        expect(response.status).toBe(200);
        expect(response.url).toBe("https://www.google.com/");
    });

    it("redirect to internal routes should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.redirect(`http://127.0.0.1:${appPort}/hello`);
        });

        app.get("/hello", (_, res) => {
            res.send("Hello");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, { redirect: "follow" });
        expect(response.status).toBe(200);
        expect(response.url).toBe(`http://127.0.0.1:${appPort}/hello`);
        expect(await response.text()).toBe("Hello");
    });
});
