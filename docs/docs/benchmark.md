---
title: Benchmark
sidebar_position: 5
---

# Benchmark

We compared **Cog (1.0.8)**, **Hono (4.7.10) & @hono/node-server (1.14.1)** and **Express (5.1.0)**
using [autocannon](https://www.npmjs.com/package/autocannon) with the following code:

```ts
import autocannon from "autocannon";

const PORT = 3000;

const routes = [
    "/",
    "/very/deeply/nested/route/hello/there/admin/dashboard/ping",
    "/hello?name=John",
    "/admin",
    "/admin/set-token",
    "/parse-body"
] as const;

for (const route of routes) {
    console.log(`\n--- Benchmarking ${route} ---`);
    const result = await autocannon({
        url: `http://127.0.0.1:${PORT}${route}`,
        connections: 800,
        duration: 10,
        method: route === "/parse-body" ? "POST" : "GET",
        headers:
            route === "/parse-body"
                ? { "Content-Type": "application/json" }
                : { cookie: "sessionId=abc123; otherCookie=value" },
        body: route === "/parse-body" ? JSON.stringify({ message: "Hello!" }) : undefined
    });

    console.log(`Completed benchmark for ${route}`);
    console.log(`Requests/sec: ${result.requests.average}`);
    console.log(`Latency (avg): ${result.latency.average} ms`);
    console.log(`Errors: ${result.errors}`);
}
```

## Results

| Route              | Framework | Requests/sec | Avg Latency (ms) | Errors |
| ------------------ | --------- | ------------ | ---------------- | ------ |
| `/`                | Hono      | 62738.91     | 12.24            | 0      |
|                    | Cog       | 58119.28     | 13.25            | 0      |
|                    | Express   | 14930.55     | 39.53            | 221    |
| `/very/deeply...`  | Hono      | 60949.82     | 12.67            | 0      |
|                    | Cog       | 54064        | 14.24            | 0      |
|                    | Express   | 14926.91     | 40.22            | 202    |
| `/hello?name=John` | Hono      | 61613.1      | 12.48            | 0      |
|                    | Cog       | 53552        | 14.43            | 0      |
|                    | Express   | 14665.82     | 38.37            | 259    |
| `/admin`           | Hono      | 41214.55     | 18.92            | 0      |
|                    | Cog       | 55128.73     | 14.03            | 0      |
|                    | Express   | 14396        | 38.57            | 264    |
| `/admin/set-token` | Hono      | 39992.73     | 19.51            | 0      |
|                    | Cog       | 51946.19     | 14.95            | 0      |
|                    | Express   | 14106.55     | 38.93            | 269    |
| `/parse-body`      | Hono      | 27158.4      | 28.96            | 0      |
|                    | Cog       | 50171.64     | 15.42            | 0      |
|                    | Express   | 13004        | 39.98            | 291    |

## Summary

The benchmark shows that **Cog** performs significantly better than **Express** in all tested
routes, with much higher requests per second, lower latency, and zero errors. While **Hono**
outperforms Cog in raw speed and latency, Cog remains a fast and reliable framework considering its
simplicity and minimal footprint. However, **Cog is still experimental and not recommended for
production use**. Use it only for learning, experimentation, or lightweight projects, and avoid
deploying it in critical production environments.

:::caution

All benchmarks were run locally with Node.js v22.11.0 on a MacBook Air M1. Also, these tests were
conducted by someone whose benchmarking skills are... let’s say, “enthusiastic beginner,” so results
may differ if rerun or done by a pro.

:::

## Apps code

### Cog app

```ts
import { Cog } from "cog-http";

const app = new Cog();

app.use("*", (_req, res, next) => {
    res.set("X-Powered-By", "Cog");
    next();
});

app.get("/", (_req, res) => {
    res.send("Hello from Cog!");
});

app.get("/very/deeply/nested/route/hello/there/admin/dashboard/ping", (_req, res) => {
    res.send("Pong!");
});

app.get("/hello", (req, res) => {
    const { name } = req.query;
    res.send(`Hello, ${name || "user"}!`);
});

app.group("/admin", (admin) => {
    admin.get("/", (req, res) => {
        const { token } = req.cookies;

        if (token === "my_token_12345") {
            res.clearCookie("token");
            return res.send({ message: "Secret info" });
        }

        res.send("Unauthenticated", 403);
    });

    admin.get("/set-token", (_req, res) => {
        res.setCookie("token", "my_token_12345");
        res.send("Token set!");
    });
});

app.post("/parse-body", (req, res) => {
    const body = req.body;
    res.send(body);
});

app.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
```

### Hono app

```ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

const app = new Hono();

app.use("*", async (c, next) => {
    c.header("X-Powered-By", "Hono");
    await next();
});

app.get("/", (c) => c.text("Hello from Hono!"));

app.get("/very/deeply/nested/route/hello/there/admin/dashboard/ping", (c) => c.text("Pong!"));

app.get("/hello", (c) => {
    const name = c.req.query("name") || "user";
    return c.text(`Hello, ${name}!`);
});

const admin = new Hono();

admin.get("/", (c) => {
    const token = getCookie(c, "token");
    if (token === "my_token_12345") {
        deleteCookie(c, "token");
        return c.json({ message: "Secret info" });
    }
    return c.text("Unauthenticated", 403);
});

admin.get("/set-token", (c) => {
    setCookie(c, "token", "my_token_12345");
    return c.text("Token set!");
});

app.route("/admin/*", admin);

app.post("/parse-body", async (c) => {
    const body = await c.req.json();
    return c.json(body);
});

serve({
    fetch: app.fetch,
    hostname: "127.0.0.1",
    port: 3002
});
console.log("Listening on 127.0.0.1:3002");
```

### Express app

```ts
import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json() as express.RequestHandler);

app.use((_req, res, next) => {
    res.set("X-Powered-By", "Express");
    next();
});

app.get("/", (_req, res) => {
    res.send("Hello from Express!");
});

app.get("/very/deeply/nested/route/hello/there/admin/dashboard/ping", (_req, res) => {
    res.send("Pong!");
});

app.get("/hello", (req, res) => {
    const { name } = req.query;
    res.send(`Hello, ${name || "user"}!`);
});

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
    const { token } = req.cookies;
    if (token === "my_token_12345") {
        res.clearCookie("token");
        res.status(200).send({ message: "Secret info" });
        return;
    }
    res.status(403).send("Unauthenticated");
});

adminRouter.get("/set-token", (_req, res) => {
    res.cookie("token", "my_token_12345");
    res.send("Token set!");
});

app.use("/admin", adminRouter);

app.post("/parse-body", (req, res) => {
    res.send(req.body);
});

app.listen(3001, "127.0.0.1", () => {
    console.log("Express listening on 127.0.0.1:3001");
});
```
