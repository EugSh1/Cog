import type { ServerResponse } from "http";
import type { CookieOptions, StringOrJSON } from "./types";
import { toCookieString } from "./utils.js";

export class CogResponse {
    constructor(public raw: ServerResponse) {}

    send(data: StringOrJSON, status: number = 200) {
        if (typeof data === "object" || Array.isArray(data)) {
            this.sendRaw(JSON.stringify(data), status, "application/json");
            return;
        }

        this.sendRaw(data, status, "text/plain");
    }

    sendRaw(data: unknown, status: number = 200, contentType = "text/plain") {
        this.raw.writeHead(status, { "Content-Type": contentType });
        this.raw.end(data);
    }

    html(data: string, status: number = 200) {
        this.sendRaw(data, status, "text/html");
    }

    redirect(url: string, status: number = 301) {
        this.raw.statusCode = status;
        this.set("Location", url);
        this.raw.end();
    }

    set(headerName: string, headerValue: string): void;
    set(header: Record<string, string>): void;
    set(headerName: string | Record<string, string>, headerValue?: string) {
        if (typeof headerName === "string" && headerValue !== undefined) {
            this.raw.setHeader(headerName, headerValue);
        } else if (typeof headerName === "object") {
            const headersMap = new Map(Object.entries(headerName));
            this.raw.setHeaders(headersMap);
        } else {
            throw new Error("Invalid arguments of res.set");
        }
    }

    setCookie(name: string, value: string, cookieOptions?: CookieOptions) {
        const cookieString = toCookieString(name, value, cookieOptions);
        const currentCookies = this.raw.getHeader("Set-Cookie");

        if (!currentCookies) {
            this.raw.setHeader("Set-Cookie", cookieString);
        } else if (Array.isArray(currentCookies)) {
            this.raw.setHeader("Set-Cookie", [...currentCookies, cookieString]);
        } else {
            this.raw.setHeader("Set-Cookie", [currentCookies as string, cookieString]);
        }
    }

    clearCookie(name: string, options: CookieOptions = {}) {
        this.setCookie(name, "", {
            ...options,
            expires: new Date(0)
        });
    }
}
