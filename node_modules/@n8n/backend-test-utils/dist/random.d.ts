import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
export type CredentialPayload = {
    name: string;
    type: string;
    data: ICredentialDataDecryptedObject;
    isManaged?: boolean;
};
export declare const randomApiKey: () => string;
export declare const chooseRandomly: <T>(array: T[]) => T;
export declare const randomValidPassword: () => string;
export declare const randomInvalidPassword: () => string;
export declare const randomName: () => string;
export declare const randomEmail: () => string;
export declare const randomCredentialPayload: ({ isManaged, }?: {
    isManaged?: boolean;
}) => CredentialPayload;
export declare const randomCredentialPayloadWithOauthTokenData: ({ isManaged, }?: {
    isManaged?: boolean;
}) => CredentialPayload;
export declare const uniqueId: () => string;
