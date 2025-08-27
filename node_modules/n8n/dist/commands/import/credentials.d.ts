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
export declare class ImportCredentialsCommand extends BaseCommand<z.infer<typeof flagsSchema>> {
    private transactionManager;
    run(): Promise<void>;
    catch(error: Error): Promise<void>;
    private reportSuccess;
    private storeCredential;
    private checkRelations;
    private readCredentials;
    private getCredentialOwner;
    private credentialExists;
    private getProject;
}
export {};
