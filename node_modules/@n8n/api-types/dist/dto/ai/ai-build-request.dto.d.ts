import type { IWorkflowBase, NodeExecutionSchema } from 'n8n-workflow';
import { z } from 'zod';
import { Z } from 'zod-class';
declare const AiBuilderChatRequestDto_base: Z.Class<{
    payload: z.ZodObject<{
        role: z.ZodLiteral<"user">;
        type: z.ZodLiteral<"message">;
        text: z.ZodString;
        workflowContext: z.ZodObject<{
            currentWorkflow: z.ZodOptional<z.ZodType<Partial<IWorkflowBase>, z.ZodTypeDef, Partial<IWorkflowBase>>>;
            executionData: z.ZodOptional<z.ZodType<{
                error?: import("n8n-workflow").ExecutionError;
                runData: import("n8n-workflow").IRunData;
                pinData?: import("n8n-workflow").IPinData;
                lastNodeExecuted?: string;
                metadata?: Record<string, string>;
            }, z.ZodTypeDef, {
                error?: import("n8n-workflow").ExecutionError;
                runData: import("n8n-workflow").IRunData;
                pinData?: import("n8n-workflow").IPinData;
                lastNodeExecuted?: string;
                metadata?: Record<string, string>;
            }>>;
            executionSchema: z.ZodOptional<z.ZodType<NodeExecutionSchema[], z.ZodTypeDef, NodeExecutionSchema[]>>;
        }, "strip", z.ZodTypeAny, {
            currentWorkflow?: Partial<IWorkflowBase> | undefined;
            executionData?: {
                error?: import("n8n-workflow").ExecutionError;
                runData: import("n8n-workflow").IRunData;
                pinData?: import("n8n-workflow").IPinData;
                lastNodeExecuted?: string;
                metadata?: Record<string, string>;
            } | undefined;
            executionSchema?: NodeExecutionSchema[] | undefined;
        }, {
            currentWorkflow?: Partial<IWorkflowBase> | undefined;
            executionData?: {
                error?: import("n8n-workflow").ExecutionError;
                runData: import("n8n-workflow").IRunData;
                pinData?: import("n8n-workflow").IPinData;
                lastNodeExecuted?: string;
                metadata?: Record<string, string>;
            } | undefined;
            executionSchema?: NodeExecutionSchema[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        type: "message";
        text: string;
        role: "user";
        workflowContext: {
            currentWorkflow?: Partial<IWorkflowBase> | undefined;
            executionData?: {
                error?: import("n8n-workflow").ExecutionError;
                runData: import("n8n-workflow").IRunData;
                pinData?: import("n8n-workflow").IPinData;
                lastNodeExecuted?: string;
                metadata?: Record<string, string>;
            } | undefined;
            executionSchema?: NodeExecutionSchema[] | undefined;
        };
    }, {
        type: "message";
        text: string;
        role: "user";
        workflowContext: {
            currentWorkflow?: Partial<IWorkflowBase> | undefined;
            executionData?: {
                error?: import("n8n-workflow").ExecutionError;
                runData: import("n8n-workflow").IRunData;
                pinData?: import("n8n-workflow").IPinData;
                lastNodeExecuted?: string;
                metadata?: Record<string, string>;
            } | undefined;
            executionSchema?: NodeExecutionSchema[] | undefined;
        };
    }>;
}>;
export declare class AiBuilderChatRequestDto extends AiBuilderChatRequestDto_base {
}
export {};
