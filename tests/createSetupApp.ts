import { Cog } from "../src";

export function createSetupApp(initialPort: number) {
    let port = initialPort;

    return () => {
        const appPort = port++;
        const app = new Cog();
        app.listen(appPort, "127.0.0.1");
        return { app, appPort };
    };
}
