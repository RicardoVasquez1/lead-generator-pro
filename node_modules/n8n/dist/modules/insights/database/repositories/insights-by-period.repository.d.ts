import type { SelectQueryBuilder } from '@n8n/typeorm';
import { DataSource, Repository } from '@n8n/typeorm';
import { InsightsByPeriod } from '../entities/insights-by-period';
import type { PeriodUnit, TypeUnit } from '../entities/insights-shared';
export declare class InsightsByPeriodRepository extends Repository<InsightsByPeriod> {
    private isRunningCompaction;
    constructor(dataSource: DataSource);
    private escapeField;
    private getPeriodFilterExpr;
    private getPeriodStartExpr;
    getPeriodInsightsBatchQuery({ periodUnitToCompactFrom, compactionBatchSize, maxAgeInDays, }: {
        periodUnitToCompactFrom: PeriodUnit;
        compactionBatchSize: number;
        maxAgeInDays: number;
    }): SelectQueryBuilder<{
        id: number;
        metaId: number;
        type: string;
        value: number;
        periodStart: Date;
    }>;
    getAggregationQuery(periodUnit: PeriodUnit): SelectQueryBuilder<import("@n8n/typeorm").ObjectLiteral>;
    compactSourceDataIntoInsightPeriod({ sourceBatchQuery, sourceTableName, periodUnitToCompactInto, }: {
        sourceBatchQuery: SelectQueryBuilder<{
            id: number;
            metaId: number;
            type: string;
            value: number;
            periodStart: Date;
        }>;
        sourceTableName?: string;
        periodUnitToCompactInto: PeriodUnit;
    }): Promise<number>;
    private getAgeLimitQuery;
    getPreviousAndCurrentPeriodTypeAggregates({ periodLengthInDays, }: {
        periodLengthInDays: number;
    }): Promise<Array<{
        period: 'previous' | 'current';
        type: 0 | 1 | 2 | 3;
        total_value: string | number;
    }>>;
    private parseSortingParams;
    getInsightsByWorkflow({ maxAgeInDays, skip, take, sortBy, }: {
        maxAgeInDays: number;
        skip?: number;
        take?: number;
        sortBy?: string;
    }): Promise<{
        count: number;
        rows: {
            workflowId: string;
            projectId: string;
            workflowName: string;
            projectName: string;
            failed: number;
            succeeded: number;
            total: number;
            runTime: number;
            timeSaved: number;
            failureRate: number;
            averageRunTime: number;
        }[];
    }>;
    getInsightsByTime({ maxAgeInDays, periodUnit, insightTypes, }: {
        maxAgeInDays: number;
        periodUnit: PeriodUnit;
        insightTypes: TypeUnit[];
    }): Promise<{
        periodStart: string;
        failed?: number | undefined;
        succeeded?: number | undefined;
        runTime?: number | undefined;
        timeSaved?: number | undefined;
    }[]>;
    pruneOldData(maxAgeInDays: number): Promise<{
        affected: number | null | undefined;
    }>;
}
