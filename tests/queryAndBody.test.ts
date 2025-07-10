import http from "http";
import { describe, it, expect } from "vitest";
import { type StringOrJSON } from "../src";
import { createSetupApp } from "./createSetupApp";

const setupApp = createSetupApp(3500);

describe("test getting query params", () => {
    it("should get query params properly", async () => {
        const { app, appPort } = setupApp();

        let queryParam = "";

        app.get("/", (req, res) => {
            const { message } = req.query;

            if (message) {
                queryParam = message;
            }

            res.send("Hello, World!");
        });

        await fetch(`http://127.0.0.1:${appPort}?message=hello`);
        expect(queryParam).toBe("hello");
    });
});

describe("test getting request body", () => {
    it("should get plain text body properly", async () => {
        const { app, appPort } = setupApp();

        let body: StringOrJSON = "";

        app.post("/", (req, res) => {
            body = req.body;
            res.send("Hello, World!");
        });

        await fetch(`http://127.0.0.1:${appPort}`, {
            method: "POST",
            body: "Hello, World!",
            headers: {
                "Content-Type": "text/plain"
            }
        });
        expect(body).toBe("Hello, World!");
    });

    it("should send an error if JSON body is invalid", async () => {
        const { app, appPort } = setupApp();

        app.post("/", (req, res) => {
            const body = req.body;
            res.send(`Hello, ${body}!`);
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, {
            method: "POST",
            body: "{ Hello, World!",
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(response.status).toBe(400);
        expect(await response.text()).toBe("Error parsing request body");
    });

    it("should get plain text body (not specified) properly", async () => {
        const { app, appPort } = setupApp();

        let body: StringOrJSON = "";

        app.post("/", (req, res) => {
            body = req.body;
            res.send("Hello, World!");
        });

        await fetch(`http://127.0.0.1:${appPort}`, {
            method: "POST",
            body: "Hello, World!"
        });
        expect(body).toBe("Hello, World!");
    });

    it("should get json body properly", async () => {
        const { app, appPort } = setupApp();

        let body: StringOrJSON = "";

        app.post("/", (req, res) => {
            body = req.body;
            res.send("Hello, World!");
        });

        await fetch(`http://127.0.0.1:${appPort}`, {
            method: "POST",
            body: JSON.stringify({ message: "Hello, World!" }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(body).toStrictEqual({ message: "Hello, World!" });
    });

    it("should throw an error if trying to get body from request handler with unsupported method", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_req, res) => {
            res.send("Hello, World!");
        });

        const response = await new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: "127.0.0.1",
                    port: appPort,
                    path: "/",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength("{}")
                    },
                    method: "GET"
                },
                (res) => {
                    let data = "";
                    res.on("data", (chunk) => (data += chunk));
                    res.on("end", () => resolve({ statusCode: res.statusCode, body: data }));
                }
            );
            req.on("error", reject);
            req.write("{}");
            req.end();
        });

        expect(await response).toStrictEqual({
            statusCode: 400,
            body: "GET does not support body"
        });
    });
});
