---
title: SSR with React
sidebar_position: 2
---

# Server-side rendering with React

**Implementing SSR with React in Cog is surprisingly straightforward.**

Since Cog has zero dependencies by design, React support is not built-in. However, integrating it
manually using `react` and `react-dom/server` is quite simple.

## Setup

1. Install the required packages:

```bash
npm install react react-dom
```

2. If you're using TypeScript, install the type definitions for `react-dom`:

```bash
npm i --save-dev @types/react-dom
```

3. Add this line to your `tsconfig.json` compiler options:

```json
{
    "compilerOptions": {
        // Add this line to your config:
        "jsx": "react"
    }
}
```

## Example

Here's how you can render React components to HTML using `renderToString` and serve them in a Cog
route:

```tsx
// server.tsx
import { Cog } from "cog-http";
import { renderToString } from "react-dom/server";
import ExamplePage from "./ExamplePage.js";
import React from "react";

const app = new Cog();

app.get("/", (_, res) => {
    const html = renderToString(<ExamplePage name="Cog" />);
    res.html(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example Page</title>
</head>
<body>
    ${html}
</body>
</html>
`);
});

app.listen(3000, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:3000");
});
```

```tsx
// ExamplePage.tsx
import React from "react";

type Props = {
    name: string;
};

export default function ExamplePage({ name }: Props) {
    return (
        <>
            <h1>Hello, {name}!</h1>
            <p>Welcome to your server-side rendered React application!</p>
        </>
    );
}
```

## Pro tip

To avoid repeating the HTML boilerplate in every route, we recommend creating a utility function:

```tsx
function renderPage(component: React.ReactElement, title: string = "My App") {
    const html = renderToString(component);
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    ${html}
</body>
</html>
`;
}

// Usage in your routes:
app.get("/", (_, res) => {
    res.html(renderPage(<ExamplePage name="Cog" />, "Home"));
});
```

This approach keeps your code DRY and makes it easier to maintain consistent HTML structure across
your application.
