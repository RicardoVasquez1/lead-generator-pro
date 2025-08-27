"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSheetHeaderRowWithGeneratedColumnNames = getSheetHeaderRowWithGeneratedColumnNames;
const loadOptions_1 = require("../../Google/Sheet/v2/methods/loadOptions");
async function getSheetHeaderRowWithGeneratedColumnNames() {
    const returnData = await loadOptions_1.getSheetHeaderRow.call(this);
    return returnData.map((column, i) => {
        if (column.value !== '')
            return column;
        const indexBasedValue = `col_${i + 1}`;
        return {
            name: indexBasedValue,
            value: indexBasedValue,
        };
    });
}
//# sourceMappingURL=loadOptions.js.map