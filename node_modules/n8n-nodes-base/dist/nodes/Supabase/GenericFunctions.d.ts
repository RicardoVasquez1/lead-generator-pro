import type { ICredentialDataDecryptedObject, ICredentialTestFunctions, IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions, INodeProperties, IPairedItemData, IHttpRequestMethods } from 'n8n-workflow';
export declare function supabaseApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions, method: IHttpRequestMethods, resource: string, body?: IDataObject | IDataObject[], qs?: IDataObject, uri?: string, headers?: IDataObject): Promise<any>;
export declare function getFilters(resources: string[], operations: string[], { includeNoneOption, filterTypeDisplayName, filterFixedCollectionDisplayName, mustMatchOptions, }: {
    includeNoneOption?: boolean | undefined;
    filterTypeDisplayName?: string | undefined;
    filterFixedCollectionDisplayName?: string | undefined;
    mustMatchOptions?: {
        name: string;
        value: string;
    }[] | undefined;
}): INodeProperties[];
export declare const buildQuery: (obj: IDataObject, value: IDataObject) => IDataObject & {
    [x: string]: string;
};
export declare const buildOrQuery: (key: IDataObject) => string;
export declare const buildGetQuery: (obj: IDataObject, value: IDataObject) => IDataObject & {
    [x: string]: string;
};
export declare function validateCredentials(this: ICredentialTestFunctions, decryptedCredentials: ICredentialDataDecryptedObject): Promise<any>;
export declare function mapPairedItemsFrom<T>(iterable: Iterable<T> | ArrayLike<T>): IPairedItemData[];
//# sourceMappingURL=GenericFunctions.d.ts.map