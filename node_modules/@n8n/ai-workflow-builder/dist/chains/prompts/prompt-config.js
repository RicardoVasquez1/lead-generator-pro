"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PROMPT_CONFIG = void 0;
exports.getNodeTypeCategory = getNodeTypeCategory;
exports.mentionsResourceKeywords = mentionsResourceKeywords;
exports.mentionsTextKeywords = mentionsTextKeywords;
exports.DEFAULT_PROMPT_CONFIG = {
    nodeTypePatterns: {
        set: ['n8n-nodes-base.set', 'set'],
        if: ['n8n-nodes-base.if', 'if', 'filter'],
        httpRequest: ['n8n-nodes-base.httpRequest', 'httprequest', 'webhook', 'n8n-nodes-base.webhook'],
        tool: ['Tool', '.tool'],
    },
    parameterKeywords: {
        resourceLocator: [
            'channel',
            'file',
            'page',
            'document',
            'sheet',
            'folder',
            'database',
            'board',
            'list',
            'space',
        ],
        textExpressions: ['message', 'text', 'content', 'body', 'description', 'title', 'subject'],
    },
    maxExamples: 3,
    targetTokenBudget: 3000,
};
function getNodeTypeCategory(nodeType, config = exports.DEFAULT_PROMPT_CONFIG) {
    const lowerType = nodeType.toLowerCase();
    for (const [category, patterns] of Object.entries(config.nodeTypePatterns)) {
        if (patterns.some((pattern) => lowerType.includes(pattern.toLowerCase()))) {
            return category;
        }
    }
    if (nodeType.endsWith('Tool') || nodeType.includes('.tool')) {
        return 'tool';
    }
    return null;
}
function mentionsResourceKeywords(changes, config = exports.DEFAULT_PROMPT_CONFIG) {
    const changesText = changes.join(' ').toLowerCase();
    return config.parameterKeywords.resourceLocator.some((keyword) => changesText.includes(keyword));
}
function mentionsTextKeywords(changes, config = exports.DEFAULT_PROMPT_CONFIG) {
    const changesText = changes.join(' ').toLowerCase();
    return config.parameterKeywords.textExpressions.some((keyword) => changesText.includes(keyword));
}
//# sourceMappingURL=prompt-config.js.map