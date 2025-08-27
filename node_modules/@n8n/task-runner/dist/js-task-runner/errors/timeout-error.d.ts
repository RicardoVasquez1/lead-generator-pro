import { ApplicationError } from '@n8n/errors';
export declare class TimeoutError extends ApplicationError {
    description: string;
    constructor(taskTimeout: number);
}
