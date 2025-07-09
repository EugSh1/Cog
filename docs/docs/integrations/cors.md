---
title: Enable CORS
sidebar_position: 2
---

# Enable CORS with `cors`

**Add Cross-Origin Resource Sharing (CORS) to your Cog app using the
[cors](https://www.npmjs.com/package/cors) middleware.**

Cog gives you full control over the request/response cycle, so CORS is not included by default. You
can use the `cors` package to add CORS headers and allow cross-origin requests easily.

## Setup

1. Install the required package:

```bash
npm install cors
```

2. If you're using TypeScript, install the type definitions for `cors`:

```bash
npm install --save-dev @types/cors
```

## Example

```tsx
import { Cog } from "cog-http";
import cors, { type CorsOptions } from "cors";

const app = new Cog();

const corsOptions: CorsOptions = {
    origin: "http://localhost:5173"
};

app.use("*", (req, res, next) => {
    // Cors expects native req/res objects
    return cors(corsOptions)(req.raw, res.raw, next);
});

app.get("/", (_, res) => {
    res.send("Hello with CORS!");
});

app.listen(3000, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:3000");
});
```

That’s it! Your Cog app now supports CORS requests.
