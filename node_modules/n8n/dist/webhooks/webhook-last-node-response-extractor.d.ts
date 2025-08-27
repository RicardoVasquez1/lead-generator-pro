import type { ITaskData, Result, WebhookResponseData } from 'n8n-workflow';
import { OperationalError } from 'n8n-workflow';
import type { Readable } from 'node:stream';
import type { WebhookExecutionContext } from '../webhooks/webhook-execution-context';
type StaticResponse = {
    type: 'static';
    body: unknown;
    contentType: string | undefined;
};
type StreamResponse = {
    type: 'stream';
    stream: Readable;
    contentType: string | undefined;
};
export declare function extractWebhookLastNodeResponse(context: WebhookExecutionContext, responseDataType: WebhookResponseData | undefined, lastNodeTaskData: ITaskData): Promise<Result<StaticResponse | StreamResponse, OperationalError>>;
export {};
