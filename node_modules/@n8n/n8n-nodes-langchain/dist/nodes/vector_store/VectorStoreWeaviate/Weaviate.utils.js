"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Weaviate_utils_exports = {};
__export(Weaviate_utils_exports, {
  createWeaviateClient: () => createWeaviateClient,
  parseCompositeFilter: () => parseCompositeFilter
});
module.exports = __toCommonJS(Weaviate_utils_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_weaviate_client = __toESM(require("weaviate-client"));
async function createWeaviateClient(credentials, timeout, proxies, skipInitChecks = false) {
  if (credentials.weaviate_cloud_endpoint) {
    const weaviateClient = await import_weaviate_client.default.connectToWeaviateCloud(
      credentials.weaviate_cloud_endpoint,
      {
        authCredentials: new import_weaviate_client.default.ApiKey(credentials.weaviate_api_key),
        timeout,
        skipInitChecks
      }
    );
    return weaviateClient;
  } else {
    const weaviateClient = await import_weaviate_client.default.connectToCustom({
      httpHost: credentials.custom_connection_http_host,
      httpPort: credentials.custom_connection_http_port,
      grpcHost: credentials.custom_connection_grpc_host,
      grpcPort: credentials.custom_connection_grpc_port,
      grpcSecure: credentials.custom_connection_grpc_secure,
      httpSecure: credentials.custom_connection_http_secure,
      authCredentials: credentials.weaviate_api_key ? new import_weaviate_client.default.ApiKey(credentials.weaviate_api_key) : void 0,
      timeout,
      proxies,
      skipInitChecks
    });
    return weaviateClient;
  }
}
function buildFilter(filter) {
  const { path, operator } = filter;
  const property = import_weaviate_client.default.filter.byProperty(path[0]);
  switch (operator.toLowerCase()) {
    case "equal":
      if (filter.valueString !== void 0) return property.equal(filter.valueString);
      if (filter.valueNumber !== void 0) return property.equal(filter.valueNumber);
      break;
    case "like":
      if (filter.valueString === void 0) {
        throw new import_n8n_workflow.OperationalError("Missing 'valueString' for 'like' operator.");
      }
      return property.like(filter.valueString);
    case "containsany":
      if (filter.valueTextArray === void 0) {
        throw new import_n8n_workflow.OperationalError("Missing 'valueTextArray' for 'containsAny' operator.");
      }
      return property.containsAny(filter.valueTextArray);
    case "containsall":
      if (filter.valueTextArray === void 0) {
        throw new import_n8n_workflow.OperationalError("Missing 'valueTextArray' for 'containsAll' operator.");
      }
      return property.containsAll(filter.valueTextArray);
    case "greaterthan":
      if (filter.valueNumber === void 0) {
        throw new import_n8n_workflow.OperationalError("Missing 'valueNumber' for 'greaterThan' operator.");
      }
      return property.greaterThan(filter.valueNumber);
    case "lessthan":
      if (filter.valueNumber === void 0) {
        throw new import_n8n_workflow.OperationalError("Missing 'valueNumber' for 'lessThan' operator.");
      }
      return property.lessThan(filter.valueNumber);
    case "isnull":
      if (filter.valueBoolean === void 0) {
        throw new import_n8n_workflow.OperationalError("Missing 'valueBoolean' for 'isNull' operator.");
      }
      return property.isNull(filter.valueBoolean);
    case "withingeorange":
      if (!filter.valueGeoCoordinates) {
        throw new import_n8n_workflow.OperationalError("Missing 'valueGeoCoordinates' for 'withinGeoRange' operator.");
      }
      return property.withinGeoRange(filter.valueGeoCoordinates);
    default:
      throw new import_n8n_workflow.OperationalError(`Unsupported operator: ${operator}`);
  }
  throw new import_n8n_workflow.OperationalError(`No valid filter value provided for operator: ${operator}`);
}
function parseCompositeFilter(filter) {
  if (typeof filter === "object" && ("AND" in filter || "OR" in filter)) {
    if ("AND" in filter) {
      return import_weaviate_client.Filters.and(...filter.AND.map(buildFilter));
    } else if ("OR" in filter) {
      return import_weaviate_client.Filters.or(...filter.OR.map(buildFilter));
    }
  }
  return buildFilter(filter);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createWeaviateClient,
  parseCompositeFilter
});
//# sourceMappingURL=Weaviate.utils.js.map