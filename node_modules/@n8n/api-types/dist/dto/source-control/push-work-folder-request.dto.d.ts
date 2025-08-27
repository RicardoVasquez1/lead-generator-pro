import { z } from 'zod';
import { Z } from 'zod-class';
declare const PushWorkFolderRequestDto_base: Z.Class<{
    force: z.ZodOptional<z.ZodBoolean>;
    commitMessage: z.ZodOptional<z.ZodString>;
    fileNames: z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        id: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<["credential", "workflow", "tags", "variables", "file", "folders"]>;
        status: z.ZodEnum<["new", "modified", "deleted", "created", "renamed", "conflicted", "ignored", "staged", "unknown"]>;
        location: z.ZodEnum<["local", "remote"]>;
        conflict: z.ZodBoolean;
        updatedAt: z.ZodString;
        pushed: z.ZodOptional<z.ZodBoolean>;
        owner: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<["personal", "team"]>;
            projectId: z.ZodString;
            projectName: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "personal" | "team";
            projectId: string;
            projectName: string;
        }, {
            type: "personal" | "team";
            projectId: string;
            projectName: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "workflow" | "credential" | "file" | "tags" | "variables" | "folders";
        status: "unknown" | "new" | "modified" | "deleted" | "created" | "renamed" | "conflicted" | "ignored" | "staged";
        id: string;
        name: string;
        updatedAt: string;
        file: string;
        location: "local" | "remote";
        conflict: boolean;
        pushed?: boolean | undefined;
        owner?: {
            type: "personal" | "team";
            projectId: string;
            projectName: string;
        } | undefined;
    }, {
        type: "workflow" | "credential" | "file" | "tags" | "variables" | "folders";
        status: "unknown" | "new" | "modified" | "deleted" | "created" | "renamed" | "conflicted" | "ignored" | "staged";
        id: string;
        name: string;
        updatedAt: string;
        file: string;
        location: "local" | "remote";
        conflict: boolean;
        pushed?: boolean | undefined;
        owner?: {
            type: "personal" | "team";
            projectId: string;
            projectName: string;
        } | undefined;
    }>, "many">;
}>;
export declare class PushWorkFolderRequestDto extends PushWorkFolderRequestDto_base {
}
export {};
