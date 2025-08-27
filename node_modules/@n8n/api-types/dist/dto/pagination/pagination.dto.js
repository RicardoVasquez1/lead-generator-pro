"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = exports.paginationSchema = exports.createTakeValidator = exports.MAX_ITEMS_PER_PAGE = void 0;
const zod_1 = require("zod");
const zod_class_1 = require("zod-class");
exports.MAX_ITEMS_PER_PAGE = 50;
const skipValidator = zod_1.z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 0))
    .refine((val) => !isNaN(val) && Number.isInteger(val), {
    message: 'Param `skip` must be a valid integer',
})
    .refine((val) => val >= 0, {
    message: 'Param `skip` must be a non-negative integer',
});
const createTakeValidator = (maxItems, allowInfinity = false) => zod_1.z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => !isNaN(val) && Number.isInteger(val), {
    message: 'Param `take` must be a valid integer',
})
    .refine((val) => {
    if (!allowInfinity)
        return val >= 0;
    return true;
}, {
    message: 'Param `take` must be a non-negative integer',
})
    .transform((val) => Math.min(val, maxItems));
exports.createTakeValidator = createTakeValidator;
exports.paginationSchema = {
    skip: skipValidator,
    take: (0, exports.createTakeValidator)(exports.MAX_ITEMS_PER_PAGE),
};
class PaginationDto extends zod_class_1.Z.class(exports.paginationSchema) {
}
exports.PaginationDto = PaginationDto;
//# sourceMappingURL=pagination.dto.js.map