---
sidebar_position: 3
---

# Working with Body and Query Parameters

## Query Parameters

Query parameters are available on the request as `req.query` (parsed as an object):

```ts
app.get("/products", (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.send(products);
    }

    const productId = Number(id); // always a string, convert if needed
    if (Number.isNaN(productId)) {
        return res.send(products);
    }

    const foundProduct = products.find((product) => product.id === productId);

    if (foundProduct) {
        return res.send(foundProduct);
    }

    res.send("Product not found", 404);
});
```

## Request Body

For requests that support a body, Cog automatically parses the JSON body and exposes it as
`req.body`.

```ts
app.post("/products", (req, res) => {
    const body = req.body;

    if (typeof body !== "object" || Array.isArray(body)) {
        return res.send("Body must be an object", 400);
    }

    const { name, price } = body;

    if (typeof name !== "string" || typeof price !== "number") {
        return res.send("Product is invalid", 400);
    }

    const newProduct = { name, price };
    products.push(newProduct);

    res.send(newProduct);
});
```
