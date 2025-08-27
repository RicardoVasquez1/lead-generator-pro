import type { AuthenticatedRequest } from '@n8n/db';
import type express from 'express';
import type { StatusResult } from 'simple-git';
import type { ImportResult } from '../../../../environments.ee/source-control/types/import-result';
declare const _default: {
    pull: (((req: AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>) | ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) | ((req: AuthenticatedRequest, res: express.Response) => Promise<ImportResult | StatusResult | Promise<express.Response>>))[];
};
export = _default;
