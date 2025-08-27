import type { InstalledPackages } from '@n8n/db';
import { CommunityNodeTypesService } from './community-node-types.service';
import { CommunityPackagesService } from '../community-packages/community-packages.service';
import { EventService } from '../events/event.service';
import { Push } from '../push';
import { NodeRequest } from '../requests';
export declare function isNpmError(error: unknown): error is {
    code: number;
    stdout: string;
};
export declare class CommunityPackagesController {
    private readonly push;
    private readonly communityPackagesService;
    private readonly eventService;
    private readonly communityNodeTypesService;
    constructor(push: Push, communityPackagesService: CommunityPackagesService, eventService: EventService, communityNodeTypesService: CommunityNodeTypesService);
    installPackage(req: NodeRequest.Post): Promise<InstalledPackages>;
    getInstalledPackages(): Promise<InstalledPackages[] | import("n8n-workflow").PublicInstalledPackage[]>;
    uninstallPackage(req: NodeRequest.Delete): Promise<void>;
    updatePackage(req: NodeRequest.Update): Promise<InstalledPackages>;
}
