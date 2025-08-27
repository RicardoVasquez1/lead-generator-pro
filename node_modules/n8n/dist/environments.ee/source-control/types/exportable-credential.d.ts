import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
import type { RemoteResourceOwner, StatusResourceOwner } from './resource-owner';
export interface ExportableCredential {
    id: string;
    name: string;
    type: string;
    data: ICredentialDataDecryptedObject;
    ownedBy: RemoteResourceOwner | null;
}
export type StatusExportableCredential = ExportableCredential & {
    filename: string;
    ownedBy?: StatusResourceOwner;
};
