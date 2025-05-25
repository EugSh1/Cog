import { createServer, type Server, type IncomingMessage, type ServerResponse } from "http";
import type {
    Middleware,
    MiddlewareHandler,
    RequestHandler,
    RequestMethod,
    StringOrJSON
} from "./types";
import { Router } from "./router.js";
import { normalizePath, parseCookies } from "./utils.js";

export class Cog {
    private server: Server;
    private routes: Record<RequestMethod, Map<string, RequestHandler>> = {
        GET: new Map(),
        POST: new Map(),
        PUT: new Map(),
        DELETE: new Map(),
        HEAD: new Map(),
        OPTIONS: new Map(),
        PATCH: new Map()
    };
    private allPathMiddlewares: Middleware[] = [];
    private specificPathMiddlewares: Middleware[] = [];
    private static readonly methodsWithoutBody = new Set(["GET", "HEAD", "OPTIONS"]);

    constructor() {
        this.server = createServer(async (req, res) => {
            if (!req.url) {
                res.writeHead(500);
                res.end("No request url");
                return;
            }

            const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
            req.query = Object.fromEntries(parsedUrl.searchParams);

            req.cookies = parseCookies(req.headers.cookie);

            try {
                req.body = (await this.parseRequestBody(req, res)) as StringOrJSON;
            } catch (error) {
                console.error("Error parsing request body:", error);
                if (!res.headersSent) {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("Error parsing request body");
                }
                return;
            }

            const path = normalizePath(parsedUrl.pathname);

            const foundRouteHandler = this.findRoute(path, req.method as RequestMethod);
            const foundMiddlewares = this.findMiddlewares(path);

            if (foundRouteHandler) {
                const allHandlers: MiddlewareHandler[] = [
                    ...foundMiddlewares.map((middleware) => middleware.handler),
                    (req, res, _) => foundRouteHandler(req, res)
                ];

                let i = 0;

                function next() {
                    const currentHandler = allHandlers[i++];
                    if (!currentHandler) return;

                    currentHandler(req as IncomingMessage & { url: string }, res, next);
                }

                next();
            } else {
                res.writeHead(404);
                res.end("Not Found");
            }
        });
    }

    private parseRequestBody(req: IncomingMessage, res: ServerResponse) {
        return new Promise((resolve, reject) => {
            const rawBody: Buffer[] = [];

            if (req.method && Cog.methodsWithoutBody.has(req.method)) {
                req.on("data", () => {
                    res.writeHead(400);
                    res.end(`${req.method} does not support body`);
                    req.destroy();
                    return reject(new Error("Unsupported method for body"));
                });
                req.on("end", () => {
                    resolve("");
                });
                return;
            } else {
                req.on("data", (chunk: Buffer) => {
                    rawBody.push(chunk);
                });
            }

            req.on("error", (err) => {
                reject(err);
            });

            req.on("end", () => {
                const body = Buffer.concat(rawBody).toString();

                if (req.headers["content-type"]?.includes("application/json")) {
                    try {
                        return resolve(JSON.parse(body));
                    } catch (error) {
                        return reject(new Error(`Error parsing JSON body:\n${error}`));
                    }
                } else {
                    return resolve(body);
                }
            });
        });
    }

    private findRoute(path: string, method: RequestMethod) {
        return this.routes[method].get(path);
    }

    private findMiddlewares(path: string) {
        const foundSpecificPathMiddlewares = this.specificPathMiddlewares.filter(
            ({ path: middlewarePath }) => {
                if (path === middlewarePath) return true;
                return path.startsWith(
                    middlewarePath.endsWith("/") ? middlewarePath : middlewarePath + "/"
                );
            }
        );

        return [...this.allPathMiddlewares, ...foundSpecificPathMiddlewares];
    }

    private addRoute(method: RequestMethod, path: string, handler: RequestHandler) {
        this.routes[method].set(normalizePath(path), handler);
    }

    use(path: string, middleware: MiddlewareHandler) {
        const normalizedPath = normalizePath(path);
        const newMiddleware = { path: normalizedPath, handler: middleware };

        if (normalizedPath === "*" || normalizedPath === "/") {
            this.allPathMiddlewares.push(newMiddleware);
        } else {
            this.specificPathMiddlewares.push(newMiddleware);
        }
    }

    get(path: string, handler: RequestHandler) {
        this.addRoute("GET", path, handler);
    }

    post(path: string, handler: RequestHandler) {
        this.addRoute("POST", path, handler);
    }

    put(path: string, handler: RequestHandler) {
        this.addRoute("PUT", path, handler);
    }

    delete(path: string, handler: RequestHandler) {
        this.addRoute("DELETE", path, handler);
    }

    head(path: string, handler: RequestHandler) {
        this.addRoute("HEAD", path, handler);
    }

    options(path: string, handler: RequestHandler) {
        this.addRoute("OPTIONS", path, handler);
    }

    patch(path: string, handler: RequestHandler) {
        this.addRoute("PATCH", path, handler);
    }

    group(prefix: string, callback: (router: Router) => void) {
        const router = new Router(prefix);
        callback(router);
        for (const [method, routes] of Object.entries(router.getRoutes())) {
            for (const [path, handler] of routes.entries()) {
                this.routes[method as RequestMethod].set(path, handler);
            }
        }
    }

    listen(port: number, hostname: string, callback: () => void = () => {}) {
        this.server.listen(port, hostname, callback);
    }
}
