"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluationTrigger = exports.DEFAULT_STARTING_ROW = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GoogleSheetsTrigger_node_1 = require("../../Google/Sheet/GoogleSheetsTrigger.node");
const read_operation_1 = require("../../Google/Sheet/v2/actions/sheet/read.operation");
const versionDescription_1 = require("../../Google/Sheet/v2/actions/versionDescription");
const methods_1 = require("../methods");
const evaluationTriggerUtils_1 = require("../utils/evaluationTriggerUtils");
exports.DEFAULT_STARTING_ROW = 2;
const MAX_ROWS = 1000;
class EvaluationTrigger {
    description = {
        displayName: 'Evaluation Trigger',
        icon: 'fa:check-double',
        name: 'evaluationTrigger',
        group: ['trigger'],
        version: 4.6,
        description: 'Run a test dataset through your workflow to check performance',
        eventTriggerDescription: '',
        defaults: {
            name: 'When fetching a dataset row',
            color: '#c3c9d5',
        },
        inputs: [],
        outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
        properties: [
            {
                displayName: 'Pulls a test dataset from a Google Sheet. The workflow will run once for each row, in sequence. Tips for wiring this node up <a href="https://docs.n8n.io/advanced-ai/evaluations/tips-and-common-issues/#combining-multiple-triggers">here</a>.',
                name: 'notice',
                type: 'notice',
                default: '',
            },
            {
                displayName: 'Credentials',
                name: 'credentials',
                type: 'credentials',
                default: '',
            },
            versionDescription_1.authentication,
            {
                ...GoogleSheetsTrigger_node_1.document,
                displayName: 'Document Containing Dataset',
                hint: 'Example dataset format <a href="https://docs.google.com/spreadsheets/d/1vD_IdeFUg7sHsK9okL6Doy1rGOkWTnPJV3Dro4FBUsY/edit?gid=0#gid=0">here</a>',
            },
            { ...GoogleSheetsTrigger_node_1.sheet, displayName: 'Sheet Containing Dataset' },
            {
                displayName: 'Limit Rows',
                name: 'limitRows',
                type: 'boolean',
                default: false,
                noDataExpression: true,
                description: 'Whether to limit number of rows to process',
            },
            {
                displayName: 'Max Rows to Process',
                name: 'maxRows',
                type: 'number',
                default: 10,
                description: 'Maximum number of rows to process',
                noDataExpression: false,
                displayOptions: { show: { limitRows: [true] } },
            },
            read_operation_1.readFilter,
        ],
        codex: {
            alias: ['Test', 'Metrics', 'Evals', 'Set Output', 'Set Metrics'],
        },
        credentials: [
            {
                name: 'googleApi',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['serviceAccount'],
                    },
                },
                testedBy: 'googleApiCredentialTest',
            },
            {
                name: 'googleSheetsOAuth2Api',
                required: true,
                displayOptions: {
                    show: {
                        authentication: ['oAuth2'],
                    },
                },
            },
        ],
    };
    methods = { loadOptions: methods_1.loadOptions, listSearch: methods_1.listSearch, credentialTest: methods_1.credentialTest };
    async execute() {
        const inputData = this.getInputData();
        const maxRows = this.getNodeParameter('limitRows', 0, false)
            ? this.getNodeParameter('maxRows', 0, MAX_ROWS) + 1
            : MAX_ROWS;
        const previousRunRowNumber = inputData?.[0]?.json?.row_number;
        const previousRunRowsLeft = inputData?.[0]?.json?._rowsLeft;
        const firstDataRow = typeof previousRunRowNumber === 'number' && previousRunRowsLeft !== 0
            ? previousRunRowNumber + 1
            : exports.DEFAULT_STARTING_ROW;
        const rangeOptions = {
            rangeDefinition: 'specifyRange',
            headerRow: 1,
            firstDataRow,
        };
        const googleSheetInstance = evaluationTriggerUtils_1.getGoogleSheet.call(this);
        const googleSheet = await evaluationTriggerUtils_1.getSheet.call(this, googleSheetInstance);
        const allRows = await evaluationTriggerUtils_1.getResults.call(this, [], googleSheetInstance, googleSheet, rangeOptions);
        const hasFilter = this.getNodeParameter('filtersUI.values', 0, []);
        if (hasFilter.length > 0) {
            const currentRow = allRows[0];
            const currentRowNumber = currentRow.json?.row_number;
            if (currentRow === undefined) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No row found');
            }
            const rowsLeft = await evaluationTriggerUtils_1.getNumberOfRowsLeftFiltered.call(this, googleSheetInstance, googleSheet.title, currentRowNumber + 1, maxRows);
            currentRow.json._rowsLeft = rowsLeft;
            return [[currentRow]];
        }
        else {
            const currentRow = allRows.find((row) => row?.json?.row_number === firstDataRow);
            const rowsLeft = await evaluationTriggerUtils_1.getRowsLeft.call(this, googleSheetInstance, googleSheet.title, `${googleSheet.title}!${firstDataRow}:${maxRows}`);
            if (currentRow === undefined) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No row found');
            }
            currentRow.json._rowsLeft = rowsLeft;
            return [[currentRow]];
        }
    }
    customOperations = {
        dataset: {
            async getRows() {
                try {
                    const maxRows = this.getNodeParameter('limitRows', 0, false)
                        ? this.getNodeParameter('maxRows', 0, MAX_ROWS) + 1
                        : MAX_ROWS;
                    const googleSheetInstance = evaluationTriggerUtils_1.getGoogleSheet.call(this);
                    const googleSheet = await evaluationTriggerUtils_1.getSheet.call(this, googleSheetInstance);
                    const results = await evaluationTriggerUtils_1.getResults.call(this, [], googleSheetInstance, googleSheet, {});
                    const result = results.slice(0, maxRows - 1);
                    return [result];
                }
                catch (error) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
                }
            },
        },
    };
}
exports.EvaluationTrigger = EvaluationTrigger;
//# sourceMappingURL=EvaluationTrigger.node.ee.js.map