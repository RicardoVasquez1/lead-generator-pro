import type { EntityManager } from '@n8n/typeorm';
import { DataSource, Repository } from '@n8n/typeorm';
import { type IDataObject } from 'n8n-workflow';
import { TestRun } from '../entities';
import type { AggregatedTestRunMetrics, TestRunErrorCode, TestRunFinalResult, ListQuery } from '../entities/types-db';
export type TestRunSummary = TestRun & {
    finalResult: TestRunFinalResult | null;
};
export declare class TestRunRepository extends Repository<TestRun> {
    constructor(dataSource: DataSource);
    createTestRun(workflowId: string): Promise<TestRun>;
    markAsRunning(id: string): Promise<import("@n8n/typeorm").UpdateResult>;
    markAsCompleted(id: string, metrics: AggregatedTestRunMetrics): Promise<import("@n8n/typeorm").UpdateResult>;
    markAsCancelled(id: string, trx?: EntityManager): Promise<import("@n8n/typeorm").UpdateResult>;
    markAsError(id: string, errorCode: TestRunErrorCode, errorDetails?: IDataObject): Promise<import("@n8n/typeorm").UpdateResult>;
    markAllIncompleteAsFailed(): Promise<import("@n8n/typeorm").UpdateResult>;
    getMany(workflowId: string, options: ListQuery.Options): Promise<{
        finalResult: TestRunFinalResult | null;
        status: import("../entities/test-run.ee").TestRunStatus;
        runAt: Date | null;
        completedAt: Date | null;
        metrics: AggregatedTestRunMetrics;
        errorCode: TestRunErrorCode | null;
        errorDetails: IDataObject | null;
        workflow: import("../entities").WorkflowEntity;
        workflowId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTestRunSummaryById(testRunId: string): Promise<TestRunSummary>;
}
