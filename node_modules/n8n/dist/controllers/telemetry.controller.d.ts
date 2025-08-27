import { GlobalConfig } from '@n8n/config';
import { AuthenticatedRequest } from '@n8n/db';
import { NextFunction, Response } from 'express';
export declare class TelemetryController {
    private readonly globalConfig;
    proxy: import("http-proxy-middleware").RequestHandler<import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, (err?: any) => void>;
    constructor(globalConfig: GlobalConfig);
    track(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    identify(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    page(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    sourceConfig(): Promise<unknown>;
}
