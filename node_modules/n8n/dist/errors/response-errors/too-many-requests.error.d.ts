import { ResponseError } from './abstract/response.error';
export declare class TooManyRequestsError extends ResponseError {
    constructor(message: string, hint?: string | undefined);
}
