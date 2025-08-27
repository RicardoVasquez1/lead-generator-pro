import type { IWebhookData, INode, IWorkflowDataProxyAdditionalKeys, Workflow, WorkflowExecuteMode, IExecuteData, IWebhookDescription, NodeParameterValueType } from 'n8n-workflow';
export declare class WebhookExecutionContext {
    readonly workflow: Workflow;
    readonly workflowStartNode: INode;
    readonly webhookData: IWebhookData;
    readonly executionMode: WorkflowExecuteMode;
    readonly additionalKeys: IWorkflowDataProxyAdditionalKeys;
    constructor(workflow: Workflow, workflowStartNode: INode, webhookData: IWebhookData, executionMode: WorkflowExecuteMode, additionalKeys: IWorkflowDataProxyAdditionalKeys);
    evaluateSimpleWebhookDescriptionExpression<T extends boolean | number | string | unknown[]>(propertyName: keyof IWebhookDescription, executeData?: IExecuteData, defaultValue?: T): T | undefined;
    evaluateComplexWebhookDescriptionExpression<T extends NodeParameterValueType>(propertyName: keyof IWebhookDescription, executeData?: IExecuteData, defaultValue?: T): T | undefined;
}
