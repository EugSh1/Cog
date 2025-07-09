---
title: Secure headers with Helmet
sidebar_position: 1
---

# Secure HTTP headers with Helmet

**Add common security headers to your Cog app using
[Helmet](https://www.npmjs.com/package/helmet).**

Since Cog gives full control over the request/response cycle, it doesn't include security headers by
default.

With [Helmet](https://www.npmjs.com/package/helmet), you can add protection against common web
vulnerabilities like clickjacking, XSS, and more.

## Setup

Install the package:

```bash
npm install helmet
```

## Usage

Example integration:

```ts
import { Cog } from "cog-http";
import helmet from "helmet";

const app = new Cog();

app.use("*", (req, res, next) => {
    // Helmet expects native req/res objects
    return helmet()(req.raw, res.raw, next);
});

app.get("/", (_, res) => {
    res.send("Hello with secure headers!");
});

app.listen(3000, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:3000");
});
```

That's it! With one middleware, your Cog app becomes much safer by default.
