"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderFormNode = void 0;
const utils_1 = require("./utils");
const renderFormNode = async (context, res, trigger, fields, mode) => {
    const options = context.getNodeParameter('options', {});
    let title = options.formTitle;
    if (!title) {
        title = context.evaluateExpression(`{{ $('${trigger?.name}').params.formTitle }}`);
    }
    let buttonLabel = options.buttonLabel;
    if (!buttonLabel) {
        buttonLabel =
            context.evaluateExpression(`{{ $('${trigger?.name}').params.options?.buttonLabel }}`) || 'Submit';
    }
    const appendAttribution = context.evaluateExpression(`{{ $('${trigger?.name}').params.options?.appendAttribution === false ? false : true }}`);
    (0, utils_1.renderForm)({
        context,
        res,
        formTitle: title,
        formDescription: options.formDescription,
        formFields: fields,
        responseMode: 'responseNode',
        mode,
        redirectUrl: undefined,
        appendAttribution,
        buttonLabel,
        customCss: options.customCss,
    });
    return {
        noWebhookResponse: true,
    };
};
exports.renderFormNode = renderFormNode;
//# sourceMappingURL=formNodeUtils.js.map