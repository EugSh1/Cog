---
sidebar_position: 2
---

# Routing

## Creating Routes

You can easily define routes using HTTP methods like `get`, `post`, `put`, `delete`:

```ts
app.get("/users", (req, res) => {
    res.send({ message: "List of users" });
});

app.post("/users", (req, res) => {
    res.send({ message: "Create user" });
});
```

## Route Groups

To organize routes, use route groups with a prefix:

```ts
app.group("/products", (products) => {
    products.get("/", (req, res) => {
        res.send("No products yet");
    });

    products.post("/new", (req, res) => {
        res.send("New product created");
    });
});
```
