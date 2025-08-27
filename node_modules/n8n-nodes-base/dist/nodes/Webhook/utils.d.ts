import type { IWebhookFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
export type WebhookParameters = {
    httpMethod: string | string[];
    responseMode: string;
    responseData: string;
    responseCode?: number;
    options?: {
        responseData?: string;
        responseCode?: {
            values?: {
                responseCode: number;
                customCode?: number;
            };
        };
        noResponseBody?: boolean;
    };
};
export declare const getResponseCode: (parameters: WebhookParameters) => number;
export declare const getResponseData: (parameters: WebhookParameters) => string | undefined;
export declare const configuredOutputs: (parameters: WebhookParameters) => {
    type: string;
    displayName: string;
}[];
export declare const setupOutputConnection: (ctx: IWebhookFunctions, method: string, additionalData: {
    jwtPayload?: IDataObject;
}) => (outputData: INodeExecutionData) => INodeExecutionData[][];
export declare const isIpWhitelisted: (whitelist: string | string[] | undefined, ips: string[], ip?: string) => boolean;
export declare const checkResponseModeConfiguration: (context: IWebhookFunctions) => void;
export declare function validateWebhookAuthentication(ctx: IWebhookFunctions, authPropertyName: string): Promise<IDataObject | undefined>;
//# sourceMappingURL=utils.d.ts.map