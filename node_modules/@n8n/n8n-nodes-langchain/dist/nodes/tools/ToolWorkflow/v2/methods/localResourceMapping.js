"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var localResourceMapping_exports = {};
__export(localResourceMapping_exports, {
  loadSubWorkflowInputs: () => loadSubWorkflowInputs
});
module.exports = __toCommonJS(localResourceMapping_exports);
var import_GenericFunctions = require("n8n-nodes-base/dist/utils/workflowInputsResourceMapping/GenericFunctions");
async function loadSubWorkflowInputs() {
  const { fields, subworkflowInfo, dataMode } = await import_GenericFunctions.loadWorkflowInputMappings.bind(this)();
  let emptyFieldsNotice;
  if (fields.length === 0) {
    const { triggerId, workflowId } = subworkflowInfo ?? {};
    const path = (workflowId ?? "") + (triggerId ? `/${triggerId.slice(0, 6)}` : "");
    const subworkflowLink = workflowId ? `<a href="/workflow/${path}" target="_blank">sub-workflow\u2019s trigger</a>` : "sub-workflow\u2019s trigger";
    switch (dataMode) {
      case "passthrough":
        emptyFieldsNotice = `This sub-workflow is set up to receive all input data, without specific inputs the Agent will not be able to pass data to this tool. You can define specific inputs in the ${subworkflowLink}.`;
        break;
      default:
        emptyFieldsNotice = `This sub-workflow will not receive any input when called by your AI node. Define your expected input in the ${subworkflowLink}.`;
        break;
    }
  }
  return { fields, emptyFieldsNotice };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadSubWorkflowInputs
});
//# sourceMappingURL=localResourceMapping.js.map