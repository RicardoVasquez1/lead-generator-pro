import type { IExecutionResponse } from '@n8n/db';
import type { INode } from 'n8n-workflow';
export declare function getMessage(execution: IExecutionResponse): string | undefined;
export declare function getLastNodeExecuted(execution: IExecutionResponse): INode | undefined;
export declare function shouldResumeImmediately(lastNode: INode): boolean;
