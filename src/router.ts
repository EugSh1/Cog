import type { RequestHandler, RequestMethod } from "./types";
import { normalizePath } from "./utils.js";

export class Router {
    private prefix;
    private routes: Record<RequestMethod, Map<string, RequestHandler>> = {
        GET: new Map(),
        POST: new Map(),
        PUT: new Map(),
        DELETE: new Map(),
        HEAD: new Map(),
        OPTIONS: new Map(),
        PATCH: new Map()
    };

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    private addRoute(method: RequestMethod, path: string, handler: RequestHandler) {
        this.routes[method].set(normalizePath(this.prefix + path), handler);
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

    group(subPrefix: string, callback: (router: Router) => void) {
        const nestedRouter = new Router(normalizePath(this.prefix + subPrefix));
        callback(nestedRouter);
        for (const [method, routes] of Object.entries(nestedRouter.getRoutes())) {
            for (const [path, handler] of routes.entries()) {
                this.routes[method as RequestMethod].set(path, handler);
            }
        }
    }

    getRoutes() {
        return this.routes;
    }
}
