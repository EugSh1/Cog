---
title: Benchmark
---

# Benchmark

We compared **Cog (1.0.4)**, **Hono (4.7.10) & @hono/node-server (1.14.1)** and **Express (5.1.0)**
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

| Route              | Framework | Requests/sec | Latency (avg) | Errors |
| ------------------ | --------- | ------------ | ------------- | ------ |
| `/`                | Hono      | 62514.91     | 12.29 ms      | 0      |
|                    | Cog       | 49764.37     | 15.58 ms      | 0      |
|                    | Express   | 14745.1      | 39.71 ms      | 226    |
| `/very/deeply...`  | Hono      | 60312.73     | 12.84 ms      | 0      |
|                    | Cog       | 48344.73     | 16.04 ms      | 0      |
|                    | Express   | 14788        | 38.43 ms      | 251    |
| `/hello?name=John` | Hono      | 61473.46     | 12.53 ms      | 0      |
|                    | Cog       | 48082.91     | 16.06 ms      | 0      |
|                    | Express   | 14464.37     | 38.46 ms      | 263    |
| `/admin`           | Hono      | 41037.1      | 18.99 ms      | 0      |
|                    | Cog       | 48856.73     | 15.95 ms      | 0      |
|                    | Express   | 14196.73     | 38.82 ms      | 267    |
| `/admin/set-token` | Hono      | 38922.19     | 20.06 ms      | 0      |
|                    | Cog       | 47451.64     | 16.3 ms       | 0      |
|                    | Express   | 13982.4      | 37.26 ms      | 272    |
| `/parse-body`      | Hono      | 26339.64     | 29.06 ms      | 124    |
|                    | Cog       | 47324.8      | 16.35 ms      | 0      |
|                    | Express   | 12873.1      | 40.15 ms      | 293    |

## Summary

The benchmarks show that **Hono** delivers the highest requests per second and the lowest latency on
most routes, except for `/admin` and `/admin/set-token`, where **Cog** performs slightly better in
speed and latency.

**Cog** shows zero errors but its performance is generally lower than Hono's, and given the context,
it should not be considered a reliable choice for production use.

**Express** performs significantly worse in all metrics, with much higher latency, fewer requests
per second, and many errors across all routes.

In summary, **Hono** offers the best performance overall, **Cog** is not recommended for production
despite zero errors, and **Express** lags behind in speed and reliability.

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
