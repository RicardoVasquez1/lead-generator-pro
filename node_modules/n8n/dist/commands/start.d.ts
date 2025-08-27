import { z } from 'zod';
import { BaseCommand } from './base-command';
import { ActiveWorkflowManager } from '../active-workflow-manager';
import { Server } from '../server';
declare const flagsSchema: z.ZodObject<{
    open: z.ZodOptional<z.ZodBoolean>;
    tunnel: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    open?: boolean | undefined;
    tunnel?: boolean | undefined;
}, {
    open?: boolean | undefined;
    tunnel?: boolean | undefined;
}>;
export declare class Start extends BaseCommand<z.infer<typeof flagsSchema>> {
    protected activeWorkflowManager: ActiveWorkflowManager;
    protected server: Server;
    needsCommunityPackages: boolean;
    needsTaskRunner: boolean;
    private getEditorUrl;
    private openBrowser;
    stopProcess(): Promise<void>;
    private generateStaticAssets;
    init(): Promise<void>;
    initOrchestration(): Promise<void>;
    run(): Promise<void>;
    catch(error: Error): Promise<void>;
    private runEnqueuedExecutions;
}
export {};
