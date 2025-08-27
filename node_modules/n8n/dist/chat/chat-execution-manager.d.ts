import { ExecutionRepository } from '@n8n/db';
import type { IExecutionResponse } from '@n8n/db';
import { WorkflowRunner } from '../workflow-runner';
import type { ChatMessage } from './chat-service.types';
import { NodeTypes } from '../node-types';
import { OwnershipService } from '../services/ownership.service';
export declare class ChatExecutionManager {
    private readonly executionRepository;
    private readonly workflowRunner;
    private readonly ownershipService;
    private readonly nodeTypes;
    constructor(executionRepository: ExecutionRepository, workflowRunner: WorkflowRunner, ownershipService: OwnershipService, nodeTypes: NodeTypes);
    runWorkflow(execution: IExecutionResponse, message: ChatMessage): Promise<void>;
    cancelExecution(executionId: string): Promise<void>;
    findExecution(executionId: string): Promise<IExecutionResponse | undefined>;
    checkIfExecutionExists(executionId: string): Promise<IExecutionResponse | undefined>;
    private getWorkflow;
    private mapFilesToBinaryData;
    private runNode;
    private getRunData;
}
