import { describe, it, expect } from "vitest";
import { createSetupApp } from "./createSetupApp";

const setupApp = createSetupApp(3600);

describe("test setting headers", () => {
    it("should set single header correctly", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.set("X-Powered-By", "Cog");
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(response.headers.get("X-Powered-By")).toBe("Cog");
    });

    it("should set multiple headers with multiple set invokations correctly", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.set("X-Some-Header", "test-value");
            res.set("X-Another-Header", "another-value");
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(response.headers.get("X-Some-Header")).toBe("test-value");
        expect(response.headers.get("X-Another-Header")).toBe("another-value");
    });

    it("should set multiple headers with single set invokation correctly", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.set({
                "X-Some-Header": "test-value",
                "X-Another-Header": "another-value"
            });
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(response.headers.get("X-Some-Header")).toBe("test-value");
        expect(response.headers.get("X-Another-Header")).toBe("another-value");
    });
});
