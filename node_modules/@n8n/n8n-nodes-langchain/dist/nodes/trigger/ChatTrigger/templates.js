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
var templates_exports = {};
__export(templates_exports, {
  createPage: () => createPage,
  getSanitizedI18nConfig: () => getSanitizedI18nConfig,
  getSanitizedInitialMessages: () => getSanitizedInitialMessages
});
module.exports = __toCommonJS(templates_exports);
var import_sanitize_html = __toESM(require("sanitize-html"));
function sanitizeUserInput(input) {
  let sanitized = (0, import_sanitize_html.default)(input, {
    allowedTags: [],
    allowedAttributes: {}
  });
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/data:/gi, "");
  sanitized = sanitized.replace(/vbscript:/gi, "");
  return sanitized;
}
function getSanitizedInitialMessages(initialMessages) {
  const sanitizedString = sanitizeUserInput(initialMessages);
  return sanitizedString.split("\n").map((line) => line.trim()).filter((line) => line !== "");
}
function getSanitizedI18nConfig(config) {
  const sanitized = {};
  for (const [key, value] of Object.entries(config)) {
    sanitized[key] = sanitizeUserInput(value);
  }
  return sanitized;
}
function createPage({
  instanceId,
  webhookUrl,
  showWelcomeScreen,
  loadPreviousSession,
  i18n: { en },
  initialMessages,
  authentication,
  allowFileUploads,
  allowedFilesMimeTypes,
  customCss,
  enableStreaming
}) {
  const validAuthenticationOptions = [
    "none",
    "basicAuth",
    "n8nUserAuth"
  ];
  const validLoadPreviousSessionOptions = [
    "manually",
    "memory",
    "notSupported"
  ];
  const sanitizedAuthentication = validAuthenticationOptions.includes(authentication) ? authentication : "none";
  const sanitizedShowWelcomeScreen = !!showWelcomeScreen;
  const sanitizedAllowFileUploads = !!allowFileUploads;
  const sanitizedAllowedFilesMimeTypes = allowedFilesMimeTypes?.toString() ?? "";
  const sanitizedCustomCss = (0, import_sanitize_html.default)(`<style>${customCss?.toString() ?? ""}</style>`, {
    allowedTags: ["style"],
    allowedAttributes: false
  });
  const sanitizedLoadPreviousSession = validLoadPreviousSessionOptions.includes(
    loadPreviousSession
  ) ? loadPreviousSession : "notSupported";
  const sanitizedInitialMessages = getSanitizedInitialMessages(initialMessages);
  const sanitizedI18nConfig = getSanitizedI18nConfig(en || {});
  return `<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<title>Chat</title>
			<link href="https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css" rel="stylesheet" />
			<link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" />
			<style>
				html,
				body,
				#n8n-chat {
					width: 100%;
					height: 100%;
				}
			</style>
			${sanitizedCustomCss}
		</head>
		<body>
			<script type="module">
				import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

				(async function () {
					const authentication = '${sanitizedAuthentication}';
					let metadata;
					if (authentication === 'n8nUserAuth') {
						try {
							const response = await fetch('/rest/login', {
									method: 'GET',
									headers: { 'browser-id': localStorage.getItem('n8n-browserId') }
							});

							if (response.status !== 200) {
								throw new Error('Not logged in');
							}

							const responseData = await response.json();
							metadata = {
								user: {
									id: responseData.data.id,
									firstName: responseData.data.firstName,
									lastName: responseData.data.lastName,
									email: responseData.data.email,
								},
							};
						} catch (error) {
							window.location.href = '/signin?redirect=' + window.location.href;
							return;
						}
					}

					createChat({
						mode: 'fullscreen',
						webhookUrl: '${webhookUrl}',
						showWelcomeScreen: ${sanitizedShowWelcomeScreen},
						loadPreviousSession: ${sanitizedLoadPreviousSession !== "notSupported"},
						metadata: metadata,
						webhookConfig: {
							headers: {
								'Content-Type': 'application/json',
								'X-Instance-Id': '${instanceId}',
							}
						},
						allowFileUploads: ${sanitizedAllowFileUploads},
						allowedFilesMimeTypes: '${sanitizedAllowedFilesMimeTypes}',
						i18n: {
							${Object.keys(sanitizedI18nConfig).length ? `en: ${JSON.stringify(sanitizedI18nConfig)},` : ""}
						},
						${sanitizedInitialMessages.length ? `initialMessages: ${JSON.stringify(sanitizedInitialMessages)},` : ""}
						enableStreaming: ${!!enableStreaming},
					});
				})();
			</script>
		</body>
	</html>`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createPage,
  getSanitizedI18nConfig,
  getSanitizedInitialMessages
});
//# sourceMappingURL=templates.js.map