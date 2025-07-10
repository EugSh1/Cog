import { describe, it, expect } from "vitest";
import { createSetupApp } from "./createSetupApp";

const setupApp = createSetupApp(3100);

describe("test cookies", () => {
    it("setting single cookie should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.setCookie("token", "f9a3e039-d605-4aea-a670-f1ab6b54b459");
            res.send("Cookie set!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(response.headers.getSetCookie()).toStrictEqual([
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

        const cookie = response.headers.getSetCookie()[0];

        expect(cookie).toContain("token=");
        expect(cookie).toContain("Max-Age=216000");
        expect(cookie).toContain("Domain=example.com");
        expect(cookie).toContain("Path=/");
        expect(cookie).toContain("HttpOnly");
        expect(cookie).toContain("Secure");
        expect(cookie).toContain("SameSite=Lax");
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
        expect(response.headers.getSetCookie()).toStrictEqual([
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
        expect(receivedCookies).toStrictEqual({ sessionId: "abc123", otherCookie: "value" });
    });

    it("clearing cookie should work", async () => {
        const { app, appPort } = setupApp();

        app.get("/", (_, res) => {
            res.clearCookie("token");
            res.send("Cookie removed!");
        });

        const response = await fetch(`http://127.0.0.1:${appPort}`);
        expect(response.headers.getSetCookie()).toStrictEqual([
            "token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
        ]);
    });
});
