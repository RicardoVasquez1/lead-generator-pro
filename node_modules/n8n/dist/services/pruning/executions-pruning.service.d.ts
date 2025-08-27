import { Logger } from '@n8n/backend-common';
import { ExecutionsConfig } from '@n8n/config';
import { ExecutionRepository, DbConnection } from '@n8n/db';
import { BinaryDataService, InstanceSettings } from 'n8n-core';
export declare class ExecutionsPruningService {
    private readonly logger;
    private readonly instanceSettings;
    private readonly dbConnection;
    private readonly executionRepository;
    private readonly binaryDataService;
    private readonly executionsConfig;
    private softDeletionInterval;
    private hardDeletionTimeout;
    private readonly rates;
    private readonly batchSize;
    private isShuttingDown;
    constructor(logger: Logger, instanceSettings: InstanceSettings, dbConnection: DbConnection, executionRepository: ExecutionRepository, binaryDataService: BinaryDataService, executionsConfig: ExecutionsConfig);
    init(): void;
    get isEnabled(): boolean;
    startPruning(): void;
    stopPruning(): void;
    private scheduleRollingSoftDeletions;
    private scheduleNextHardDeletion;
    softDelete(): Promise<void>;
    shutdown(): void;
    private hardDelete;
}
