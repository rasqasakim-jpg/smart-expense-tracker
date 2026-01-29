import type { Request } from "express";

declare global {
    namespace Express{
        interface Request {
            startTime?: number
            apiKey?: string
            user?: {
                id: string;
                role?: string;
            }
        }
    }
}