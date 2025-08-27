import type { ModuleInterface } from '@n8n/decorators';
export declare class InsightsModule implements ModuleInterface {
    init(): Promise<void>;
    entities(): Promise<(typeof import("./database/entities/insights-metadata").InsightsMetadata | typeof import("./database/entities/insights-raw").InsightsRaw | typeof import("./database/entities/insights-by-period").InsightsByPeriod)[]>;
    settings(): Promise<{
        summary: boolean;
        dashboard: boolean;
        dateRanges: {
            key: "day" | "week" | "2weeks" | "month" | "quarter" | "6months" | "year";
            licensed: boolean;
            granularity: "hour" | "day" | "week";
        }[];
    }>;
    shutdown(): Promise<void>;
}
