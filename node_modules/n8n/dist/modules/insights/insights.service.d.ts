import { type InsightsSummary, type InsightsDateRange } from '@n8n/api-types';
import { LicenseState, Logger } from '@n8n/backend-common';
import { InstanceSettings } from 'n8n-core';
import type { PeriodUnit, TypeUnit } from './database/entities/insights-shared';
import { InsightsByPeriodRepository } from './database/repositories/insights-by-period.repository';
import { InsightsCollectionService } from './insights-collection.service';
import { InsightsCompactionService } from './insights-compaction.service';
import { InsightsPruningService } from './insights-pruning.service';
export declare class InsightsService {
    private readonly insightsByPeriodRepository;
    private readonly compactionService;
    private readonly collectionService;
    private readonly pruningService;
    private readonly licenseState;
    private readonly instanceSettings;
    private readonly logger;
    constructor(insightsByPeriodRepository: InsightsByPeriodRepository, compactionService: InsightsCompactionService, collectionService: InsightsCollectionService, pruningService: InsightsPruningService, licenseState: LicenseState, instanceSettings: InstanceSettings, logger: Logger);
    settings(): {
        summary: boolean;
        dashboard: boolean;
        dateRanges: DateRange[];
    };
    startTimers(): void;
    startCompactionAndPruningTimers(): void;
    stopCompactionAndPruningTimers(): void;
    shutdown(): Promise<void>;
    getInsightsSummary({ periodLengthInDays, }: {
        periodLengthInDays: number;
    }): Promise<InsightsSummary>;
    getInsightsByWorkflow({ maxAgeInDays, skip, take, sortBy, }: {
        maxAgeInDays: number;
        skip?: number;
        take?: number;
        sortBy?: string;
    }): Promise<{
        count: number;
        data: {
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
        insightTypes?: TypeUnit[];
    }): Promise<{
        date: string;
        values: {
            failed?: number | undefined;
            succeeded?: number | undefined;
            timeSaved?: number | undefined;
        } & {
            total?: number;
            successRate?: number;
            failureRate?: number;
            averageRunTime?: number;
        };
    }[]>;
    getMaxAgeInDaysAndGranularity(dateRangeKey: InsightsDateRange['key']): InsightsDateRange & {
        maxAgeInDays: number;
    };
    getAvailableDateRanges(): DateRange[];
}
type DateRange = {
    key: 'day' | 'week' | '2weeks' | 'month' | 'quarter' | '6months' | 'year';
    licensed: boolean;
    granularity: 'hour' | 'day' | 'week';
};
export {};
