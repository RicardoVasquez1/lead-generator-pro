import convict from 'convict';
declare const config: convict.Config<{
    executions: {
        mode: string;
        concurrency: {
            productionLimit: number;
            evaluationLimit: number;
        };
        timeout: number;
        maxTimeout: number;
        saveDataOnError: string;
        saveDataOnSuccess: string;
        saveExecutionProgress: boolean;
        saveDataManualExecutions: boolean;
        queueRecovery: {
            interval: number;
            batchSize: number;
        };
    };
    userManagement: {
        jwtSecret: string;
        jwtSessionDurationHours: number;
        jwtRefreshTimeoutHours: number;
        isInstanceOwnerSetUp: boolean;
        authenticationMethod: string;
    };
    endpoints: {
        rest: string;
    };
    ai: {
        enabled: boolean;
    };
}>;
export default config;
export type Config = typeof config;
