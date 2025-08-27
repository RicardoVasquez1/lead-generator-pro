import type { INodeTypeDescription } from 'n8n-workflow';
export type StrapiCommunityNodeType = {
    authorGithubUrl: string;
    authorName: string;
    checksum: string;
    description: string;
    displayName: string;
    name: string;
    numberOfStars: number;
    numberOfDownloads: number;
    packageName: string;
    createdAt: string;
    updatedAt: string;
    npmVersion: string;
    isOfficialNode: boolean;
    companyName?: string;
    nodeDescription: INodeTypeDescription;
    nodeVersions?: Array<{
        npmVersion: string;
        checksum: string;
    }>;
};
export declare function getCommunityNodeTypes(environment: 'staging' | 'production'): Promise<StrapiCommunityNodeType[]>;
