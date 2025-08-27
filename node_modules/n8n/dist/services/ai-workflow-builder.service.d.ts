import { ChatPayload } from '@n8n/ai-workflow-builder/dist/workflow-builder-agent';
import { Logger } from '@n8n/backend-common';
import { GlobalConfig } from '@n8n/config';
import type { IUser } from 'n8n-workflow';
import { License } from '../license';
import { NodeTypes } from '../node-types';
export declare class WorkflowBuilderService {
    private readonly nodeTypes;
    private readonly license;
    private readonly config;
    private readonly logger;
    private service;
    constructor(nodeTypes: NodeTypes, license: License, config: GlobalConfig, logger: Logger);
    private getService;
    chat(payload: ChatPayload, user: IUser, abortSignal?: AbortSignal): AsyncGenerator<import("@n8n/ai-workflow-builder").StreamOutput, void, unknown>;
    getSessions(workflowId: string | undefined, user: IUser): Promise<{
        sessions: {
            sessionId: string;
            messages: Record<string, unknown>[];
            lastUpdated: string;
        }[];
    }>;
}
