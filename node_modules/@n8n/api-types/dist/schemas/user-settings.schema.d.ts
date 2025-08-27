import { z } from 'zod';
export declare const npsSurveyRespondedSchema: z.ZodObject<{
    lastShownAt: z.ZodNumber;
    responded: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    lastShownAt: number;
    responded: true;
}, {
    lastShownAt: number;
    responded: true;
}>;
export declare const npsSurveyWaitingSchema: z.ZodObject<{
    lastShownAt: z.ZodNumber;
    waitingForResponse: z.ZodLiteral<true>;
    ignoredCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    lastShownAt: number;
    waitingForResponse: true;
    ignoredCount: number;
}, {
    lastShownAt: number;
    waitingForResponse: true;
    ignoredCount: number;
}>;
export declare const npsSurveySchema: z.ZodUnion<[z.ZodObject<{
    lastShownAt: z.ZodNumber;
    responded: z.ZodLiteral<true>;
}, "strip", z.ZodTypeAny, {
    lastShownAt: number;
    responded: true;
}, {
    lastShownAt: number;
    responded: true;
}>, z.ZodObject<{
    lastShownAt: z.ZodNumber;
    waitingForResponse: z.ZodLiteral<true>;
    ignoredCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    lastShownAt: number;
    waitingForResponse: true;
    ignoredCount: number;
}, {
    lastShownAt: number;
    waitingForResponse: true;
    ignoredCount: number;
}>]>;
export declare const userSettingsSchema: z.ZodObject<{
    isOnboarded: z.ZodOptional<z.ZodBoolean>;
    firstSuccessfulWorkflowId: z.ZodOptional<z.ZodString>;
    userActivated: z.ZodOptional<z.ZodBoolean>;
    userActivatedAt: z.ZodOptional<z.ZodNumber>;
    allowSSOManualLogin: z.ZodOptional<z.ZodBoolean>;
    npsSurvey: z.ZodOptional<z.ZodUnion<[z.ZodObject<{
        lastShownAt: z.ZodNumber;
        responded: z.ZodLiteral<true>;
    }, "strip", z.ZodTypeAny, {
        lastShownAt: number;
        responded: true;
    }, {
        lastShownAt: number;
        responded: true;
    }>, z.ZodObject<{
        lastShownAt: z.ZodNumber;
        waitingForResponse: z.ZodLiteral<true>;
        ignoredCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        lastShownAt: number;
        waitingForResponse: true;
        ignoredCount: number;
    }, {
        lastShownAt: number;
        waitingForResponse: true;
        ignoredCount: number;
    }>]>>;
    easyAIWorkflowOnboarded: z.ZodOptional<z.ZodBoolean>;
    userClaimedAiCredits: z.ZodOptional<z.ZodBoolean>;
    dismissedCallouts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    userActivated?: boolean | undefined;
    allowSSOManualLogin?: boolean | undefined;
    easyAIWorkflowOnboarded?: boolean | undefined;
    dismissedCallouts?: Record<string, boolean> | undefined;
    isOnboarded?: boolean | undefined;
    firstSuccessfulWorkflowId?: string | undefined;
    userActivatedAt?: number | undefined;
    npsSurvey?: {
        lastShownAt: number;
        responded: true;
    } | {
        lastShownAt: number;
        waitingForResponse: true;
        ignoredCount: number;
    } | undefined;
    userClaimedAiCredits?: boolean | undefined;
}, {
    userActivated?: boolean | undefined;
    allowSSOManualLogin?: boolean | undefined;
    easyAIWorkflowOnboarded?: boolean | undefined;
    dismissedCallouts?: Record<string, boolean> | undefined;
    isOnboarded?: boolean | undefined;
    firstSuccessfulWorkflowId?: string | undefined;
    userActivatedAt?: number | undefined;
    npsSurvey?: {
        lastShownAt: number;
        responded: true;
    } | {
        lastShownAt: number;
        waitingForResponse: true;
        ignoredCount: number;
    } | undefined;
    userClaimedAiCredits?: boolean | undefined;
}>;
export type UserSettings = z.infer<typeof userSettingsSchema>;
