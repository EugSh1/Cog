export function normalizePath(path: string) {
    if (path === "/") return path;
    return path.endsWith("/") ? path.slice(0, -1) : path;
}
