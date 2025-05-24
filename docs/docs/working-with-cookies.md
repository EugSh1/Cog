---
title: Working with cookies
sidebar_position: 2
---

## Reading Cookies

Cookies are available in the `req.cookies` object

```ts
app.get("/", (req, res) => {
    const { token } = req.cookies;

    if (token === "sk_a7298f5e-43eb-4aca-abd8-53a2c20df5ef") {
        return res.send({ message: "success" });
    }

    res.send("Forbidden", 403);
});
```

## Setting a cookie

```ts
res.setCookie("token", "f9a3e039-d605-4aea-a670-f1ab6b54b459");
```

Sets a `Set-Cookie` header.

### Setting a cookie with options

```ts
res.setCookie("token", "abc123", {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    domain: "example.com",
    expires: new Date("2077-01-01"),
    maxAge: 3600
});
```

## Clearing a Cookie

Sets the cookie with an expired date `(Expires=Thu, 01 Jan 1970)`.

```ts
res.clearCookie("token");
```
