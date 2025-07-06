import type { IncomingMessage } from "http";
import type { StringOrJSON } from "./types";

export class CogRequest {
    constructor(
        public raw: IncomingMessage,
        public query: Record<string, string | undefined>,
        public body: StringOrJSON,
        public cookies: Record<string, string | undefined>,
        public url: string
    ) {}
}
