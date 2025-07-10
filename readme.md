# Cog

[![npm](https://img.shields.io/npm/v/cog-http)](https://www.npmjs.com/package/cog-http)
[![Unpacked size](https://img.shields.io/npm/unpacked-size/cog-http)](https://www.npmjs.com/package/cog-http)
[![npm weekly downloads](https://img.shields.io/npm/dw/cog-http)](https://www.npmjs.com/package/cog-http)
[![Dependencies](https://badgen.net/bundlephobia/dependency-count/cog-http)](https://bundlephobia.com/package/cog-http)
[![CI/CD](https://github.com/EugSh1/Cog/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/EugSh1/Cog/actions/workflows/ci-cd.yml)

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

    -   Only **25.4 kB unpacked** - among the smallest HTTP frameworks on npm.
    -   Minimal abstraction over Node.js native HTTP for maximum performance.

-   **Zero runtime dependencies** ⚡

    -   Only relies on Node.js built-in modules.
    -   No external packages needed to run.

-   **TypeScript-ready** 🛡️

    -   Type definitions included.
    -   Custom `CogRequest` and `CogResponse` classes with convenient helpers.

-   **Easy integration** 🧩

    -   Easily integrates with tools like **React (SSR)**, **sirv**, **cors**, **helmet**, or any
        Node-compatible utility.
    -   Cog stays out of your way - no magic, no lock-in.

-   **Easy routing & middleware** 🔄

    -   Simple and intuitive routing API with middleware support.
    -   Easy to use and extend.

## Technologies Used

Made with:

-   **Node.js** – Core platform.
-   **TypeScript** – For type safety and developer experience.
-   **Vitest** - For fast unit testing.
-   **Docusaurus** – For generating documentation and project website.
-   **GitHub Actions** – For automated CI/CD pipeline.

![Made with](https://go-skill-icons.vercel.app/api/icons?i=nodejs,ts,vitest&theme=dark)

## Usage

1. **Install**:
    - ```bash
      npm install cog-http
      npm install --save-dev @types/node
      ```
2. **Create server**:
    - Import and use the API to define routes, middleware, and handlers.
3. **Run your server**:
    - Use Node.js to run your app.

## Documentation

The documentation is available on [https://eugsh1.github.io/Cog](https://eugsh1.github.io/Cog).

## Contributing

We welcome contributions and appreciate your help in improving Cog.

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting issues or pull
requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
