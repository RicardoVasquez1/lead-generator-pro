import { GlobalConfig } from '@n8n/config';
import { ControllerRegistryMetadata } from '@n8n/decorators';
import type { Application } from 'express';
import { AuthService } from './auth/auth.service';
import { License } from './license';
import { LastActiveAtService } from './services/last-active-at.service';
export declare class ControllerRegistry {
    private readonly license;
    private readonly authService;
    private readonly globalConfig;
    private readonly metadata;
    private readonly lastActiveAtService;
    constructor(license: License, authService: AuthService, globalConfig: GlobalConfig, metadata: ControllerRegistryMetadata, lastActiveAtService: LastActiveAtService);
    activate(app: Application): void;
    private activateController;
    private createRateLimitMiddleware;
    private createLicenseMiddleware;
    private createScopedMiddleware;
}
