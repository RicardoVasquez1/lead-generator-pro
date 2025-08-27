import { IWorkflowToImport } from '../../interfaces';
import { PullWorkFolderRequestDto, PushWorkFolderRequestDto } from '@n8n/api-types';
import type { SourceControlledFile } from '@n8n/api-types';
import { AuthenticatedRequest } from '@n8n/db';
import express from 'express';
import type { PullResult } from 'simple-git';
import { SourceControlPreferencesService } from './source-control-preferences.service.ee';
import { SourceControlScopedService } from './source-control-scoped.service';
import { SourceControlService } from './source-control.service.ee';
import type { ImportResult } from './types/import-result';
import { SourceControlRequest } from './types/requests';
import type { SourceControlPreferences } from './types/source-control-preferences';
import { EventService } from '../../events/event.service';
export declare class SourceControlController {
    private readonly sourceControlService;
    private readonly sourceControlPreferencesService;
    private readonly sourceControlScopedService;
    private readonly eventService;
    constructor(sourceControlService: SourceControlService, sourceControlPreferencesService: SourceControlPreferencesService, sourceControlScopedService: SourceControlScopedService, eventService: EventService);
    getPreferences(): Promise<SourceControlPreferences>;
    setPreferences(req: SourceControlRequest.UpdatePreferences): Promise<SourceControlPreferences>;
    updatePreferences(req: SourceControlRequest.UpdatePreferences): Promise<SourceControlPreferences>;
    disconnect(req: SourceControlRequest.Disconnect): Promise<SourceControlPreferences>;
    getBranches(): Promise<{
        branches: string[];
        currentBranch: string;
    }>;
    pushWorkfolder(req: AuthenticatedRequest, res: express.Response, payload: PushWorkFolderRequestDto): Promise<SourceControlledFile[]>;
    pullWorkfolder(req: AuthenticatedRequest, res: express.Response, payload: PullWorkFolderRequestDto): Promise<SourceControlledFile[] | ImportResult | PullResult | undefined>;
    resetWorkfolder(): Promise<ImportResult | undefined>;
    getStatus(req: SourceControlRequest.GetStatus): Promise<{
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
        wfRemoteVersionIds: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        wfLocalVersionIds: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        wfMissingInLocal: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        wfMissingInRemote: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        wfModifiedInEither: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        credMissingInLocal: import("./types/exportable-credential").StatusExportableCredential[];
        credMissingInRemote: import("./types/exportable-credential").StatusExportableCredential[];
        credModifiedInEither: import("./types/exportable-credential").StatusExportableCredential[];
        varMissingInLocal: import("@n8n/db").Variables[];
        varMissingInRemote: import("@n8n/db").Variables[];
        varModifiedInEither: import("@n8n/db").Variables[];
        tagsMissingInLocal: import("@n8n/db").TagEntity[];
        tagsMissingInRemote: import("@n8n/db").TagEntity[];
        tagsModifiedInEither: import("@n8n/db").TagEntity[];
        mappingsMissingInLocal: import("@n8n/db").WorkflowTagMapping[];
        mappingsMissingInRemote: import("@n8n/db").WorkflowTagMapping[];
        foldersMissingInLocal: import("./types/exportable-folders").ExportableFolder[];
        foldersMissingInRemote: import("./types/exportable-folders").ExportableFolder[];
        foldersModifiedInEither: import("./types/exportable-folders").ExportableFolder[];
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
    status(req: SourceControlRequest.GetStatus): Promise<{
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
        wfRemoteVersionIds: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        wfLocalVersionIds: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        wfMissingInLocal: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        wfMissingInRemote: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        wfModifiedInEither: import("./types/source-control-workflow-version-id").SourceControlWorkflowVersionId[];
        credMissingInLocal: import("./types/exportable-credential").StatusExportableCredential[];
        credMissingInRemote: import("./types/exportable-credential").StatusExportableCredential[];
        credModifiedInEither: import("./types/exportable-credential").StatusExportableCredential[];
        varMissingInLocal: import("@n8n/db").Variables[];
        varMissingInRemote: import("@n8n/db").Variables[];
        varModifiedInEither: import("@n8n/db").Variables[];
        tagsMissingInLocal: import("@n8n/db").TagEntity[];
        tagsMissingInRemote: import("@n8n/db").TagEntity[];
        tagsModifiedInEither: import("@n8n/db").TagEntity[];
        mappingsMissingInLocal: import("@n8n/db").WorkflowTagMapping[];
        mappingsMissingInRemote: import("@n8n/db").WorkflowTagMapping[];
        foldersMissingInLocal: import("./types/exportable-folders").ExportableFolder[];
        foldersMissingInRemote: import("./types/exportable-folders").ExportableFolder[];
        foldersModifiedInEither: import("./types/exportable-folders").ExportableFolder[];
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
    generateKeyPair(req: SourceControlRequest.GenerateKeyPair): Promise<SourceControlPreferences>;
    getFileContent(req: AuthenticatedRequest & {
        params: {
            type: SourceControlledFile['type'];
            id: string;
        };
    }): Promise<{
        content: IWorkflowToImport;
        type: SourceControlledFile['type'];
    }>;
}
