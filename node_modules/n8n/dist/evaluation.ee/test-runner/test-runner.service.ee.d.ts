import { Logger } from '@n8n/backend-common';
import type { User, TestRun } from '@n8n/db';
import { TestCaseExecutionRepository, TestRunRepository, WorkflowRepository } from '@n8n/db';
import { ErrorReporter } from 'n8n-core';
import type { IRun, IWorkflowBase } from 'n8n-workflow';
import { ActiveExecutions } from '../../active-executions';
import { Telemetry } from '../../telemetry';
import { WorkflowRunner } from '../../workflow-runner';
export interface TestRunMetadata {
    testRunId: string;
    userId: string;
}
export interface TestCaseExecutionResult {
    executionData: IRun;
    executionId: string;
}
export declare class TestRunnerService {
    private readonly logger;
    private readonly telemetry;
    private readonly workflowRepository;
    private readonly workflowRunner;
    private readonly activeExecutions;
    private readonly testRunRepository;
    private readonly testCaseExecutionRepository;
    private readonly errorReporter;
    private abortControllers;
    constructor(logger: Logger, telemetry: Telemetry, workflowRepository: WorkflowRepository, workflowRunner: WorkflowRunner, activeExecutions: ActiveExecutions, testRunRepository: TestRunRepository, testCaseExecutionRepository: TestCaseExecutionRepository, errorReporter: ErrorReporter);
    private findEvaluationTriggerNode;
    private validateEvaluationTriggerNode;
    private hasModelNodeConnected;
    private validateSetMetricsNodes;
    private validateSetOutputsNodes;
    private validateWorkflowConfiguration;
    private runTestCase;
    private runDatasetTrigger;
    static getEvaluationNodes(workflow: IWorkflowBase, operation: 'setMetrics' | 'setOutputs' | 'setInputs', { isDefaultOperation }?: {
        isDefaultOperation: boolean;
    }): import("n8n-workflow").INode[];
    static getEvaluationMetricsNodes(workflow: IWorkflowBase): import("n8n-workflow").INode[];
    static getEvaluationSetOutputsNodes(workflow: IWorkflowBase): import("n8n-workflow").INode[];
    private extractDatasetTriggerOutput;
    private getEvaluationData;
    private extractUserDefinedMetrics;
    private extractPredefinedMetrics;
    runTest(user: User, workflowId: string): Promise<void>;
    canBeCancelled(testRun: TestRun): boolean;
    cancelTestRun(testRunId: string): Promise<void>;
}
