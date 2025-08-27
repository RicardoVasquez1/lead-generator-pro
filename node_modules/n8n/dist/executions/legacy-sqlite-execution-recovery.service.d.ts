import { Logger } from '@n8n/backend-common';
import { GlobalConfig } from '@n8n/config';
import { DbConnection, ExecutionRepository } from '@n8n/db';
export declare class LegacySqliteExecutionRecoveryService {
    private readonly executionRepository;
    private readonly globalConfig;
    private readonly dbConnection;
    private readonly logger;
    constructor(logger: Logger, executionRepository: ExecutionRepository, globalConfig: GlobalConfig, dbConnection: DbConnection);
    cleanupWorkflowExecutions(): Promise<void>;
}
