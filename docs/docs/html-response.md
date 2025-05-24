---
title: HTML Response
sidebar_position: 3
---

# Sending HTML Responses

To send HTML responses, you can use the `res.html()` method.

```ts
res.html(data: string, status?: number): void;
```

-   `data`: The HTML string you want to send.
-   `status`: (Optional) HTTP status code. Defaults to `200`.

### Example

```ts
import { Cog } from "cog-http";

const app = new Cog();

const Layout = (name: string | undefined) => `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello ${name || "Cog"}</title>
    <style>
        body {
            background-color: #181a1d;
            color: #cccccc;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }

        h1,
        h2 {
            color: #ecebeb;
        }
    </style>
</head>
<body>
    <h1>Hello${name ? `, ${name}` : " from Cog"}!</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis veritatis, ipsam at rem adipisci reiciendis.</p>
</body>
</html>
`;

app.get("/", (req, res) => {
    const { name } = req.query;
    res.html(Layout(name));
});

app.get("/about", (_, res) => {
    res.html("<h2>About us</h2>");
});

app.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
```
