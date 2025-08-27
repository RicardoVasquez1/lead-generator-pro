import { ApplicationError } from '@n8n/errors';
export declare class UnsupportedFunctionError extends ApplicationError {
    constructor(functionName: string);
}
