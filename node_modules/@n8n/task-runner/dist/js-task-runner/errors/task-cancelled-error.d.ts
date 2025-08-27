import { ApplicationError } from '@n8n/errors';
export declare class TaskCancelledError extends ApplicationError {
    constructor(reason: string);
}
