import { ProjectRepository, WorkflowRepository } from '@n8n/db';
import { type AuthenticatedRequest, type CredentialsEntity, type Folder, type Project, type WorkflowEntity, type WorkflowTagMapping } from '@n8n/db';
import type { FindOptionsWhere } from '@n8n/typeorm';
import { SourceControlContext } from './types/source-control-context';
export declare class SourceControlScopedService {
    private readonly projectRepository;
    private readonly workflowRepository;
    constructor(projectRepository: ProjectRepository, workflowRepository: WorkflowRepository);
    ensureIsAllowedToPush(req: AuthenticatedRequest): Promise<void>;
    getAdminProjectsFromContext(context: SourceControlContext): Promise<Project[]>;
    getWorkflowsInAdminProjectsFromContext(context: SourceControlContext, id?: string): Promise<WorkflowEntity[] | undefined>;
    getAdminProjectsByContextFilter(context: SourceControlContext): FindOptionsWhere<Project> | undefined;
    getFoldersInAdminProjectsFromContextFilter(context: SourceControlContext): FindOptionsWhere<Folder>;
    getWorkflowsInAdminProjectsFromContextFilter(context: SourceControlContext): FindOptionsWhere<WorkflowEntity>;
    getCredentialsInAdminProjectsFromContextFilter(context: SourceControlContext): FindOptionsWhere<CredentialsEntity>;
    getWorkflowTagMappingInAdminProjectsFromContextFilter(context: SourceControlContext): FindOptionsWhere<WorkflowTagMapping>;
}
