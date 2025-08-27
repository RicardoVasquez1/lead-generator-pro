import { TestCaseExecutionRepository, TestRunRepository } from '@n8n/db';
import express from 'express';
import { InstanceSettings } from 'n8n-core';
import { TestRunnerService } from '../evaluation.ee/test-runner/test-runner.service.ee';
import { TestRunsRequest } from '../evaluation.ee/test-runs.types.ee';
import { Telemetry } from '../telemetry';
import { WorkflowFinderService } from '../workflows/workflow-finder.service';
export declare class TestRunsController {
    private readonly testRunRepository;
    private readonly workflowFinderService;
    private readonly testCaseExecutionRepository;
    private readonly testRunnerService;
    private readonly instanceSettings;
    private readonly telemetry;
    constructor(testRunRepository: TestRunRepository, workflowFinderService: WorkflowFinderService, testCaseExecutionRepository: TestCaseExecutionRepository, testRunnerService: TestRunnerService, instanceSettings: InstanceSettings, telemetry: Telemetry);
    private getTestRun;
    getMany(req: TestRunsRequest.GetMany): Promise<{
        finalResult: import("@n8n/db").TestRunFinalResult | null;
        status: import("@n8n/db/dist/entities/test-run.ee").TestRunStatus;
        runAt: Date | null;
        completedAt: Date | null;
        metrics: import("@n8n/db").AggregatedTestRunMetrics;
        errorCode: import("@n8n/db").TestRunErrorCode | null;
        errorDetails: import("n8n-workflow").IDataObject | null;
        workflow: import("@n8n/db").WorkflowEntity;
        workflowId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getOne(req: TestRunsRequest.GetOne): Promise<import("@n8n/db/dist/repositories/test-run.repository.ee").TestRunSummary>;
    getTestCases(req: TestRunsRequest.GetCases): Promise<import("@n8n/db").TestCaseExecution[]>;
    delete(req: TestRunsRequest.Delete): Promise<{
        success: boolean;
    }>;
    cancel(req: TestRunsRequest.Cancel, res: express.Response): Promise<void>;
    create(req: TestRunsRequest.Create, res: express.Response): Promise<express.Response<any, Record<string, any>>>;
}
