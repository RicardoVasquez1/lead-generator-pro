"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueName = generateUniqueName;
exports.getLatestVersion = getLatestVersion;
exports.generateNodeId = generateNodeId;
exports.generateWebhookId = generateWebhookId;
exports.requiresWebhook = requiresWebhook;
exports.createNodeInstance = createNodeInstance;
exports.mergeWithDefaults = mergeWithDefaults;
function generateUniqueName(baseName, existingNodes) {
    let uniqueName = baseName;
    let counter = 1;
    while (existingNodes.some((n) => n.name === uniqueName)) {
        uniqueName = `${baseName}${counter}`;
        counter++;
    }
    return uniqueName;
}
function getLatestVersion(nodeType) {
    return (nodeType.defaultVersion ??
        (typeof nodeType.version === 'number'
            ? nodeType.version
            : nodeType.version[nodeType.version.length - 1]));
}
function generateNodeId() {
    return crypto.randomUUID();
}
function generateWebhookId() {
    return crypto.randomUUID();
}
function requiresWebhook(nodeType) {
    return !!(nodeType.webhooks && nodeType.webhooks.length > 0);
}
function createNodeInstance(nodeType, name, position, parameters = {}) {
    const node = {
        id: generateNodeId(),
        name,
        type: nodeType.name,
        typeVersion: getLatestVersion(nodeType),
        position,
        parameters,
    };
    if (requiresWebhook(nodeType)) {
        node.webhookId = generateWebhookId();
    }
    return node;
}
function mergeWithDefaults(parameters, nodeType) {
    const defaults = nodeType.defaults || {};
    return { ...defaults, ...parameters };
}
//# sourceMappingURL=node-creation.utils.js.map