import { DatabaseConfig } from '@n8n/config';
import { ErrorReporter } from 'n8n-core';
import { DbConnectionOptions } from './db-connection-options';
type ConnectionState = {
    connected: boolean;
    migrated: boolean;
};
export declare class DbConnection {
    private readonly errorReporter;
    private readonly connectionOptions;
    private readonly databaseConfig;
    private dataSource;
    private pingTimer;
    readonly connectionState: ConnectionState;
    constructor(errorReporter: ErrorReporter, connectionOptions: DbConnectionOptions, databaseConfig: DatabaseConfig);
    get options(): import("@n8n/typeorm").DataSourceOptions;
    init(): Promise<void>;
    migrate(): Promise<void>;
    close(): Promise<void>;
    private scheduleNextPing;
    private ping;
}
export {};
