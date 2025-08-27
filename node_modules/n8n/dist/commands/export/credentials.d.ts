import z from 'zod';
import { BaseCommand } from '../base-command';
declare const flagsSchema: z.ZodObject<{
    all: z.ZodOptional<z.ZodBoolean>;
    backup: z.ZodOptional<z.ZodBoolean>;
    id: z.ZodOptional<z.ZodString>;
    output: z.ZodOptional<z.ZodString>;
    pretty: z.ZodOptional<z.ZodBoolean>;
    separate: z.ZodOptional<z.ZodBoolean>;
    decrypted: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    all?: boolean | undefined;
    id?: string | undefined;
    output?: string | undefined;
    backup?: boolean | undefined;
    pretty?: boolean | undefined;
    separate?: boolean | undefined;
    decrypted?: boolean | undefined;
}, {
    all?: boolean | undefined;
    id?: string | undefined;
    output?: string | undefined;
    backup?: boolean | undefined;
    pretty?: boolean | undefined;
    separate?: boolean | undefined;
    decrypted?: boolean | undefined;
}>;
export declare class ExportCredentialsCommand extends BaseCommand<z.infer<typeof flagsSchema>> {
    run(): Promise<void>;
    catch(error: Error): Promise<void>;
}
export {};
