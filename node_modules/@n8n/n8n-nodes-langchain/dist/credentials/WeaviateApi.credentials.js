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
var WeaviateApi_credentials_exports = {};
__export(WeaviateApi_credentials_exports, {
  WeaviateApi: () => WeaviateApi
});
module.exports = __toCommonJS(WeaviateApi_credentials_exports);
class WeaviateApi {
  constructor() {
    this.name = "weaviateApi";
    this.displayName = "Weaviate Credentials";
    this.documentationUrl = "https://docs.n8n.io/integrations/builtin/credentials/weaviate/";
    this.properties = [
      {
        displayName: "Connection Type",
        name: "connection_type",
        type: "options",
        options: [
          {
            name: "Weaviate Cloud",
            value: "weaviate_cloud"
          },
          {
            name: "Custom Connection",
            value: "custom_connection"
          }
        ],
        default: "weaviate_cloud",
        description: "Choose whether to connect to a Weaviate Cloud instance or a custom Weaviate instance."
      },
      {
        displayName: "Weaviate Cloud Endpoint",
        name: "weaviate_cloud_endpoint",
        description: "The Endpoint of a Weaviate Cloud instance.",
        placeholder: "https://your-cluster.weaviate.cloud",
        type: "string",
        required: true,
        default: "",
        displayOptions: {
          show: {
            connection_type: ["weaviate_cloud"]
          }
        }
      },
      {
        displayName: "Weaviate Api Key",
        name: "weaviate_api_key",
        description: "The API key for the Weaviate instance.",
        type: "string",
        typeOptions: { password: true },
        default: ""
      },
      {
        displayName: "Custom Connection HTTP Host",
        name: "custom_connection_http_host",
        description: "The host of your Weaviate instance.",
        type: "string",
        required: true,
        default: "weaviate",
        displayOptions: {
          show: {
            connection_type: ["custom_connection"]
          }
        }
      },
      {
        displayName: "Custom Connection HTTP Port",
        name: "custom_connection_http_port",
        description: "The port of your Weaviate instance.",
        type: "number",
        required: true,
        default: 8080,
        displayOptions: {
          show: {
            connection_type: ["custom_connection"]
          }
        }
      },
      {
        displayName: "Custom Connection HTTP Secure",
        name: "custom_connection_http_secure",
        description: "Whether to use a secure connection for HTTP.",
        type: "boolean",
        required: true,
        default: false,
        displayOptions: {
          show: {
            connection_type: ["custom_connection"]
          }
        }
      },
      {
        displayName: "Custom Connection gRPC Host",
        name: "custom_connection_grpc_host",
        description: "The gRPC host of your Weaviate instance.",
        type: "string",
        required: true,
        default: "weaviate",
        displayOptions: {
          show: {
            connection_type: ["custom_connection"]
          }
        }
      },
      {
        displayName: "Custom Connection gRPC Port",
        name: "custom_connection_grpc_port",
        description: "The gRPC port of your Weaviate instance.",
        type: "number",
        required: true,
        default: 50051,
        displayOptions: {
          show: {
            connection_type: ["custom_connection"]
          }
        }
      },
      {
        displayName: "Custom Connection gRPC Secure",
        name: "custom_connection_grpc_secure",
        description: "Whether to use a secure connection for gRPC.",
        type: "boolean",
        required: true,
        default: false,
        displayOptions: {
          show: {
            connection_type: ["custom_connection"]
          }
        }
      }
    ];
    this.test = {
      request: {
        baseURL: '={{$credentials.weaviate_cloud_endpoint?$credentials.weaviate_cloud_endpoint.startsWith("http://") || $credentials.weaviate_cloud_endpoint.startsWith("https://")?$credentials.weaviate_cloud_endpoint:"https://" + $credentials.weaviate_cloud_endpoint:($credentials.custom_connection_http_secure ? "https" : "http") + "://" + $credentials.custom_connection_http_host + ":" + $credentials.custom_connection_http_port }}',
        url: "/v1/nodes",
        disableFollowRedirect: false,
        headers: {
          Authorization: '={{$if($credentials.weaviate_api_key, "Bearer " + $credentials.weaviate_api_key, undefined)}}'
        }
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WeaviateApi
});
//# sourceMappingURL=WeaviateApi.credentials.js.map