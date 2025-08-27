import type { CommunityNodeType } from '@n8n/api-types';
import { Logger } from '@n8n/backend-common';
import { CommunityPackagesConfig } from '../community-packages/community-packages.config';
import { StrapiCommunityNodeType } from './community-node-types-utils';
import { CommunityPackagesService } from './community-packages.service';
export declare class CommunityNodeTypesService {
    private readonly logger;
    private config;
    private communityPackagesService;
    private communityNodeTypes;
    private lastUpdateTimestamp;
    constructor(logger: Logger, config: CommunityPackagesConfig, communityPackagesService: CommunityPackagesService);
    private fetchNodeTypes;
    private detectEnvironment;
    private updateCommunityNodeTypes;
    private resetCommunityNodeTypes;
    private updateRequired;
    private createIsInstalled;
    getCommunityNodeTypes(): Promise<CommunityNodeType[]>;
    getCommunityNodeType(type: string): Promise<CommunityNodeType | null>;
    findVetted(packageName: string): StrapiCommunityNodeType | undefined;
}
