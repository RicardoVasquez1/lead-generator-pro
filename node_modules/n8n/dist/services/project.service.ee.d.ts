import type { CreateProjectDto, ProjectType, UpdateProjectDto } from '@n8n/api-types';
import { LicenseState } from '@n8n/backend-common';
import { DatabaseConfig } from '@n8n/config';
import type { User } from '@n8n/db';
import { Project, ProjectRelation, ProjectRelationRepository, ProjectRepository, SharedCredentialsRepository, SharedWorkflowRepository } from '@n8n/db';
import { type Scope, type ProjectRole } from '@n8n/permissions';
import type { EntityManager } from '@n8n/typeorm';
import { UserError } from 'n8n-workflow';
import { CacheService } from './cache/cache.service';
import { RoleService } from './role.service';
type Relation = Pick<ProjectRelation, 'userId' | 'role'>;
export declare class TeamProjectOverQuotaError extends UserError {
    constructor(limit: number);
}
export declare class UnlicensedProjectRoleError extends UserError {
    constructor(role: ProjectRole);
}
export declare class ProjectService {
    private readonly sharedWorkflowRepository;
    private readonly projectRepository;
    private readonly projectRelationRepository;
    private readonly roleService;
    private readonly sharedCredentialsRepository;
    private readonly cacheService;
    private readonly licenseState;
    private readonly databaseConfig;
    constructor(sharedWorkflowRepository: SharedWorkflowRepository, projectRepository: ProjectRepository, projectRelationRepository: ProjectRelationRepository, roleService: RoleService, sharedCredentialsRepository: SharedCredentialsRepository, cacheService: CacheService, licenseState: LicenseState, databaseConfig: DatabaseConfig);
    private get workflowService();
    private get credentialsService();
    private get folderService();
    deleteProject(user: User, projectId: string, { migrateToProject }?: {
        migrateToProject?: string;
    }): Promise<void>;
    findProjectsWorkflowIsIn(workflowId: string): Promise<string[]>;
    getAccessibleProjects(user: User): Promise<Project[]>;
    getPersonalProjectOwners(projectIds: string[]): Promise<ProjectRelation[]>;
    private createTeamProjectWithEntityManager;
    createTeamProject(adminUser: User, data: CreateProjectDto): Promise<Project>;
    updateProject(projectId: string, { name, icon, description }: UpdateProjectDto): Promise<void>;
    getPersonalProject(user: User): Promise<Project | null>;
    getProjectRelationsForUser(user: User): Promise<ProjectRelation[]>;
    syncProjectRelations(projectId: string, relations: Required<UpdateProjectDto>['relations']): Promise<{
        project: Project;
        newRelations: Required<UpdateProjectDto>['relations'];
    }>;
    addUsersToProject(projectId: string, relations: Relation[]): Promise<void>;
    private getTeamProjectWithRelations;
    private checkRolesLicensed;
    private isUserProjectOwner;
    deleteUserFromProject(projectId: string, userId: string): Promise<void>;
    changeUserRoleInProject(projectId: string, userId: string, role: ProjectRole): Promise<void>;
    clearCredentialCanUseExternalSecretsCache(projectId: string): Promise<void>;
    pruneRelations(em: EntityManager, project: Project): Promise<void>;
    addManyRelations(em: EntityManager, project: Project, relations: Array<{
        userId: string;
        role: ProjectRole;
    }>): Promise<void>;
    getProjectWithScope(user: User, projectId: string, scopes: Scope[], entityManager?: EntityManager): Promise<Project | null>;
    addUser(projectId: string, { userId, role }: Relation, trx?: EntityManager): Promise<{
        projectId: string;
        userId: string;
        role: "project:personalOwner" | "project:admin" | "project:editor" | "project:viewer";
    } & ProjectRelation>;
    getProject(projectId: string): Promise<Project>;
    getProjectRelations(projectId: string): Promise<ProjectRelation[]>;
    getUserOwnedOrAdminProjects(userId: string): Promise<Project[]>;
    getProjectCounts(): Promise<Record<ProjectType, number>>;
}
export {};
