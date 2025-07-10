import { describe, it, expect } from "vitest";
import { createSetupApp } from "./createSetupApp";

const setupApp = createSetupApp(3000);

describe("test requests", () => {
    it("GET request should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(await response.text()).toBe("Hello, World!");
    });

    it("POST request with a JSON body should work", async () => {
        const { app, appPort } = setupApp();

        app.post("/", (req, res) => {
            const message = req.body;
            res.send(message, 201);
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, {
            method: "POST",
            body: JSON.stringify({ message: "Hello, World!" }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(response.status).toBe(201);
        expect(await response.json()).toStrictEqual({ message: "Hello, World!" });
    });

    it("PUT request with a JSON body should work", async () => {
        const { app, appPort } = setupApp();

        app.put("/", (req, res) => {
            const message = req.body;
            res.send(message);
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, {
            method: "PUT",
            body: JSON.stringify({ message: "Hello, World!" }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(await response.json()).toStrictEqual({ message: "Hello, World!" });
    });

    it("PATCH request with a JSON body should work", async () => {
        const { app, appPort } = setupApp();

        app.patch("/", (req, res) => {
            const message = req.body;
            res.send(message);
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, {
            method: "PATCH",
            body: JSON.stringify({ message: "Hello, World!" }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(await response.json()).toStrictEqual({ message: "Hello, World!" });
    });

    it("DELETE request with a JSON body should work", async () => {
        const { app, appPort } = setupApp();

        app.delete("/", (req, res) => {
            const message = req.body;
            res.send(message);
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, {
            method: "DELETE",
            body: JSON.stringify({ message: "Hello, World!" }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(await response.json()).toStrictEqual({ message: "Hello, World!" });
    });

    it("OPTIONS request should work", async () => {
        const { app, appPort } = setupApp();

        app.options("/", (_, res) => {
            res.set("Allow", "GET, POST, PUT, DELETE, OPTIONS");
            res.send("", 200);
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, {
            method: "OPTIONS"
        });
        expect(response.status).toBe(200);
        expect(response.headers.get("Allow")).toBe("GET, POST, PUT, DELETE, OPTIONS");
        expect(await response.text()).toBe("");
    });

    it("HEAD request should work", async () => {
        const { app, appPort } = setupApp();

        app.head("/", (_, res) => {
            res.set("Content-Length", "13");
            res.set("X-Custom-Header", "head-response");
            res.send("", 200);
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, {
            method: "HEAD"
        });
        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Length")).toBe("13");
        expect(response.headers.get("X-Custom-Header")).toBe("head-response");
        expect(await response.text()).toBe("");
    });
});
