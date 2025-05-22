# Cog

[![npm](https://img.shields.io/npm/v/cog-http)](https://www.npmjs.com/package/cog-http)
[![Minified size](https://img.shields.io/bundlephobia/min/cog-http)](https://bundlephobia.com/package/cog-http)
[![Min+gzip size](https://img.shields.io/bundlephobia/minzip/cog-http)](https://bundlephobia.com/package/cog-http)
[![Dependencies](https://badgen.net/bundlephobia/dependency-count/cog-http)](https://bundlephobia.com/package/cog-http)

A **tiny HTTP framework** built on Node's native `http` module, designed for simplicity and
flexibility in building backend servers and APIs.

```ts
import { Cog } from "cog-http";

const app = new Cog();

app.get("/", (_, res) => {
    res.set("X-Powered-By", "Cog");
    res.send({ message: "Hello from Cog!" });
});

app.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
```

## Features

-   **Ultra lightweight** 🪶

    -   Only **21.9 kB unpacked** — one of the smallest HTTP frameworks on npm.
    -   Minimal abstraction over Node.js native HTTP for maximum performance.

-   **Zero runtime dependencies** ⚡

    -   Only relies on Node.js built-in modules.
    -   No external packages needed to run.

-   **TypeScript-ready** 🛡️

    -   Type definitions included.
    -   Extends native HTTP types with convenient helpers.

-   **Easy routing** 🛣️

    -   Simple and intuitive routing API.
    -   Easy to use and extend.

-   **Middleware support** 🔄

    -   Supports middleware functions for request processing.
    -   Enables modular and reusable logic.

-   **Enhanced request & response** 📨

    -   Adds `query` and `body` parsing on `IncomingMessage`.
    -   Adds helper methods like `set` and `send` on `ServerResponse`.

## Technologies Used

Made with:

-   **Node.js** – Core platform.
-   **TypeScript** – For type safety and developer experience.
-   **Docusaurus** – For generating documentation and project website.

![Made with](https://go-skill-icons.vercel.app/api/icons?i=nodejs,ts&theme=dark)

## Usage

1. **Install**:
    - `npm install cog-http`
2. **Create server**:
    - Import and use the API to define routes, middleware, and handlers.
3. **Run your server**:
    - Use Node.js to run your app.

## Documentation

The documentation is available on [https://eugsh1.github.io/Cog](https://eugsh1.github.io/Cog).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
