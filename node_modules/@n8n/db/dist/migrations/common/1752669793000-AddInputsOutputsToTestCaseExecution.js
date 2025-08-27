"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddInputsOutputsToTestCaseExecution1752669793000 = void 0;
class AddInputsOutputsToTestCaseExecution1752669793000 {
    async up({ schemaBuilder: { addColumns, column } }) {
        await addColumns('test_case_execution', [column('inputs').json, column('outputs').json]);
    }
    async down({ schemaBuilder: { dropColumns } }) {
        await dropColumns('test_case_execution', ['inputs', 'outputs']);
    }
}
exports.AddInputsOutputsToTestCaseExecution1752669793000 = AddInputsOutputsToTestCaseExecution1752669793000;
//# sourceMappingURL=1752669793000-AddInputsOutputsToTestCaseExecution.js.map