"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeSearchEngine = exports.SCORE_WEIGHTS = void 0;
const n8n_workflow_1 = require("n8n-workflow");
exports.SCORE_WEIGHTS = {
    NAME_CONTAINS: 10,
    DISPLAY_NAME_CONTAINS: 8,
    DESCRIPTION_CONTAINS: 5,
    ALIAS_CONTAINS: 8,
    NAME_EXACT: 20,
    DISPLAY_NAME_EXACT: 15,
    CONNECTION_EXACT: 100,
    CONNECTION_IN_EXPRESSION: 50,
};
class NodeSearchEngine {
    nodeTypes;
    constructor(nodeTypes) {
        this.nodeTypes = nodeTypes;
    }
    searchByName(query, limit = 20) {
        const normalizedQuery = query.toLowerCase();
        const results = [];
        for (const nodeType of this.nodeTypes) {
            try {
                const score = this.calculateNameScore(nodeType, normalizedQuery);
                if (score > 0) {
                    results.push(this.createSearchResult(nodeType, score));
                }
            }
            catch (error) {
            }
        }
        return this.sortAndLimit(results, limit);
    }
    searchByConnectionType(connectionType, limit = 20, nameFilter) {
        const results = [];
        const normalizedFilter = nameFilter?.toLowerCase();
        for (const nodeType of this.nodeTypes) {
            try {
                const connectionScore = this.getConnectionScore(nodeType, connectionType);
                if (connectionScore > 0) {
                    const nameScore = normalizedFilter
                        ? this.calculateNameScore(nodeType, normalizedFilter)
                        : 0;
                    if (!normalizedFilter || nameScore > 0) {
                        const totalScore = connectionScore + nameScore;
                        results.push(this.createSearchResult(nodeType, totalScore));
                    }
                }
            }
            catch (error) {
            }
        }
        return this.sortAndLimit(results, limit);
    }
    formatResult(result) {
        return `
		<node>
			<node_name>${result.name}</node_name>
			<node_description>${result.description}</node_description>
			<node_inputs>${typeof result.inputs === 'object' ? JSON.stringify(result.inputs) : result.inputs}</node_inputs>
			<node_outputs>${typeof result.outputs === 'object' ? JSON.stringify(result.outputs) : result.outputs}</node_outputs>
		</node>`;
    }
    calculateNameScore(nodeType, normalizedQuery) {
        let score = 0;
        if (nodeType.name.toLowerCase().includes(normalizedQuery)) {
            score += exports.SCORE_WEIGHTS.NAME_CONTAINS;
        }
        if (nodeType.displayName.toLowerCase().includes(normalizedQuery)) {
            score += exports.SCORE_WEIGHTS.DISPLAY_NAME_CONTAINS;
        }
        if (nodeType.description?.toLowerCase().includes(normalizedQuery)) {
            score += exports.SCORE_WEIGHTS.DESCRIPTION_CONTAINS;
        }
        if (nodeType.codex?.alias?.some((alias) => alias.toLowerCase().includes(normalizedQuery))) {
            score += exports.SCORE_WEIGHTS.ALIAS_CONTAINS;
        }
        if (nodeType.name.toLowerCase() === normalizedQuery) {
            score += exports.SCORE_WEIGHTS.NAME_EXACT;
        }
        if (nodeType.displayName.toLowerCase() === normalizedQuery) {
            score += exports.SCORE_WEIGHTS.DISPLAY_NAME_EXACT;
        }
        return score;
    }
    getConnectionScore(nodeType, connectionType) {
        const outputs = nodeType.outputs;
        if (Array.isArray(outputs)) {
            if (outputs.includes(connectionType)) {
                return exports.SCORE_WEIGHTS.CONNECTION_EXACT;
            }
        }
        else if (typeof outputs === 'string') {
            if (outputs.includes(connectionType)) {
                return exports.SCORE_WEIGHTS.CONNECTION_IN_EXPRESSION;
            }
        }
        return 0;
    }
    createSearchResult(nodeType, score) {
        return {
            name: nodeType.name,
            displayName: nodeType.displayName,
            description: nodeType.description ?? 'No description available',
            inputs: nodeType.inputs,
            outputs: nodeType.outputs,
            score,
        };
    }
    sortAndLimit(results, limit) {
        return results.sort((a, b) => b.score - a.score).slice(0, limit);
    }
    static isAiConnectionType(connectionType) {
        return connectionType.startsWith('ai_');
    }
    static getAiConnectionTypes() {
        return Object.values(n8n_workflow_1.NodeConnectionTypes).filter((type) => NodeSearchEngine.isAiConnectionType(type));
    }
}
exports.NodeSearchEngine = NodeSearchEngine;
//# sourceMappingURL=node-search-engine.js.map