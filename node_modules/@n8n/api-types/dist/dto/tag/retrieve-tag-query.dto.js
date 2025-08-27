"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrieveTagQueryDto = void 0;
const zod_class_1 = require("zod-class");
const boolean_from_string_1 = require("../../schemas/boolean-from-string");
class RetrieveTagQueryDto extends zod_class_1.Z.class({
    withUsageCount: boolean_from_string_1.booleanFromString.optional().default('false'),
}) {
}
exports.RetrieveTagQueryDto = RetrieveTagQueryDto;
//# sourceMappingURL=retrieve-tag-query.dto.js.map