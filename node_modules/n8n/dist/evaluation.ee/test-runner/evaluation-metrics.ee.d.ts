import type { IDataObject } from 'n8n-workflow';
export interface EvaluationMetricsAddResultsInfo {
    addedMetrics: Record<string, number>;
    incorrectTypeMetrics: Set<string>;
}
export declare class EvaluationMetrics {
    private readonly rawMetricsByName;
    addResults(result: IDataObject): EvaluationMetricsAddResultsInfo;
    getAggregatedMetrics(): Record<string, number>;
}
