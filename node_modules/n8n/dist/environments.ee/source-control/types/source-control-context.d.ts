import type { User } from '@n8n/db';
export declare class SourceControlContext {
    private readonly userInternal;
    constructor(userInternal: User);
    get user(): User;
    hasAccessToAllProjects(): boolean;
}
