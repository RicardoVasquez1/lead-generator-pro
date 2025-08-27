export declare const schema: {
    executions: {
        mode: {
            doc: string;
            format: readonly ["regular", "queue"];
            default: string;
            env: string;
        };
        concurrency: {
            productionLimit: {
                doc: string;
                format: NumberConstructor;
                default: number;
                env: string;
            };
            evaluationLimit: {
                doc: string;
                format: NumberConstructor;
                default: number;
                env: string;
            };
        };
        timeout: {
            doc: string;
            format: NumberConstructor;
            default: number;
            env: string;
        };
        maxTimeout: {
            doc: string;
            format: NumberConstructor;
            default: number;
            env: string;
        };
        saveDataOnError: {
            doc: string;
            format: readonly ["all", "none"];
            default: string;
            env: string;
        };
        saveDataOnSuccess: {
            doc: string;
            format: readonly ["all", "none"];
            default: string;
            env: string;
        };
        saveExecutionProgress: {
            doc: string;
            format: BooleanConstructor;
            default: boolean;
            env: string;
        };
        saveDataManualExecutions: {
            doc: string;
            format: BooleanConstructor;
            default: boolean;
            env: string;
        };
        queueRecovery: {
            interval: {
                doc: string;
                format: NumberConstructor;
                default: number;
                env: string;
            };
            batchSize: {
                doc: string;
                format: NumberConstructor;
                default: number;
                env: string;
            };
        };
    };
    userManagement: {
        jwtSecret: {
            doc: string;
            format: StringConstructor;
            default: string;
            env: string;
        };
        jwtSessionDurationHours: {
            doc: string;
            format: NumberConstructor;
            default: number;
            env: string;
        };
        jwtRefreshTimeoutHours: {
            doc: string;
            format: NumberConstructor;
            default: number;
            env: string;
        };
        isInstanceOwnerSetUp: {
            doc: string;
            format: BooleanConstructor;
            default: boolean;
        };
        authenticationMethod: {
            doc: string;
            format: readonly ["email", "ldap", "saml"];
            default: string;
        };
    };
    endpoints: {
        rest: {
            format: StringConstructor;
            default: string;
        };
    };
    ai: {
        enabled: {
            format: BooleanConstructor;
            default: boolean;
        };
    };
};
