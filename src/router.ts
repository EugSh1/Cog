import type { RequestHandler, RequestMethod, Route } from "./types";
import { normalizePath } from "./utils.js";

export class Router {
    private prefix;
    private routes: Route[] = [];

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    private addRoute(method: RequestMethod, path: string, handler: RequestHandler) {
        this.routes.push({ method, path: normalizePath(this.prefix + path), handler });
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
        this.routes.push(...nestedRouter.getRoutes());
    }

    getRoutes() {
        return this.routes;
    }
}
