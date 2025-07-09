---
title: Serve static files with Sirv
sidebar_position: 2
---

# Serve static files with Sirv

**It is really simple to serve static files in Cog using
[Sirv package](https://www.npmjs.com/package/sirv).**

Since Cog has no dependencies by design, support for serving static files is not built in. Also, it
is challenging to implement secure static file middleware from scratch. However, there are some
solutions, like Sirv, that can be integrated with Cog thanks to its flexibility.

## Setup

Install the required package:

```bash
npm install sirv
```

## Example

Here's an example of serving static files using Sirv:

Structure:

```
.
├── src
│   └── cog.ts
├── static
│   ├── index.html
│   └── style.css
├── package.json
├── package-lock.json
└── tsconfig.json
```

`server.ts`:

```ts
import { Cog } from "cog-http";
import sirv from "sirv";

const app = new Cog();

const sirvMwPath = "/public";
const staticDir = "static";

app.use(sirvMwPath, (req, res, next) => {
    // Strip the prefix from the URL so Sirv can handle the correct file path
    req.raw.url = req.raw.url!.replace(new RegExp(`^${sirvMwPath}`), "") || "/";
    return sirv(staticDir)(req.raw, res.raw, next);
});

app.get("/", (_, res) => {
    res.send(`Hello from Cog!`);
});

app.listen(3000, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:3000");
});
```

## Pro tip

To avoid repeating the boilerplate when adding Sirv to multiple routes or apps, you can extract it
into a reusable utility function:

```ts
import { type MiddlewareHandler } from "cog-http";

function cogSirvMiddleware(dir: string, prefix: string): MiddlewareHandler {
    return (req, res, next) => {
        req.raw.url = req.raw.url!.replace(new RegExp(`^${prefix}`), "") || "/";
        return sirv(dir)(req.raw, res.raw, next);
    };
}
```

...and use it like this:

```ts
const sirvMwPath = "/public";
app.use(sirvMwPath, cogSirvMiddleware("static", sirvMwPath));
```

That’s it! You can now serve static files in Cog with full control and great performance, thanks to
[Sirv](https://www.npmjs.com/package/sirv).
