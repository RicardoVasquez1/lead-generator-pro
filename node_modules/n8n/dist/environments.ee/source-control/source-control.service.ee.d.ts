import { IWorkflowToImport } from '../../interfaces';
import type { PullWorkFolderRequestDto, PushWorkFolderRequestDto, SourceControlledFile } from '@n8n/api-types';
import { Logger } from '@n8n/backend-common';
import { type Variables, type TagEntity, FolderRepository, TagRepository, type User } from '@n8n/db';
import type { PushResult } from 'simple-git';
import { SourceControlExportService } from './source-control-export.service.ee';
import { SourceControlGitService } from './source-control-git.service.ee';
import { SourceControlImportService } from './source-control-import.service.ee';
import { SourceControlPreferencesService } from './source-control-preferences.service.ee';
import { SourceControlScopedService } from './source-control-scoped.service';
import type { StatusExportableCredential } from './types/exportable-credential';
import type { ExportableFolder } from './types/exportable-folders';
import type { ImportResult } from './types/import-result';
import type { SourceControlGetStatus } from './types/source-control-get-status';
import type { SourceControlPreferences } from './types/source-control-preferences';
import type { SourceControlWorkflowVersionId } from './types/source-control-workflow-version-id';
import { EventService } from '../../events/event.service';
export declare class SourceControlService {
    private readonly logger;
    private gitService;
    private sourceControlPreferencesService;
    private sourceControlExportService;
    private sourceControlImportService;
    private sourceControlScopedService;
    private tagRepository;
    private folderRepository;
    private readonly eventService;
    private sshKeyName;
    private sshFolder;
    private gitFolder;
    constructor(logger: Logger, gitService: SourceControlGitService, sourceControlPreferencesService: SourceControlPreferencesService, sourceControlExportService: SourceControlExportService, sourceControlImportService: SourceControlImportService, sourceControlScopedService: SourceControlScopedService, tagRepository: TagRepository, folderRepository: FolderRepository, eventService: EventService);
    init(): Promise<void>;
    private initGitService;
    sanityCheck(): Promise<void>;
    disconnect(options?: {
        keepKeyPair?: boolean;
    }): Promise<SourceControlPreferences>;
    initializeRepository(preferences: SourceControlPreferences, user: User): Promise<{
        branches: string[];
        currentBranch: string;
    }>;
    getBranches(): Promise<{
        branches: string[];
        currentBranch: string;
    }>;
    setBranch(branch: string): Promise<{
        branches: string[];
        currentBranch: string;
    }>;
    resetWorkfolder(): Promise<ImportResult | undefined>;
    pushWorkfolder(user: User, options: PushWorkFolderRequestDto): Promise<{
        statusCode: number;
        pushResult: PushResult | undefined;
        statusResult: SourceControlledFile[];
    }>;
    private getConflicts;
    private getWorkflowsToImport;
    private getWorkflowsToDelete;
    private getCredentialsToImport;
    private getCredentialsToDelete;
    private getTagsToImport;
    private getTagsToDelete;
    private getVariablesToImport;
    private getFoldersToImport;
    private getFoldersToDelete;
    private getVariablesToDelete;
    pullWorkfolder(user: User, options: PullWorkFolderRequestDto): Promise<{
        statusCode: number;
        statusResult: SourceControlledFile[];
    }>;
    getStatus(user: User, options: SourceControlGetStatus): Promise<{
        type: "workflow" | "credential" | "file" | "tags" | "variables" | "folders";
        status: "unknown" | "new" | "modified" | "deleted" | "created" | "renamed" | "conflicted" | "ignored" | "staged";
        id: string;
        name: string;
        updatedAt: string;
        file: string;
        location: "local" | "remote";
        conflict: boolean;
        pushed?: boolean | undefined;
        owner?: {
            type: "personal" | "team";
            projectId: string;
            projectName: string;
        } | undefined;
    }[] | {
        wfRemoteVersionIds: SourceControlWorkflowVersionId[];
        wfLocalVersionIds: SourceControlWorkflowVersionId[];
        wfMissingInLocal: SourceControlWorkflowVersionId[];
        wfMissingInRemote: SourceControlWorkflowVersionId[];
        wfModifiedInEither: SourceControlWorkflowVersionId[];
        credMissingInLocal: StatusExportableCredential[];
        credMissingInRemote: StatusExportableCredential[];
        credModifiedInEither: StatusExportableCredential[];
        varMissingInLocal: Variables[];
        varMissingInRemote: Variables[];
        varModifiedInEither: Variables[];
        tagsMissingInLocal: TagEntity[];
        tagsMissingInRemote: TagEntity[];
        tagsModifiedInEither: TagEntity[];
        mappingsMissingInLocal: import("@n8n/db").WorkflowTagMapping[];
        mappingsMissingInRemote: import("@n8n/db").WorkflowTagMapping[];
        foldersMissingInLocal: ExportableFolder[];
        foldersMissingInRemote: ExportableFolder[];
        foldersModifiedInEither: ExportableFolder[];
        sourceControlledFiles: {
            type: "workflow" | "credential" | "file" | "tags" | "variables" | "folders";
            status: "unknown" | "new" | "modified" | "deleted" | "created" | "renamed" | "conflicted" | "ignored" | "staged";
            id: string;
            name: string;
            updatedAt: string;
            file: string;
            location: "local" | "remote";
            conflict: boolean;
            pushed?: boolean | undefined;
            owner?: {
                type: "personal" | "team";
                projectId: string;
                projectName: string;
            } | undefined;
        }[];
    }>;
    private getStatusWorkflows;
    private getStatusCredentials;
    private getStatusVariables;
    private getStatusTagsMappings;
    private getStatusFoldersMapping;
    setGitUserDetails(name?: string, email?: string): Promise<void>;
    getRemoteFileEntity({ user, type, id, commit, }: {
        user: User;
        type: SourceControlledFile['type'];
        id?: string;
        commit?: string;
    }): Promise<IWorkflowToImport>;
}
