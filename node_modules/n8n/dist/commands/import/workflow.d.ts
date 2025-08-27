import { z } from 'zod';
import { BaseCommand } from '../base-command';
declare const flagsSchema: z.ZodObject<{
    input: z.ZodOptional<z.ZodString>;
    separate: z.ZodDefault<z.ZodBoolean>;
    userId: z.ZodOptional<z.ZodString>;
    projectId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    separate: boolean;
    projectId?: string | undefined;
    userId?: string | undefined;
    input?: string | undefined;
}, {
    projectId?: string | undefined;
    userId?: string | undefined;
    input?: string | undefined;
    separate?: boolean | undefined;
}>;
export declare class ImportWorkflowsCommand extends BaseCommand<z.infer<typeof flagsSchema>> {
    run(): Promise<void>;
    private checkRelations;
    catch(error: Error): Promise<void>;
    private reportSuccess;
    private getWorkflowOwner;
    private workflowExists;
    private readWorkflows;
    private getProject;
}
export {};
