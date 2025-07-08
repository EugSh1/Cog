---
sidebar_position: 4
---

# Middleware

Cog supports middleware functions to process requests before they reach route handlers. Middleware
can modify request and response objects or end the request early.

## How to use middleware

Middleware functions receive `(req, res, next)` parameters. Call `next()` to pass control to the
next middleware or route handler.

```ts
app.use("*", (req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
```

## Applying middleware to specific routes

You can apply middleware only to certain routes:

```ts
app.use("/admin", (req, res, next) => {
    if (!req.headers["authorization"]) {
        return res.send({ error: "Unauthorized" }, 401);
    }

    next();
});
```
