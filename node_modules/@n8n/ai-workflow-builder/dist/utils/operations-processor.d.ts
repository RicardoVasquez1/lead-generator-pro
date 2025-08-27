import type { SimpleWorkflow, WorkflowOperation } from '../types/workflow';
import type { WorkflowState } from '../workflow-state';
export declare function applyOperations(workflow: SimpleWorkflow, operations: WorkflowOperation[]): SimpleWorkflow;
export declare function processOperations(state: typeof WorkflowState.State): {
    workflowJSON?: undefined;
    workflowOperations?: undefined;
} | {
    workflowJSON: SimpleWorkflow;
    workflowOperations: null;
};
