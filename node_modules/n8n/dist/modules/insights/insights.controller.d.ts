import { InsightsDateFilterDto, ListInsightsWorkflowQueryDto } from '@n8n/api-types';
import type { InsightsSummary, InsightsByTime, InsightsByWorkflow } from '@n8n/api-types';
import type { RestrictedInsightsByTime } from '@n8n/api-types/src/schemas/insights.schema';
import { AuthenticatedRequest } from '@n8n/db';
import { InsightsService } from './insights.service';
export declare class ForbiddenError extends Error {
    readonly httpStatusCode = 403;
    readonly errorCode = 403;
    readonly shouldReport = false;
}
export declare class InsightsController {
    private readonly insightsService;
    constructor(insightsService: InsightsService);
    private getMaxAgeInDaysAndGranularity;
    getInsightsSummary(_req: AuthenticatedRequest, _res: Response, payload?: InsightsDateFilterDto): Promise<InsightsSummary>;
    getInsightsByWorkflow(_req: AuthenticatedRequest, _res: Response, payload: ListInsightsWorkflowQueryDto): Promise<InsightsByWorkflow>;
    getInsightsByTime(_req: AuthenticatedRequest, _res: Response, payload: InsightsDateFilterDto): Promise<InsightsByTime[]>;
    getTimeSavedInsightsByTime(_req: AuthenticatedRequest, _res: Response, payload: InsightsDateFilterDto): Promise<RestrictedInsightsByTime[]>;
}
