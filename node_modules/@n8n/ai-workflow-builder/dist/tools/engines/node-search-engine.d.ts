import type { INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import type { NodeSearchResult } from '../../types/nodes';
export declare const SCORE_WEIGHTS: {
    readonly NAME_CONTAINS: 10;
    readonly DISPLAY_NAME_CONTAINS: 8;
    readonly DESCRIPTION_CONTAINS: 5;
    readonly ALIAS_CONTAINS: 8;
    readonly NAME_EXACT: 20;
    readonly DISPLAY_NAME_EXACT: 15;
    readonly CONNECTION_EXACT: 100;
    readonly CONNECTION_IN_EXPRESSION: 50;
};
export declare class NodeSearchEngine {
    private readonly nodeTypes;
    constructor(nodeTypes: INodeTypeDescription[]);
    searchByName(query: string, limit?: number): NodeSearchResult[];
    searchByConnectionType(connectionType: NodeConnectionType, limit?: number, nameFilter?: string): NodeSearchResult[];
    formatResult(result: NodeSearchResult): string;
    private calculateNameScore;
    private getConnectionScore;
    private createSearchResult;
    private sortAndLimit;
    static isAiConnectionType(connectionType: string): boolean;
    static getAiConnectionTypes(): NodeConnectionType[];
}
