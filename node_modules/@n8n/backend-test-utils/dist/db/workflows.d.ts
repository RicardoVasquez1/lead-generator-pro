import type { SharedWorkflow, IWorkflowDb } from '@n8n/db';
import { Project, User } from '@n8n/db';
import type { WorkflowSharingRole } from '@n8n/permissions';
import type { DeepPartial } from '@n8n/typeorm';
import type { IWorkflowBase } from 'n8n-workflow';
export declare function newWorkflow(attributes?: Partial<IWorkflowDb>): IWorkflowDb;
export declare function createWorkflow(attributes?: Partial<IWorkflowDb>, userOrProject?: User | Project): Promise<IWorkflowDb & import("@n8n/db").WorkflowEntity>;
export declare function createManyWorkflows(amount: number, attributes?: Partial<IWorkflowDb>, user?: User): Promise<(IWorkflowDb & import("@n8n/db").WorkflowEntity)[]>;
export declare function shareWorkflowWithUsers(workflow: IWorkflowBase, users: User[]): Promise<(DeepPartial<SharedWorkflow> & SharedWorkflow)[]>;
export declare function shareWorkflowWithProjects(workflow: IWorkflowBase, projectsWithRole: Array<{
    project: Project;
    role?: WorkflowSharingRole;
}>): Promise<SharedWorkflow[]>;
export declare function getWorkflowSharing(workflow: IWorkflowBase): Promise<SharedWorkflow[]>;
export declare function createWorkflowWithTrigger(attributes?: Partial<IWorkflowDb>, user?: User): Promise<IWorkflowDb & import("@n8n/db").WorkflowEntity>;
export declare function getAllWorkflows(): Promise<import("@n8n/db").WorkflowEntity[]>;
export declare function getAllSharedWorkflows(): Promise<SharedWorkflow[]>;
export declare const getWorkflowById: (id: string) => Promise<import("@n8n/db").WorkflowEntity | null>;
