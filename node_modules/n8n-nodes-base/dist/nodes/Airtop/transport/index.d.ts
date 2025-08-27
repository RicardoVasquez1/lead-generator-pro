import type { IDataObject, IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
import type { IAirtopResponse } from './types';
export declare function apiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject, query?: IDataObject): Promise<IAirtopResponse>;
//# sourceMappingURL=index.d.ts.map