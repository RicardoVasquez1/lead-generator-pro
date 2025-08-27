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
var utils_exports = {};
__export(utils_exports, {
  configureHttpRequestFunction: () => configureHttpRequestFunction,
  configureResponseOptimizer: () => configureResponseOptimizer,
  configureToolFunction: () => configureToolFunction,
  extractParametersFromText: () => extractParametersFromText,
  makeToolInputSchema: () => makeToolInputSchema,
  prepareToolDescription: () => prepareToolDescription,
  updateParametersAndOptions: () => updateParametersAndOptions
});
module.exports = __toCommonJS(utils_exports);
var import_readability = require("@mozilla/readability");
var cheerio = __toESM(require("cheerio"));
var import_html_to_text = require("html-to-text");
var import_jsdom = require("jsdom");
var import_get = __toESM(require("lodash/get"));
var import_set = __toESM(require("lodash/set"));
var import_unset = __toESM(require("lodash/unset"));
var import_GenericFunctions = require("n8n-nodes-base/dist/nodes/HttpRequest/GenericFunctions");
var import_n8n_workflow = require("n8n-workflow");
var import_zod = require("zod");
const genericCredentialRequest = async (ctx, itemIndex) => {
  const genericType = ctx.getNodeParameter("genericAuthType", itemIndex);
  if (genericType === "httpBasicAuth" || genericType === "httpDigestAuth") {
    const basicAuth = await ctx.getCredentials("httpBasicAuth", itemIndex);
    const sendImmediately = genericType === "httpDigestAuth" ? false : void 0;
    return async (options) => {
      options.auth = {
        username: basicAuth.user,
        password: basicAuth.password,
        sendImmediately
      };
      return await ctx.helpers.httpRequest(options);
    };
  }
  if (genericType === "httpHeaderAuth") {
    const headerAuth = await ctx.getCredentials("httpHeaderAuth", itemIndex);
    return async (options) => {
      if (!options.headers) options.headers = {};
      options.headers[headerAuth.name] = headerAuth.value;
      return await ctx.helpers.httpRequest(options);
    };
  }
  if (genericType === "httpQueryAuth") {
    const queryAuth = await ctx.getCredentials("httpQueryAuth", itemIndex);
    return async (options) => {
      if (!options.qs) options.qs = {};
      options.qs[queryAuth.name] = queryAuth.value;
      return await ctx.helpers.httpRequest(options);
    };
  }
  if (genericType === "httpCustomAuth") {
    const customAuth = await ctx.getCredentials("httpCustomAuth", itemIndex);
    return async (options) => {
      const auth = (0, import_n8n_workflow.jsonParse)(customAuth.json || "{}", {
        errorMessage: "Invalid Custom Auth JSON"
      });
      if (auth.headers) {
        options.headers = { ...options.headers, ...auth.headers };
      }
      if (auth.body) {
        options.body = { ...options.body, ...auth.body };
      }
      if (auth.qs) {
        options.qs = { ...options.qs, ...auth.qs };
      }
      return await ctx.helpers.httpRequest(options);
    };
  }
  if (genericType === "oAuth1Api") {
    return async (options) => {
      return await ctx.helpers.requestOAuth1.call(ctx, "oAuth1Api", options);
    };
  }
  if (genericType === "oAuth2Api") {
    return async (options) => {
      return await ctx.helpers.requestOAuth2.call(ctx, "oAuth2Api", options, {
        tokenType: "Bearer"
      });
    };
  }
  throw new import_n8n_workflow.NodeOperationError(ctx.getNode(), `The type ${genericType} is not supported`, {
    itemIndex
  });
};
const predefinedCredentialRequest = async (ctx, itemIndex) => {
  const predefinedType = ctx.getNodeParameter("nodeCredentialType", itemIndex);
  const additionalOptions = (0, import_GenericFunctions.getOAuth2AdditionalParameters)(predefinedType);
  return async (options) => {
    return await ctx.helpers.httpRequestWithAuthentication.call(
      ctx,
      predefinedType,
      options,
      additionalOptions && { oauth2: additionalOptions }
    );
  };
};
const configureHttpRequestFunction = async (ctx, credentialsType, itemIndex) => {
  switch (credentialsType) {
    case "genericCredentialType":
      return await genericCredentialRequest(ctx, itemIndex);
    case "predefinedCredentialType":
      return await predefinedCredentialRequest(ctx, itemIndex);
    default:
      return async (options) => {
        return await ctx.helpers.httpRequest(options);
      };
  }
};
const defaultOptimizer = (response) => {
  if (typeof response === "string") {
    return response;
  }
  if (typeof response === "object") {
    return JSON.stringify(response, null, 2);
  }
  return String(response);
};
function isBinary(data) {
  if (Buffer.isBuffer(data)) {
    return true;
  }
  if (typeof data === "string") {
    if (data.includes("\0")) {
      return true;
    }
    return false;
  }
  return false;
}
const htmlOptimizer = (ctx, itemIndex, maxLength) => {
  const cssSelector = ctx.getNodeParameter("cssSelector", itemIndex, "");
  const onlyContent = ctx.getNodeParameter("onlyContent", itemIndex, false);
  let elementsToOmit = [];
  if (onlyContent) {
    const elementsToOmitUi = ctx.getNodeParameter("elementsToOmit", itemIndex, "");
    if (typeof elementsToOmitUi === "string") {
      elementsToOmit = elementsToOmitUi.split(",").filter((s) => s).map((s) => s.trim());
    }
  }
  return (response) => {
    if (typeof response !== "string") {
      throw new import_n8n_workflow.NodeOperationError(
        ctx.getNode(),
        `The response type must be a string. Received: ${typeof response}`,
        { itemIndex }
      );
    }
    const returnData = [];
    const html = cheerio.load(response);
    const htmlElements = html(cssSelector);
    htmlElements.each((_, el) => {
      let value = html(el).html() || "";
      if (onlyContent) {
        let htmlToTextOptions;
        if (elementsToOmit?.length) {
          htmlToTextOptions = {
            selectors: elementsToOmit.map((selector) => ({
              selector,
              format: "skip"
            }))
          };
        }
        value = (0, import_html_to_text.convert)(value, htmlToTextOptions);
      }
      value = value.trim().replace(/^\s+|\s+$/g, "").replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ");
      returnData.push(value);
    });
    const text = JSON.stringify(returnData, null, 2);
    if (maxLength > 0 && text.length > maxLength) {
      return text.substring(0, maxLength);
    }
    return text;
  };
};
const textOptimizer = (ctx, itemIndex, maxLength) => {
  return (response) => {
    if (typeof response === "object") {
      try {
        response = JSON.stringify(response, null, 2);
      } catch (error) {
      }
    }
    if (typeof response !== "string") {
      throw new import_n8n_workflow.NodeOperationError(
        ctx.getNode(),
        `The response type must be a string. Received: ${typeof response}`,
        { itemIndex }
      );
    }
    const dom = new import_jsdom.JSDOM(response);
    const article = new import_readability.Readability(dom.window.document, {
      keepClasses: true
    }).parse();
    const text = article?.textContent || "";
    if (maxLength > 0 && text.length > maxLength) {
      return text.substring(0, maxLength);
    }
    return text;
  };
};
const jsonOptimizer = (ctx, itemIndex) => {
  return (response) => {
    let responseData = response;
    if (typeof responseData === "string") {
      responseData = (0, import_n8n_workflow.jsonParse)(response);
    }
    if (typeof responseData !== "object" || !responseData) {
      throw new import_n8n_workflow.NodeOperationError(
        ctx.getNode(),
        "The response type must be an object or an array of objects",
        { itemIndex }
      );
    }
    const dataField = ctx.getNodeParameter("dataField", itemIndex, "");
    let returnData = [];
    if (!Array.isArray(responseData)) {
      if (dataField) {
        const data = responseData[dataField];
        if (Array.isArray(data)) {
          responseData = data;
        } else {
          responseData = [data];
        }
      } else {
        responseData = [responseData];
      }
    } else {
      if (dataField) {
        responseData = responseData.map((data) => data[dataField]);
      }
    }
    const fieldsToInclude = ctx.getNodeParameter("fieldsToInclude", itemIndex, "all");
    let fields = [];
    if (fieldsToInclude !== "all") {
      fields = ctx.getNodeParameter("fields", itemIndex, []);
      if (typeof fields === "string") {
        fields = fields.split(",").map((field) => field.trim());
      }
    } else {
      returnData = responseData;
    }
    if (fieldsToInclude === "selected") {
      for (const item of responseData) {
        const newItem = {};
        for (const field of fields) {
          (0, import_set.default)(newItem, field, (0, import_get.default)(item, field));
        }
        returnData.push(newItem);
      }
    }
    if (fieldsToInclude === "except") {
      for (const item of responseData) {
        for (const field of fields) {
          (0, import_unset.default)(item, field);
        }
        returnData.push(item);
      }
    }
    return JSON.stringify(returnData, null, 2);
  };
};
const configureResponseOptimizer = (ctx, itemIndex) => {
  const optimizeResponse = ctx.getNodeParameter("optimizeResponse", itemIndex, false);
  if (optimizeResponse) {
    const responseType = ctx.getNodeParameter("responseType", itemIndex);
    let maxLength = 0;
    const truncateResponse = ctx.getNodeParameter("truncateResponse", itemIndex, false);
    if (truncateResponse) {
      maxLength = ctx.getNodeParameter("maxLength", itemIndex, 0);
    }
    switch (responseType) {
      case "html":
        return htmlOptimizer(ctx, itemIndex, maxLength);
      case "text":
        return textOptimizer(ctx, itemIndex, maxLength);
      case "json":
        return jsonOptimizer(ctx, itemIndex);
    }
  }
  return defaultOptimizer;
};
const extractPlaceholders = (text) => {
  const placeholder = /(\{[a-zA-Z0-9_-]+\})/g;
  const returnData = [];
  const matches = text.matchAll(placeholder);
  for (const match of matches) {
    returnData.push(match[0].replace(/{|}/g, ""));
  }
  return returnData;
};
const extractParametersFromText = (placeholders, text, sendIn, key) => {
  if (typeof text !== "string") return [];
  const parameters = extractPlaceholders(text);
  if (parameters.length) {
    const inputParameters = prepareParameters(
      parameters.map((name) => ({
        name,
        valueProvider: "modelRequired"
      })),
      placeholders,
      "keypair",
      sendIn,
      ""
    );
    return key ? inputParameters.parameters.map((p) => ({ ...p, key })) : inputParameters.parameters;
  }
  return [];
};
function prepareParameters(rawParameters, placeholders, parametersInputType, sendIn, modelInputDescription, jsonWithPlaceholders) {
  const parameters = [];
  const values = {};
  if (parametersInputType === "model") {
    return {
      parameters: [
        {
          name: sendIn,
          required: true,
          type: "json",
          description: modelInputDescription,
          sendIn
        }
      ],
      values: {}
    };
  }
  if (parametersInputType === "keypair") {
    for (const entry of rawParameters) {
      if (entry.valueProvider.includes("model")) {
        const placeholder = placeholders.find((p) => p.name === entry.name);
        const parameter = {
          name: entry.name,
          required: entry.valueProvider === "modelRequired",
          sendIn
        };
        if (placeholder) {
          parameter.type = placeholder.type;
          parameter.description = placeholder.description;
        }
        parameters.push(parameter);
      } else if (entry.value) {
        parameters.push(
          ...extractParametersFromText(placeholders, entry.value, sendIn, entry.name)
        );
        values[entry.name] = entry.value;
      }
    }
  }
  if (parametersInputType === "json" && jsonWithPlaceholders) {
    parameters.push(
      ...extractParametersFromText(placeholders, jsonWithPlaceholders, sendIn, `${sendIn + "Raw"}`)
    );
  }
  return {
    parameters,
    values
  };
}
const MODEL_INPUT_DESCRIPTION = {
  qs: "Query parameters for request as key value pairs",
  headers: "Headers parameters for request as key value pairs",
  body: "Body parameters for request as key value pairs"
};
const updateParametersAndOptions = (options) => {
  const {
    ctx,
    itemIndex,
    toolParameters,
    placeholdersDefinitions,
    requestOptions,
    rawRequestOptions,
    requestOptionsProperty,
    inputTypePropertyName,
    jsonPropertyName,
    parametersPropertyName
  } = options;
  const inputType = ctx.getNodeParameter(
    inputTypePropertyName,
    itemIndex,
    "keypair"
  );
  let parametersValues = [];
  if (inputType === "json") {
    rawRequestOptions[requestOptionsProperty] = ctx.getNodeParameter(
      jsonPropertyName,
      itemIndex,
      ""
    );
  } else {
    parametersValues = ctx.getNodeParameter(
      parametersPropertyName,
      itemIndex,
      []
    );
  }
  const inputParameters = prepareParameters(
    parametersValues,
    placeholdersDefinitions,
    inputType,
    requestOptionsProperty,
    MODEL_INPUT_DESCRIPTION[requestOptionsProperty],
    rawRequestOptions[requestOptionsProperty]
  );
  toolParameters.push(...inputParameters.parameters);
  requestOptions[requestOptionsProperty] = {
    ...requestOptions[requestOptionsProperty],
    ...inputParameters.values
  };
};
const getParametersDescription = (parameters) => parameters.map(
  (p) => `${p.name}: (description: ${p.description ?? ""}, type: ${p.type ?? "string"}, required: ${!!p.required})`
).join(",\n ");
const prepareToolDescription = (toolDescription, toolParameters) => {
  let description = `${toolDescription}`;
  if (toolParameters.length) {
    description += `
	Tool expects valid stringified JSON object with ${toolParameters.length} properties.
	Property names with description, type and required status:
	${getParametersDescription(toolParameters)}
	ALL parameters marked as required must be provided`;
  }
  return description;
};
const configureToolFunction = (ctx, itemIndex, toolParameters, requestOptions, rawRequestOptions, httpRequest, optimizeResponse) => {
  return async (query) => {
    const { index } = ctx.addInputData(import_n8n_workflow.NodeConnectionTypes.AiTool, [[{ json: { query } }]]);
    const options = structuredClone(requestOptions);
    const clonedRawRequestOptions = structuredClone(rawRequestOptions);
    let fullResponse;
    let response = "";
    let executionError = void 0;
    if (!toolParameters.length) {
      query = "{}";
    }
    try {
      if (query) {
        let dataFromModel;
        if (typeof query === "string") {
          try {
            dataFromModel = (0, import_n8n_workflow.jsonParse)(query);
          } catch (error) {
            if (toolParameters.length === 1) {
              dataFromModel = { [toolParameters[0].name]: query };
            } else {
              throw new import_n8n_workflow.NodeOperationError(
                ctx.getNode(),
                `Input is not a valid JSON: ${error.message}`,
                { itemIndex }
              );
            }
          }
        } else {
          dataFromModel = query;
        }
        for (const parameter of toolParameters) {
          if (parameter.required && (dataFromModel[parameter.name] === void 0 || dataFromModel[parameter.name] === null)) {
            throw new import_n8n_workflow.NodeOperationError(
              ctx.getNode(),
              `Model did not provide parameter '${parameter.name}' which is required and must be present in the input`,
              { itemIndex }
            );
          }
        }
        for (const parameter of toolParameters) {
          let argument = dataFromModel[parameter.name];
          if (argument && parameter.type === "json" && !["qsRaw", "headersRaw", "bodyRaw"].includes(parameter.key ?? "") && typeof argument !== "object") {
            try {
              argument = (0, import_n8n_workflow.jsonParse)(String(argument));
            } catch (error) {
              throw new import_n8n_workflow.NodeOperationError(
                ctx.getNode(),
                `Parameter ${parameter.name} is not a valid JSON: ${error.message}`,
                {
                  itemIndex
                }
              );
            }
          }
          if (parameter.sendIn === "path") {
            argument = String(argument);
            argument = argument.replace(/^['"]+|['"]+$/g, "");
            options.url = options.url.replace(`{${parameter.name}}`, argument);
            continue;
          }
          if (parameter.sendIn === parameter.name) {
            (0, import_set.default)(options, [parameter.sendIn], argument);
            continue;
          }
          if (["qsRaw", "headersRaw", "bodyRaw"].includes(parameter.key ?? "")) {
            if (parameter.type === "string") {
              argument = String(argument);
              if (!argument.startsWith('"') && !clonedRawRequestOptions[parameter.sendIn].includes(`"{${parameter.name}}"`)) {
                argument = `"${argument}"`;
              }
            }
            if (typeof argument === "object") {
              argument = JSON.stringify(argument);
            }
            clonedRawRequestOptions[parameter.sendIn] = clonedRawRequestOptions[parameter.sendIn].replace(`{${parameter.name}}`, String(argument));
            continue;
          }
          if (parameter.key) {
            let requestOptionsValue = (0, import_get.default)(options, [parameter.sendIn, parameter.key]);
            if (typeof requestOptionsValue === "string") {
              requestOptionsValue = requestOptionsValue.replace(
                `{${parameter.name}}`,
                String(argument)
              );
            }
            (0, import_set.default)(options, [parameter.sendIn, parameter.key], requestOptionsValue);
            continue;
          }
          (0, import_set.default)(options, [parameter.sendIn, parameter.name], argument);
        }
        for (const [key, value] of Object.entries(clonedRawRequestOptions)) {
          if (value) {
            let parsedValue;
            try {
              parsedValue = (0, import_n8n_workflow.jsonParse)(value);
            } catch (error) {
              let recoveredData = "";
              try {
                recoveredData = value.replace(/'/g, '"').replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":').replace(/,\s*([\]}])/g, "$1").replace(/,+$/, "");
                parsedValue = (0, import_n8n_workflow.jsonParse)(recoveredData);
              } catch (err) {
                throw new import_n8n_workflow.NodeOperationError(
                  ctx.getNode(),
                  `Could not replace placeholders in ${key}: ${error.message}`
                );
              }
            }
            options[key] = parsedValue;
          }
        }
      }
      if (options) {
        options.url = encodeURI(options.url);
        if (options.headers && !Object.keys(options.headers).length) {
          delete options.headers;
        }
        if (options.qs && !Object.keys(options.qs).length) {
          delete options.qs;
        }
        if (options.body && !Object.keys(options.body).length) {
          delete options.body;
        }
      }
    } catch (error) {
      const errorMessage = "Input provided by model is not valid";
      if (error instanceof import_n8n_workflow.NodeOperationError) {
        executionError = error;
      } else {
        executionError = new import_n8n_workflow.NodeOperationError(ctx.getNode(), errorMessage, {
          itemIndex
        });
      }
      response = errorMessage;
    }
    if (options) {
      try {
        fullResponse = await httpRequest(options);
      } catch (error) {
        const httpCode = error.httpCode;
        response = `${httpCode ? `HTTP ${httpCode} ` : ""}There was an error: "${error.message}"`;
      }
      if (!response) {
        try {
          if (fullResponse.body && isBinary(fullResponse.body)) {
            throw new import_n8n_workflow.NodeOperationError(ctx.getNode(), "Binary data is not supported");
          }
          response = optimizeResponse(fullResponse.body ?? fullResponse);
        } catch (error) {
          response = `There was an error: "${error.message}"`;
        }
      }
    }
    if (typeof response !== "string") {
      executionError = new import_n8n_workflow.NodeOperationError(ctx.getNode(), "Wrong output type returned", {
        description: `The response property should be a string, but it is an ${typeof response}`
      });
      response = `There was an error: "${executionError.message}"`;
    }
    if (executionError) {
      void ctx.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiTool, index, executionError);
    } else {
      void ctx.addOutputData(import_n8n_workflow.NodeConnectionTypes.AiTool, index, [[{ json: { response } }]]);
    }
    return response;
  };
};
function makeParameterZodSchema(parameter) {
  let schema;
  if (parameter.type === "string") {
    schema = import_zod.z.string();
  } else if (parameter.type === "number") {
    schema = import_zod.z.number();
  } else if (parameter.type === "boolean") {
    schema = import_zod.z.boolean();
  } else if (parameter.type === "json") {
    schema = import_zod.z.record(import_zod.z.any());
  } else {
    schema = import_zod.z.string();
  }
  if (!parameter.required) {
    schema = schema.optional();
  }
  if (parameter.description) {
    schema = schema.describe(parameter.description);
  }
  return schema;
}
function makeToolInputSchema(parameters) {
  const schemaEntries = parameters.map((parameter) => [
    parameter.name,
    makeParameterZodSchema(parameter)
  ]);
  return import_zod.z.object(Object.fromEntries(schemaEntries));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  configureHttpRequestFunction,
  configureResponseOptimizer,
  configureToolFunction,
  extractParametersFromText,
  makeToolInputSchema,
  prepareToolDescription,
  updateParametersAndOptions
});
//# sourceMappingURL=utils.js.map