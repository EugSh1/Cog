import { ServerResponse } from "http";
import type { CookieOptions } from "./types";
import { toCookieString } from "./utils.js";

ServerResponse.prototype.send = function (data, status = 200) {
    if (typeof data === "object" || Array.isArray(data)) {
        this.writeHead(status, { "Content-Type": "application/json" });
        this.end(JSON.stringify(data));
    } else {
        this.writeHead(status, { "Content-Type": "text/plain" });
        this.end(data);
    }
};

ServerResponse.prototype.html = function (data, status = 200) {
    this.writeHead(status, { "Content-Type": "text/html" });
    this.end(data);
};

ServerResponse.prototype.redirect = function (url, status = 301) {
    this.statusCode = status;
    this.set("Location", url);
    this.end();
};

ServerResponse.prototype.set = function (
    headerName: string | Record<string, string>,
    headerValue?: string
) {
    if (typeof headerName === "string" && headerValue !== undefined) {
        this.setHeader(headerName, headerValue);
    } else if (typeof headerName === "object") {
        const headersMap = new Map(Object.entries(headerName));
        this.setHeaders(headersMap);
    } else {
        throw new Error("Invalid arguments of res.set");
    }
};

ServerResponse.prototype.setCookie = function (
    name: string,
    value: string,
    cookieOptions?: CookieOptions
) {
    const cookieString = toCookieString(name, value, cookieOptions);
    const currentCookies = this.getHeader("Set-Cookie");

    if (!currentCookies) {
        this.setHeader("Set-Cookie", cookieString);
    } else if (Array.isArray(currentCookies)) {
        this.setHeader("Set-Cookie", [...currentCookies, cookieString]);
    } else {
        this.setHeader("Set-Cookie", [currentCookies as string, cookieString]);
    }
};

ServerResponse.prototype.clearCookie = function (name: string, options: CookieOptions = {}) {
    this.setCookie(name, "", {
        ...options,
        expires: new Date(0)
    });
};
