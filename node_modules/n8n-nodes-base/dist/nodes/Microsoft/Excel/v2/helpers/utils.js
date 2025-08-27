"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRange = void 0;
exports.prepareOutput = prepareOutput;
exports.updateByDefinedValues = updateByDefinedValues;
exports.updateByAutoMaping = updateByAutoMaping;
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../../../../utils/utilities");
function prepareOutput(node, responseData, config) {
    const returnData = [];
    const { rawData, keyRow, firstDataRow, columnsRow, updatedRows } = {
        keyRow: 0,
        firstDataRow: 1,
        columnsRow: undefined,
        updatedRows: undefined,
        ...config,
    };
    if (!rawData) {
        let values = responseData.values;
        if (values === null) {
            throw new n8n_workflow_1.NodeOperationError(node, 'Operation did not return data');
        }
        let columns = [];
        if (columnsRow?.length) {
            columns = columnsRow;
            values = [columns, ...values];
        }
        else {
            columns = values[keyRow];
        }
        if (updatedRows) {
            values = values.filter((_, index) => updatedRows.includes(index));
        }
        for (let rowIndex = firstDataRow; rowIndex < values.length; rowIndex++) {
            if (rowIndex === keyRow)
                continue;
            const data = {};
            for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                data[columns[columnIndex]] = values[rowIndex][columnIndex];
            }
            const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)({ ...data }), {
                itemData: { item: rowIndex },
            });
            returnData.push(...executionData);
        }
    }
    else {
        const itemData = (0, utilities_1.generatePairedItemData)(this.getInputData().length);
        const executionData = this.helpers.constructExecutionMetaData((0, utilities_1.wrapData)({ [config.dataProperty || 'data']: responseData }), { itemData });
        returnData.push(...executionData);
    }
    return returnData;
}
// update values of spreadsheet when update mode is 'define'
function updateByDefinedValues(itemslength, sheetData, updateAllOccurences) {
    const [columns, ...originalValues] = sheetData;
    const updateValues = originalValues.map((row) => row.map(() => null));
    const updatedRowsIndexes = new Set();
    const appendData = [];
    for (let itemIndex = 0; itemIndex < itemslength; itemIndex++) {
        const columnToMatchOn = this.getNodeParameter('columnToMatchOn', itemIndex);
        const valueToMatchOn = this.getNodeParameter('valueToMatchOn', itemIndex);
        const definedFields = this.getNodeParameter('fieldsUi.values', itemIndex, []);
        const columnToMatchOnIndex = columns.indexOf(columnToMatchOn);
        const rowIndexes = [];
        if (updateAllOccurences) {
            for (const [index, row] of originalValues.entries()) {
                if (row[columnToMatchOnIndex] === valueToMatchOn ||
                    Number(row[columnToMatchOnIndex]) === Number(valueToMatchOn)) {
                    rowIndexes.push(index);
                }
            }
        }
        else {
            const rowIndex = originalValues.findIndex((row) => row[columnToMatchOnIndex] === valueToMatchOn ||
                Number(row[columnToMatchOnIndex]) === Number(valueToMatchOn));
            if (rowIndex !== -1) {
                rowIndexes.push(rowIndex);
            }
        }
        if (!rowIndexes.length) {
            const appendItem = {};
            appendItem[columnToMatchOn] = valueToMatchOn;
            for (const entry of definedFields) {
                appendItem[entry.column] = entry.fieldValue;
            }
            appendData.push(appendItem);
            continue;
        }
        for (const rowIndex of rowIndexes) {
            for (const entry of definedFields) {
                const columnIndex = columns.indexOf(entry.column);
                if (rowIndex === -1)
                    continue;
                updateValues[rowIndex][columnIndex] = entry.fieldValue;
                //add rows index and shift by 1 to account for header row
                updatedRowsIndexes.add(rowIndex + 1);
            }
        }
    }
    const updatedData = [columns, ...updateValues];
    const updatedRows = [0, ...Array.from(updatedRowsIndexes)];
    const summary = { updatedData, appendData, updatedRows };
    return summary;
}
// update values of spreadsheet when update mode is 'autoMap'
function updateByAutoMaping(items, sheetData, columnToMatchOn, updateAllOccurences = false) {
    const [columns, ...values] = sheetData;
    const matchColumnIndex = columns.indexOf(columnToMatchOn);
    const matchValuesMap = values.map((row) => row[matchColumnIndex]);
    const updatedRowsIndexes = new Set();
    const appendData = [];
    for (const { json } of items) {
        const columnValue = json[columnToMatchOn];
        if (columnValue === undefined)
            continue;
        const rowIndexes = [];
        if (updateAllOccurences) {
            matchValuesMap.forEach((value, index) => {
                if (value === columnValue || Number(value) === Number(columnValue)) {
                    rowIndexes.push(index);
                }
            });
        }
        else {
            const rowIndex = matchValuesMap.findIndex((value) => value === columnValue || Number(value) === Number(columnValue));
            if (rowIndex !== -1)
                rowIndexes.push(rowIndex);
        }
        if (!rowIndexes.length) {
            appendData.push(json);
            continue;
        }
        const updatedRow = [];
        for (const columnName of columns) {
            const updateValue = json[columnName] === undefined ? null : json[columnName];
            updatedRow.push(updateValue);
        }
        for (const rowIndex of rowIndexes) {
            values[rowIndex] = updatedRow;
            //add rows index and shift by 1 to account for header row
            updatedRowsIndexes.add(rowIndex + 1);
        }
    }
    const updatedData = [columns, ...values];
    const updatedRows = [0, ...Array.from(updatedRowsIndexes)];
    const summary = { updatedData, appendData, updatedRows };
    return summary;
}
const checkRange = (node, range) => {
    const rangeRegex = /^[A-Z]+:[A-Z]+$/i;
    if (rangeRegex.test(range)) {
        throw new n8n_workflow_1.NodeOperationError(node, `Specify the range more precisely e.g. A1:B5, generic ranges like ${range} are not supported`);
    }
};
exports.checkRange = checkRange;
//# sourceMappingURL=utils.js.map