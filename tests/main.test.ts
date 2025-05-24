import http from "http";
import { deepStrictEqual, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { Cog, StringOrJSON } from "../src/index";

let port = 3000;

function setupApp() {
    const appPort = port++;
    const app = new Cog();
    app.listen(appPort, "127.0.0.1");
    return { app, appPort };
}

describe("test requests", () => {
    it("GET request should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        strictEqual(await response.text(), "Hello, World!");
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
        deepStrictEqual(response.status, 201);
        deepStrictEqual(await response.json(), { message: "Hello, World!" });
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
        deepStrictEqual(await response.json(), { message: "Hello, World!" });
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
        deepStrictEqual(await response.json(), { message: "Hello, World!" });
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
        deepStrictEqual(await response.json(), { message: "Hello, World!" });
    });
});

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
        strictEqual(await response.text(), "Forbidden");
        strictEqual(response.status, 403);
        strictEqual(endpointHit, false);
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
        strictEqual(await response.text(), "Hello, World!");
        strictEqual(middlewareHit, true);
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

        deepStrictEqual(middlewareHitRoutes, ["/admin", "/admin/dashboard"]);
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
        deepStrictEqual(middlewaresHit, [
            "first middleware",
            "second middleware",
            "third middleware"
        ]);
    });
});

describe("test routing", () => {
    it("should hit a route", async () => {
        const { app, appPort } = setupApp();

        app.get("/test/", (_, res) => {
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/test`);
        strictEqual(await response.text(), "Hello, World!");
    });

    it("should hit a deep route", async () => {
        const { app, appPort } = setupApp();

        app.get("/admin/dashboard/users/user", (_, res) => {
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/admin/dashboard/users/user/`);
        strictEqual(await response.text(), "Hello, World!");
    });

    it("should respond with 404 if route is not found", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/admin`);
        strictEqual(await response.text(), "Not Found");
        strictEqual(response.status, 404);
    });

    it("should respond with 404 if no route with supported method found", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.send("Hello!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`, { method: "PUT" });
        strictEqual(response.status, 404);
    });
});

describe("test route groups", () => {
    it("route groups should work properly", async () => {
        const { app, appPort } = setupApp();

        app.group("/admin", (admin) => {
            admin.get("/", (_, res) => {
                res.send("Hello, Admin!");
            });

            admin.get("/dashboard", (_, res) => {
                res.send("Welcome to the Dashboard!");
            });
        });

        const response1 = await fetch(`http://127.0.0.1:${appPort}/admin`);
        strictEqual(await response1.text(), "Hello, Admin!");
        const response2 = await fetch(`http://127.0.0.1:${appPort}/admin/dashboard`);
        strictEqual(await response2.text(), "Welcome to the Dashboard!");
    });

    it("nested route groups should work properly", async () => {
        const { app, appPort } = setupApp();

        app.group("/admin", (admin) => {
            admin.get("/", (_, res) => {
                res.send("Hello, Admin!");
            });

            admin.group("/dashboard", (dashboard) => {
                dashboard.get("/", (_, res) => {
                    res.send("Welcome to the Dashboard!");
                });

                dashboard.get("/stats", (_, res) => {
                    res.send("Visits: 10");
                });
            });
        });

        const response1 = await fetch(`http://127.0.0.1:${appPort}/admin`);
        strictEqual(await response1.text(), "Hello, Admin!");
        const response2 = await fetch(`http://127.0.0.1:${appPort}/admin/dashboard`);
        strictEqual(await response2.text(), "Welcome to the Dashboard!");
        const response3 = await fetch(`http://127.0.0.1:${appPort}/admin/dashboard/stats`);
        strictEqual(await response3.text(), "Visits: 10");
    });
});

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
        strictEqual(queryParam, "hello");
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
        deepStrictEqual(body, "Hello, World!");
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
        deepStrictEqual(body, "Hello, World!");
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
        deepStrictEqual(body, { message: "Hello, World!" });
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

        deepStrictEqual(await response, { statusCode: 400, body: "GET does not support body" });
    });
});

describe("test setting headers", () => {
    it("should set single header correctly", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.set("X-Powered-By", "Cog");
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        strictEqual(response.headers.get("X-Powered-By"), "Cog");
    });

    it("should set multiple headers with multiple set invokations correctly", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.set("X-Some-Header", "test-value");
            res.set("X-Another-Header", "another-value");
            res.send("Hello, World!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        strictEqual(response.headers.get("X-Some-Header"), "test-value");
        strictEqual(response.headers.get("X-Another-Header"), "another-value");
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
        strictEqual(response.headers.get("X-Some-Header"), "test-value");
        strictEqual(response.headers.get("X-Another-Header"), "another-value");
    });
});

describe("test cookies", () => {
    it("setting single cookie should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.setCookie("token", "f9a3e039-d605-4aea-a670-f1ab6b54b459");
            res.send("Cookie set!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        deepStrictEqual(response.headers.getSetCookie(), [
            "token=f9a3e039-d605-4aea-a670-f1ab6b54b459"
        ]);
    });

    it("setting cookie with options should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.setCookie("token", "f9a3e039-d605-4aea-a670-f1ab6b54b459", {
                domain: "example.com",
                expires: new Date(2077, 0, 1),
                httpOnly: true,
                maxAge: 60 * 60 * 60,
                path: "/",
                sameSite: "Lax",
                secure: true
            });
            res.send("Cookie set!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        deepStrictEqual(response.headers.getSetCookie(), [
            "token=f9a3e039-d605-4aea-a670-f1ab6b54b459; Max-Age=216000; Domain=example.com; Path=/; Expires=Thu, 31 Dec 2076 21:00:00 GMT; HttpOnly; Secure; SameSite=Lax"
        ]);
    });

    it("setting multiple cookies should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.setCookie("token", "f9a3e039-d605-4aea-a670-f1ab6b54b459", {
                domain: "example.com"
            });
            res.setCookie("another_token", "945c7298-12c4-48fd-99f9-bf5021e2b65f");
            res.send("Cookie set!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        deepStrictEqual(response.headers.getSetCookie(), [
            "token=f9a3e039-d605-4aea-a670-f1ab6b54b459; Domain=example.com",
            "another_token=945c7298-12c4-48fd-99f9-bf5021e2b65f"
        ]);
    });

    it("getting cookies should work", async () => {
        const { app, appPort } = setupApp();

        let receivedCookies = {};

        app.get("/", (req, res) => {
            receivedCookies = req.cookies;
            res.send("Cookie received!");
        });

        await fetch(`http://127.0.0.1:${appPort}`, {
            headers: {
                Cookie: "sessionId=abc123; otherCookie=value"
            }
        });
        deepStrictEqual(receivedCookies, { sessionId: "abc123", otherCookie: "value" });
    });

    it("clearing cookie should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.clearCookie("token");
            res.send("Cookie removed!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        deepStrictEqual(response.headers.getSetCookie(), [
            "token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
        ]);
    });
});

describe("test sending html responses", () => {
    it("sending html response should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.html("<h2>Hello World</h2>");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        strictEqual(response.headers.get("content-type"), "text/html");
        strictEqual(await response.text(), "<h2>Hello World</h2>");
    });

    it("sending html response with custom status should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.html("<h2>Not Found</h2>", 404);
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        strictEqual(response.headers.get("content-type"), "text/html");
        strictEqual(response.status, 404);
        strictEqual(await response.text(), "<h2>Not Found</h2>");
    });
});
