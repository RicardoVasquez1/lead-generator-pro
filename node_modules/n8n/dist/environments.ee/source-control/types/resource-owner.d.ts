export type RemoteResourceOwner = string | {
    type: 'personal';
    projectId?: string;
    projectName?: string;
    personalEmail: string;
} | {
    type: 'team';
    teamId: string;
    teamName: string;
};
export type StatusResourceOwner = {
    type: 'personal' | 'team';
    projectId: string;
    projectName: string;
};
