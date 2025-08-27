import type { AuthenticatedRequest } from '@n8n/db';
import type { Response } from 'express';
import type { PaginatedRequest } from '../../../../public-api/types';
declare const _default: {
    createProject: (((req: AuthenticatedRequest<{
        id?: string;
    }>, res: Response, next: import("express").NextFunction) => Promise<Response | void>) | ((req: import("express").Request, res: Response, next: import("express").NextFunction) => Promise<void>))[];
    updateProject: (((req: AuthenticatedRequest<{
        id?: string;
    }>, res: Response, next: import("express").NextFunction) => Promise<Response | void>) | ((req: import("express").Request, res: Response, next: import("express").NextFunction) => Promise<void>))[];
    deleteProject: (((req: AuthenticatedRequest<{
        id?: string;
    }>, res: Response, next: import("express").NextFunction) => Promise<Response | void>) | ((req: import("express").Request, res: Response, next: import("express").NextFunction) => Promise<void>))[];
    getProjects: (((req: PaginatedRequest, res: Response, next: import("express").NextFunction) => Response | void) | ((req: AuthenticatedRequest<{
        id?: string;
    }>, res: Response, next: import("express").NextFunction) => Promise<Response | void>) | ((req: import("express").Request, res: Response, next: import("express").NextFunction) => Promise<void>))[];
    addUsersToProject: (((req: AuthenticatedRequest<{
        id?: string;
    }>, res: Response, next: import("express").NextFunction) => Promise<Response | void>) | ((req: import("express").Request, res: Response, next: import("express").NextFunction) => Promise<void>))[];
    changeUserRoleInProject: (((req: AuthenticatedRequest<{
        id?: string;
    }>, res: Response, next: import("express").NextFunction) => Promise<Response | void>) | ((req: import("express").Request, res: Response, next: import("express").NextFunction) => Promise<void>))[];
    deleteUserFromProject: (((req: AuthenticatedRequest<{
        id?: string;
    }>, res: Response, next: import("express").NextFunction) => Promise<Response | void>) | ((req: import("express").Request, res: Response, next: import("express").NextFunction) => Promise<void>))[];
};
export = _default;
