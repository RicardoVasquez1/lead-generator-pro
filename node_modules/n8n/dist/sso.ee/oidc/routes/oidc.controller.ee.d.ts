import { OidcConfigDto } from '@n8n/api-types';
import { AuthenticatedRequest } from '@n8n/db';
import { Request, Response } from 'express';
import { AuthService } from '../../../auth/auth.service';
import { UrlService } from '../../../services/url.service';
import { OidcService } from '../oidc.service.ee';
export declare class OidcController {
    private readonly oidcService;
    private readonly authService;
    private readonly urlService;
    constructor(oidcService: OidcService, authService: AuthService, urlService: UrlService);
    retrieveConfiguration(_req: AuthenticatedRequest): Promise<Pick<OidcConfigDto, "clientId" | "clientSecret" | "loginEnabled"> & {
        discoveryEndpoint: URL;
    }>;
    saveConfiguration(_req: AuthenticatedRequest, _res: Response, payload: OidcConfigDto): Promise<OidcConfigDto>;
    redirectToAuthProvider(_req: Request, res: Response): Promise<void>;
    callbackHandler(req: Request, res: Response): Promise<void>;
}
