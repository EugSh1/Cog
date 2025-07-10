import { describe, it, expect } from "vitest";
import { createSetupApp } from "./createSetupApp";

const setupApp = createSetupApp(3400);

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
        expect(await response1.text()).toBe("Hello, Admin!");
        const response2 = await fetch(`http://127.0.0.1:${appPort}/admin/dashboard`);
        expect(await response2.text()).toBe("Welcome to the Dashboard!");
    });

    it("POST method in route groups should work", async () => {
        const { app, appPort } = setupApp();

        app.group("/api", (api) => {
            api.post("/users", (req, res) => {
                const user = req.body;
                res.send(user, 201);
            });
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/api/users`, {
            method: "POST",
            body: JSON.stringify({ name: "John", email: "john@example.com" }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(response.status).toBe(201);
        expect(await response.json()).toStrictEqual({ name: "John", email: "john@example.com" });
    });

    it("PUT method in route groups should work", async () => {
        const { app, appPort } = setupApp();

        app.group("/api", (api) => {
            api.put("/users/1", (req, res) => {
                const user = req.body;
                res.send(user);
            });
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/api/users/1`, {
            method: "PUT",
            body: JSON.stringify({ name: "Jane", email: "jane@example.com" }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(await response.json()).toStrictEqual({ name: "Jane", email: "jane@example.com" });
    });

    it("PATCH method in route groups should work", async () => {
        const { app, appPort } = setupApp();

        app.group("/api", (api) => {
            api.patch("/users/1", (req, res) => {
                const updates = req.body;
                res.send(updates);
            });
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/api/users/1`, {
            method: "PATCH",
            body: JSON.stringify({ email: "updated@example.com" }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(await response.json()).toStrictEqual({ email: "updated@example.com" });
    });

    it("DELETE method in route groups should work", async () => {
        const { app, appPort } = setupApp();

        app.group("/api", (api) => {
            api.delete("/users/1", (_, res) => {
                res.send({ message: "User deleted" }, 200);
            });
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/api/users/1`, {
            method: "DELETE"
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toStrictEqual({ message: "User deleted" });
    });

    it("HEAD method in route groups should work", async () => {
        const { app, appPort } = setupApp();

        app.group("/api", (api) => {
            api.head("/users", (_, res) => {
                res.set("X-Total-Count", "100");
                res.set("Content-Type", "application/json");
                res.send("", 200);
            });
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/api/users`, {
            method: "HEAD"
        });
        expect(response.status).toBe(200);
        expect(response.headers.get("X-Total-Count")).toBe("100");
        expect(response.headers.get("Content-Type")).toBe("text/plain");
        expect(await response.text()).toBe("");
    });

    it("OPTIONS method in route groups should work", async () => {
        const { app, appPort } = setupApp();

        app.group("/api", (api) => {
            api.options("/users", (_, res) => {
                res.set("Allow", "GET, POST, PUT, DELETE, OPTIONS");
                res.set("Access-Control-Allow-Origin", "*");
                res.send("", 200);
            });
        });

        const response = await fetch(`http://127.0.0.1:${appPort}/api/users`, {
            method: "OPTIONS"
        });
        expect(response.status).toBe(200);
        expect(response.headers.get("Allow")).toBe("GET, POST, PUT, DELETE, OPTIONS");
        expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
        expect(await response.text()).toBe("");
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
        expect(await response1.text()).toBe("Hello, Admin!");
        const response2 = await fetch(`http://127.0.0.1:${appPort}/admin/dashboard`);
        expect(await response2.text()).toBe("Welcome to the Dashboard!");
        const response3 = await fetch(`http://127.0.0.1:${appPort}/admin/dashboard/stats`);
        expect(await response3.text()).toBe("Visits: 10");
    });
});
