import type express from 'express';
import type { TagRequest } from '../../../types';
declare const _default: {
    createTag: (((req: import("@n8n/db").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>) | ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) | ((req: TagRequest.Create, res: express.Response) => Promise<express.Response>))[];
    updateTag: (((req: import("@n8n/db").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>) | ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>))[];
    deleteTag: (((req: import("@n8n/db").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>) | ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>))[];
    getTags: (((req: import("../../../types").PaginatedRequest, res: express.Response, next: express.NextFunction) => express.Response | void) | ((req: import("@n8n/db").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>) | ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>) | ((req: TagRequest.GetAll, res: express.Response) => Promise<express.Response>))[];
    getTag: (((req: import("@n8n/db").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>) | ((req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>))[];
};
export = _default;
