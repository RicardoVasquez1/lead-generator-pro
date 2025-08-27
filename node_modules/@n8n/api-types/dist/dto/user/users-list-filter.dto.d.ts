import { z } from 'zod';
import { Z } from 'zod-class';
export declare const USERS_LIST_SORT_OPTIONS: readonly ["firstName:asc", "firstName:desc", "lastName:asc", "lastName:desc", "email:asc", "email:desc", "role:asc", "role:desc", "mfaEnabled:asc", "mfaEnabled:desc", "lastActiveAt:asc", "lastActiveAt:desc"];
export type UsersListSortOptions = (typeof USERS_LIST_SORT_OPTIONS)[number];
declare const UsersListFilterDto_base: Z.Class<{
    take: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, number, string | undefined>, number, string | undefined>, number, string | undefined>;
    select: z.ZodOptional<z.ZodArray<z.ZodEnum<["id", "firstName", "lastName", "email", "disabled", "mfaEnabled", "role"]>, "many">>;
    filter: z.ZodOptional<z.ZodEffects<z.ZodOptional<z.ZodString>, {
        email?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        mfaEnabled?: boolean | undefined;
        isOwner?: boolean | undefined;
        fullText?: string | undefined;
    } | undefined, string | undefined>>;
    expand: z.ZodOptional<z.ZodArray<z.ZodEnum<["projectRelations"]>, "many">>;
    sortBy: z.ZodOptional<z.ZodArray<z.ZodEnum<["firstName:asc", "firstName:desc", "lastName:asc", "lastName:desc", "email:asc", "email:desc", "role:asc", "role:desc", "mfaEnabled:asc", "mfaEnabled:desc", "lastActiveAt:asc", "lastActiveAt:desc"]>, "many">>;
    skip: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, number, string | undefined>, number, string | undefined>;
}>;
export declare class UsersListFilterDto extends UsersListFilterDto_base {
}
export {};
