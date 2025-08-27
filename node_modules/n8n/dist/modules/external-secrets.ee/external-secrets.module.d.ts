import type { ModuleInterface } from '@n8n/decorators';
export declare class ExternalSecretsModule implements ModuleInterface {
    init(): Promise<void>;
    shutdown(): Promise<void>;
}
