"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNodeParameters = extractNodeParameters;
exports.mergeParameters = mergeParameters;
exports.updateNodeWithParameters = updateNodeWithParameters;
exports.formatChangesForPrompt = formatChangesForPrompt;
exports.fixExpressionPrefixes = fixExpressionPrefixes;
function extractNodeParameters(node) {
    return node.parameters || {};
}
function mergeParameters(existingParams, newParams) {
    return deepMerge(existingParams, newParams);
}
function deepMerge(target, source) {
    if (!target) {
        return source || {};
    }
    if (!source) {
        return target;
    }
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!target || !(key in target) || !target[key]) {
                    Object.assign(output, { [key]: source[key] });
                }
                else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            }
            else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}
function isObject(item) {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}
function updateNodeWithParameters(node, newParameters) {
    return {
        ...node,
        parameters: newParameters,
    };
}
function formatChangesForPrompt(changes) {
    return changes.map((change, index) => `${index + 1}. ${change}`).join('\n');
}
function fixExpressionPrefixes(value) {
    if (typeof value === 'string') {
        let updatedValue = value;
        if (value.includes('{{ $json }}')) {
            updatedValue = value.replace('{{ $json }}', '{{ $json.toJsonString() }}');
        }
        if (updatedValue.includes('{{') && !updatedValue.startsWith('=')) {
            return ('=' + updatedValue);
        }
    }
    if (Array.isArray(value)) {
        return value.map((item) => fixExpressionPrefixes(item));
    }
    if (value !== null && typeof value === 'object') {
        const fixed = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                fixed[key] = fixExpressionPrefixes(value[key]);
            }
        }
        return fixed;
    }
    return value;
}
//# sourceMappingURL=parameter-update.utils.js.map