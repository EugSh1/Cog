---
title: Redirect Responses
sidebar_position: 4
---

# Sending Redirect Responses

To send an HTTP redirect response, use the `res.redirect()` method.

```ts
res.redirect(url: string, status?: number): void;
```

-   `url`: The URL to redirect to.
-   `status`: (Optional) HTTP status code for redirect. Defaults to `301` (Moved Permanently).

### Example

```ts
import { Cog } from "cog-http";

const app = new Cog();

app.get("/old-page", (_req, res) => {
    res.redirect("http://www.example.com/new-page");
});

app.listen(3000, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:3000");
});
```
