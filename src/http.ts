import type { CookieOptions, StringOrJSON } from "./types";

declare module "http" {
    interface IncomingMessage {
        query: Record<string, string | undefined>;
        body: StringOrJSON;
        cookies: Record<string, string | undefined>;
    }

    interface ServerResponse {
        set(headerName: string, headerValue: string): void;
        set(header: Record<string, string>): void;
        send(data: StringOrJSON, status?: number): void;
        html(data: string, status?: number): void;
        setCookie(name: string, value: string, cookieOptions?: CookieOptions): void;
        clearCookie(name: string, cookieOptions?: CookieOptions): void;
    }
}

export {};
