export interface AgentMessageChunk {
    role: 'assistant';
    type: 'message';
    text: string;
}
export interface ToolProgressChunk {
    type: 'tool';
    toolName: string;
    status: string;
    [key: string]: unknown;
}
export interface WorkflowUpdateChunk {
    role: 'assistant';
    type: 'workflow-updated';
    codeSnippet: string;
}
export interface ExecutionRequestChunk {
    role: 'assistant';
    type: 'execution-requested';
    reason: string;
}
export type StreamChunk = AgentMessageChunk | ToolProgressChunk | WorkflowUpdateChunk | ExecutionRequestChunk;
export interface StreamOutput {
    messages: StreamChunk[];
}
export interface StreamProcessorConfig {
    threadConfig: {
        configurable: {
            thread_id: string;
        };
    };
    workflowUpdateTools?: string[];
}
