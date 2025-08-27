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
var ToolWorkflowV2_node_exports = {};
__export(ToolWorkflowV2_node_exports, {
  ToolWorkflowV2: () => ToolWorkflowV2
});
module.exports = __toCommonJS(ToolWorkflowV2_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_methods = require("./methods");
var import_WorkflowToolService = require("./utils/WorkflowToolService");
var import_versionDescription = require("./versionDescription");
class ToolWorkflowV2 {
  constructor(baseDescription) {
    this.methods = {
      localResourceMapping: import_methods.localResourceMapping
    };
    this.description = {
      ...baseDescription,
      ...import_versionDescription.versionDescription
    };
  }
  async supplyData(itemIndex) {
    const node = this.getNode();
    const { typeVersion } = node;
    const returnAllItems = typeVersion > 2;
    const workflowToolService = new import_WorkflowToolService.WorkflowToolService(this, { returnAllItems });
    const name = typeVersion <= 2.1 ? this.getNodeParameter("name", itemIndex) : (0, import_n8n_workflow.nodeNameToToolName)(node);
    const description = this.getNodeParameter("description", itemIndex);
    const tool = await workflowToolService.createTool({
      ctx: this,
      name,
      description,
      itemIndex
    });
    return { response: tool };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToolWorkflowV2
});
//# sourceMappingURL=ToolWorkflowV2.node.js.map