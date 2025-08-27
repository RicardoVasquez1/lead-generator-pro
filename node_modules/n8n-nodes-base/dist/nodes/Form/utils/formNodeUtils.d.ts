import { type Response } from 'express';
import { type NodeTypeAndVersion, type IWebhookFunctions, type FormFieldsParameter, type IWebhookResponseData } from 'n8n-workflow';
export declare const renderFormNode: (context: IWebhookFunctions, res: Response, trigger: NodeTypeAndVersion, fields: FormFieldsParameter, mode: "test" | "production") => Promise<IWebhookResponseData>;
//# sourceMappingURL=formNodeUtils.d.ts.map