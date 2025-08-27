"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiBuilderChatRequestDto = void 0;
const zod_1 = require("zod");
const zod_class_1 = require("zod-class");
class AiBuilderChatRequestDto extends zod_class_1.Z.class({
    payload: zod_1.z.object({
        role: zod_1.z.literal('user'),
        type: zod_1.z.literal('message'),
        text: zod_1.z.string(),
        workflowContext: zod_1.z.object({
            currentWorkflow: zod_1.z
                .custom((val) => {
                if (!val.nodes && !val.connections) {
                    return false;
                }
                return val;
            })
                .optional(),
            executionData: zod_1.z
                .custom((val) => {
                if (!val.runData && !val.error) {
                    return false;
                }
                return val;
            })
                .optional(),
            executionSchema: zod_1.z
                .custom((val) => {
                if (!Array.isArray(val) || val.every((item) => !item.nodeName || !item.schema)) {
                    return false;
                }
                return val;
            })
                .optional(),
        }),
    }),
}) {
}
exports.AiBuilderChatRequestDto = AiBuilderChatRequestDto;
//# sourceMappingURL=ai-build-request.dto.js.map