import type { OidcConfigDto } from '@n8n/api-types';
import { Logger } from '@n8n/backend-common';
import { GlobalConfig } from '@n8n/config';
import { AuthIdentityRepository, SettingsRepository, type User, UserRepository } from '@n8n/db';
import { Cipher } from 'n8n-core';
import { UrlService } from '../../services/url.service';
type OidcRuntimeConfig = Pick<OidcConfigDto, 'clientId' | 'clientSecret' | 'loginEnabled'> & {
    discoveryEndpoint: URL;
};
export declare class OidcService {
    private readonly settingsRepository;
    private readonly authIdentityRepository;
    private readonly urlService;
    private readonly globalConfig;
    private readonly userRepository;
    private readonly cipher;
    private readonly logger;
    private oidcConfig;
    constructor(settingsRepository: SettingsRepository, authIdentityRepository: AuthIdentityRepository, urlService: UrlService, globalConfig: GlobalConfig, userRepository: UserRepository, cipher: Cipher, logger: Logger);
    init(): Promise<void>;
    getCallbackUrl(): string;
    getRedactedConfig(): OidcConfigDto;
    generateLoginUrl(): Promise<URL>;
    loginUser(callbackUrl: URL): Promise<User>;
    loadConfig(decryptSecret?: boolean): Promise<OidcRuntimeConfig>;
    updateConfig(newConfig: OidcConfigDto): Promise<void>;
    private setOidcLoginEnabled;
    private cachedOidcConfiguration;
    private getOidcConfiguration;
}
export {};
