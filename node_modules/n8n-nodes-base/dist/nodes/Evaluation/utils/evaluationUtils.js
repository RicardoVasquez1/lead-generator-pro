"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOutputs = setOutputs;
exports.setInputs = setInputs;
exports.setMetrics = setMetrics;
exports.checkIfEvaluating = checkIfEvaluating;
exports.getOutputConnectionTypes = getOutputConnectionTypes;
exports.getInputConnectionTypes = getInputConnectionTypes;
const n8n_workflow_1 = require("n8n-workflow");
const evaluationTriggerUtils_1 = require("./evaluationTriggerUtils");
const metricHandlers_1 = require("./metricHandlers");
const utils_1 = require("../../Set/v2/helpers/utils");
const node_assert_1 = __importDefault(require("node:assert"));
function withEvaluationData(data) {
    const inputData = this.getInputData();
    if (!inputData.length) {
        return inputData;
    }
    const isEvaluationMode = this.getMode() === 'evaluation';
    return [
        {
            ...inputData[0],
            // test-runner only looks at first item. Don't need to duplicate the data for each item
            evaluationData: isEvaluationMode ? data : undefined,
        },
        ...inputData.slice(1),
    ];
}
function isOutputsArray(value) {
    return (Array.isArray(value) &&
        value.every((item) => typeof item === 'object' &&
            item !== null &&
            'outputName' in item &&
            'outputValue' in item &&
            typeof item.outputName === 'string'));
}
async function setOutputs() {
    const evaluationNode = this.getNode();
    const parentNodes = this.getParentNodes(evaluationNode.name);
    const evalTrigger = parentNodes.find((node) => node.type === n8n_workflow_1.EVALUATION_TRIGGER_NODE_TYPE);
    const isEvalTriggerExecuted = evalTrigger
        ? this.evaluateExpression(`{{ $('${evalTrigger?.name}').isExecuted }}`, 0)
        : false;
    if (!evalTrigger || !isEvalTriggerExecuted) {
        this.addExecutionHints({
            message: "No outputs were set since the execution didn't start from an evaluation trigger",
            location: 'outputPane',
        });
        return [this.getInputData()];
    }
    const outputFields = this.getNodeParameter('outputs.values', 0, []);
    (0, node_assert_1.default)(isOutputsArray(outputFields), 'Invalid output fields format. Expected an array of objects with outputName and outputValue properties.');
    if (outputFields.length === 0) {
        throw new n8n_workflow_1.UserError('No outputs to set', {
            description: 'Add outputs to write back to the Google Sheet using the ‘Add Output’ button',
        });
    }
    const googleSheetInstance = evaluationTriggerUtils_1.getGoogleSheet.call(this);
    const googleSheet = await evaluationTriggerUtils_1.getSheet.call(this, googleSheetInstance);
    const evaluationTrigger = this.evaluateExpression(`{{ $('${evalTrigger.name}').first().json }}`, 0);
    const rowNumber = evaluationTrigger.row_number === 'row_number' ? 1 : evaluationTrigger.row_number;
    const columnNames = Object.keys(evaluationTrigger).filter((key) => key !== 'row_number' && key !== '_rowsLeft');
    outputFields.forEach(({ outputName }) => {
        if (!columnNames.includes(outputName)) {
            columnNames.push(outputName);
        }
    });
    await googleSheetInstance.updateRows(googleSheet.title, [columnNames], 'RAW', // default value for Value Input Mode
    1);
    const outputs = outputFields.reduce((acc, { outputName, outputValue }) => {
        acc[outputName] = outputValue;
        return acc;
    }, {});
    const preparedData = googleSheetInstance.prepareDataForUpdatingByRowNumber([
        {
            row_number: rowNumber,
            ...outputs,
        },
    ], `${googleSheet.title}!A:Z`, [columnNames]);
    await googleSheetInstance.batchUpdate(preparedData.updateData, 'RAW');
    return [withEvaluationData.call(this, outputs)];
}
function isInputsArray(value) {
    return (Array.isArray(value) &&
        value.every((item) => typeof item === 'object' &&
            item !== null &&
            'inputName' in item &&
            'inputValue' in item &&
            typeof item.inputName === 'string'));
}
function setInputs() {
    const evaluationNode = this.getNode();
    const parentNodes = this.getParentNodes(evaluationNode.name);
    const evalTrigger = parentNodes.find((node) => node.type === 'n8n-nodes-base.evaluationTrigger');
    const isEvalTriggerExecuted = evalTrigger
        ? this.evaluateExpression(`{{ $('${evalTrigger?.name}').isExecuted }}`, 0)
        : false;
    if (!evalTrigger || !isEvalTriggerExecuted) {
        this.addExecutionHints({
            message: "No inputs were set since the execution didn't start from an evaluation trigger",
            location: 'outputPane',
        });
        return [this.getInputData()];
    }
    const inputFields = this.getNodeParameter('inputs.values', 0, []);
    (0, node_assert_1.default)(isInputsArray(inputFields), 'Invalid input fields format. Expected an array of objects with inputName and inputValue properties.');
    if (inputFields.length === 0) {
        throw new n8n_workflow_1.UserError('No inputs to set', {
            description: 'Add inputs using the ‘Add Input’ button',
        });
    }
    const inputs = inputFields.reduce((acc, { inputName, inputValue }) => {
        acc[inputName] = inputValue;
        return acc;
    }, {});
    return [withEvaluationData.call(this, inputs)];
}
async function setMetrics() {
    const items = this.getInputData();
    const metrics = [];
    for (let i = 0; i < items.length; i++) {
        const metric = this.getNodeParameter('metric', i, {});
        if (!metricHandlers_1.metricHandlers.hasOwnProperty(metric)) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Unknown metric');
        }
        const newData = await metricHandlers_1.metricHandlers[metric].call(this, i);
        const newItem = {
            json: {},
            pairedItem: { item: i },
        };
        const returnItem = utils_1.composeReturnItem.call(this, i, newItem, newData, { dotNotation: false, include: 'none' }, 1);
        metrics.push(returnItem);
    }
    return [metrics];
}
async function checkIfEvaluating() {
    const evaluationExecutionResult = [];
    const normalExecutionResult = [];
    const evaluationNode = this.getNode();
    const parentNodes = this.getParentNodes(evaluationNode.name);
    const evalTrigger = parentNodes.find((node) => node.type === 'n8n-nodes-base.evaluationTrigger');
    const isEvalTriggerExecuted = evalTrigger
        ? this.evaluateExpression(`{{ $('${evalTrigger?.name}').isExecuted }}`, 0)
        : false;
    if (isEvalTriggerExecuted) {
        return [this.getInputData(), normalExecutionResult];
    }
    else {
        return [evaluationExecutionResult, this.getInputData()];
    }
}
function getOutputConnectionTypes(parameters) {
    if (parameters.operation === 'checkIfEvaluating') {
        return [
            { type: 'main', displayName: 'Evaluation' },
            { type: 'main', displayName: 'Normal' },
        ];
    }
    return [{ type: 'main' }];
}
function getInputConnectionTypes(parameters, metricRequiresModelConnectionFn) {
    if (parameters.operation === 'setMetrics' &&
        metricRequiresModelConnectionFn(parameters.metric)) {
        return [
            { type: 'main' },
            { type: 'ai_languageModel', displayName: 'Model', maxConnections: 1 },
        ];
    }
    return [{ type: 'main' }];
}
//# sourceMappingURL=evaluationUtils.js.map