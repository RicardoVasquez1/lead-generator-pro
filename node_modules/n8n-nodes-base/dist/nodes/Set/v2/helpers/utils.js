"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEntry = exports.parseJsonParameter = void 0;
exports.composeReturnItem = composeReturnItem;
exports.resolveRawData = resolveRawData;
const get_1 = __importDefault(require("lodash/get"));
const set_1 = __importDefault(require("lodash/set"));
const unset_1 = __importDefault(require("lodash/unset"));
const n8n_workflow_1 = require("n8n-workflow");
const interfaces_1 = require("./interfaces");
const utilities_1 = require("../../../../utils/utilities");
const configureFieldHelper = (dotNotation) => {
    if (dotNotation !== false) {
        return {
            set: (item, key, value) => {
                (0, set_1.default)(item, key, value);
            },
            get: (item, key) => {
                return (0, get_1.default)(item, key);
            },
            unset: (item, key) => {
                (0, unset_1.default)(item, key);
            },
        };
    }
    else {
        return {
            set: (item, key, value) => {
                item[(0, utilities_1.sanitizeDataPathKey)(item, key)] = value;
            },
            get: (item, key) => {
                return item[(0, utilities_1.sanitizeDataPathKey)(item, key)];
            },
            unset: (item, key) => {
                delete item[(0, utilities_1.sanitizeDataPathKey)(item, key)];
            },
        };
    }
};
function composeReturnItem(itemIndex, inputItem, newFields, options, nodeVersion) {
    const newItem = {
        json: {},
        pairedItem: { item: itemIndex },
    };
    const includeBinary = (nodeVersion >= 3.4 && !options.stripBinary && options.include !== 'none') ||
        (nodeVersion < 3.4 && !!options.includeBinary);
    if (includeBinary && inputItem.binary !== undefined) {
        // Create a shallow copy of the binary data so that the old
        // data references which do not get changed still stay behind
        // but the incoming data does not get changed.
        newItem.binary = {};
        Object.assign(newItem.binary, inputItem.binary);
    }
    const fieldHelper = configureFieldHelper(options.dotNotation);
    switch (options.include) {
        case interfaces_1.INCLUDE.ALL:
            newItem.json = (0, n8n_workflow_1.deepCopy)(inputItem.json);
            break;
        case interfaces_1.INCLUDE.SELECTED:
            const includeFields = this.getNodeParameter('includeFields', itemIndex)
                .split(',')
                .map((item) => item.trim())
                .filter((item) => item);
            for (const key of includeFields) {
                const fieldValue = fieldHelper.get(inputItem.json, key);
                let keyToSet = key;
                if (options.dotNotation !== false && key.includes('.')) {
                    keyToSet = key.split('.').pop();
                }
                fieldHelper.set(newItem.json, keyToSet, fieldValue);
            }
            break;
        case interfaces_1.INCLUDE.EXCEPT:
            const excludeFields = this.getNodeParameter('excludeFields', itemIndex)
                .split(',')
                .map((item) => item.trim())
                .filter((item) => item);
            const inputData = (0, n8n_workflow_1.deepCopy)(inputItem.json);
            for (const key of excludeFields) {
                fieldHelper.unset(inputData, key);
            }
            newItem.json = inputData;
            break;
        case interfaces_1.INCLUDE.NONE:
            break;
        default:
            throw new n8n_workflow_1.ApplicationError(`The include option "${options.include}" is not known!`, {
                level: 'warning',
            });
    }
    for (const key of Object.keys(newFields)) {
        fieldHelper.set(newItem.json, key, newFields[key]);
    }
    return newItem;
}
const parseJsonParameter = (jsonData, node, i, entryName) => {
    let returnData;
    const location = entryName ? `entry "${entryName}" inside 'Fields to Set'` : "'JSON Output'";
    if (typeof jsonData === 'string') {
        try {
            returnData = (0, n8n_workflow_1.jsonParse)(jsonData);
        }
        catch (error) {
            let recoveredData = '';
            try {
                recoveredData = jsonData
                    .replace(/'/g, '"') // Replace single quotes with double quotes
                    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Wrap keys in double quotes
                    .replace(/,\s*([\]}])/g, '$1') // Remove trailing commas from objects
                    .replace(/,+$/, ''); // Remove trailing comma
                returnData = (0, n8n_workflow_1.jsonParse)(recoveredData);
            }
            catch (err) {
                const description = recoveredData === jsonData ? jsonData : `${recoveredData};\n Original input: ${jsonData}`;
                throw new n8n_workflow_1.NodeOperationError(node, `The ${location} in item ${i} contains invalid JSON`, {
                    description,
                });
            }
        }
    }
    else {
        returnData = jsonData;
    }
    if (returnData === undefined || typeof returnData !== 'object' || Array.isArray(returnData)) {
        throw new n8n_workflow_1.NodeOperationError(node, `The ${location} in item ${i} does not contain a valid JSON object`);
    }
    return returnData;
};
exports.parseJsonParameter = parseJsonParameter;
const validateEntry = (name, type, value, node, itemIndex, ignoreErrors = false, nodeVersion) => {
    if (nodeVersion && nodeVersion >= 3.2 && (value === undefined || value === null)) {
        return { name, value: null };
    }
    const description = `To fix the error try to change the type for the field "${name}" or activate the option “Ignore Type Conversion Errors” to apply a less strict type validation`;
    if (type === 'string') {
        if (nodeVersion && nodeVersion > 3 && (value === undefined || value === null)) {
            if (ignoreErrors) {
                return { name, value: null };
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(node, `'${name}' expects a ${type} but we got ${(0, n8n_workflow_1.getValueDescription)(value)} [item ${itemIndex}]`, { description });
            }
        }
        else if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        else {
            value = String(value);
        }
    }
    const validationResult = (0, n8n_workflow_1.validateFieldType)(name, value, type);
    if (!validationResult.valid) {
        if (ignoreErrors) {
            return { name, value: value ?? null };
        }
        else {
            const message = `${'errorMessage' in validationResult ? validationResult.errorMessage : 'Error'} [item ${itemIndex}]`;
            throw new n8n_workflow_1.NodeOperationError(node, message, {
                itemIndex,
                description,
            });
        }
    }
    return {
        name,
        value: validationResult.newValue ?? null,
    };
};
exports.validateEntry = validateEntry;
function resolveRawData(rawData, i) {
    const resolvables = (0, utilities_1.getResolvables)(rawData);
    let returnData = rawData;
    if (resolvables.length) {
        for (const resolvable of resolvables) {
            const resolvedValue = this.evaluateExpression(`${resolvable}`, i);
            if (typeof resolvedValue === 'object' && resolvedValue !== null) {
                returnData = returnData.replace(resolvable, JSON.stringify(resolvedValue));
            }
            else {
                returnData = returnData.replace(resolvable, resolvedValue);
            }
        }
    }
    return returnData;
}
//# sourceMappingURL=utils.js.map