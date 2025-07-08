---
sidebar_position: 1
---

# Create a Server

To create a simple HTTP server with Cog, follow this example:

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

This example shows how to:

-   Import the Cog class
-   Create an instance of the server
-   Define a GET route for the root path
-   Set custom headers and send a JSON response
-   Start the server listening on port 3000 and localhost
