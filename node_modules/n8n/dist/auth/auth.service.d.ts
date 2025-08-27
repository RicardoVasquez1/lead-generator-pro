import { Logger } from '@n8n/backend-common';
import { GlobalConfig } from '@n8n/config';
import type { AuthenticatedRequest, User } from '@n8n/db';
import { InvalidAuthTokenRepository, UserRepository } from '@n8n/db';
import type { NextFunction, Response } from 'express';
import type { StringValue as TimeUnitValue } from 'ms';
import { License } from '../license';
import { MfaService } from '../mfa/mfa.service';
import { JwtService } from '../services/jwt.service';
import { UrlService } from '../services/url.service';
export declare class AuthService {
    private readonly globalConfig;
    private readonly logger;
    private readonly license;
    private readonly jwtService;
    private readonly urlService;
    private readonly userRepository;
    private readonly invalidAuthTokenRepository;
    private readonly mfaService;
    private skipBrowserIdCheckEndpoints;
    constructor(globalConfig: GlobalConfig, logger: Logger, license: License, jwtService: JwtService, urlService: UrlService, userRepository: UserRepository, invalidAuthTokenRepository: InvalidAuthTokenRepository, mfaService: MfaService);
    createAuthMiddleware(allowSkipMFA: boolean): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    clearCookie(res: Response): void;
    invalidateToken(req: AuthenticatedRequest): Promise<void>;
    issueCookie(res: Response, user: User, usedMfa: boolean, browserId?: string): void;
    issueJWT(user: User, usedMfa?: boolean, browserId?: string): string;
    resolveJwt(token: string, req: AuthenticatedRequest, res: Response): Promise<[User, {
        usedMfa: boolean;
    }]>;
    generatePasswordResetToken(user: User, expiresIn?: TimeUnitValue): string;
    generatePasswordResetUrl(user: User): string;
    resolvePasswordResetToken(token: string): Promise<User | undefined>;
    createJWTHash({ email, password, mfaEnabled, mfaSecret }: User): string;
    private hash;
    get jwtRefreshTimeout(): number;
    get jwtExpiration(): number;
}
