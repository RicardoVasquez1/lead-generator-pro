"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskCancelledError = void 0;
const errors_1 = require("@n8n/errors");
class TaskCancelledError extends errors_1.ApplicationError {
    constructor(reason) {
        super(`Task cancelled: ${reason}`, { level: 'warning' });
    }
}
exports.TaskCancelledError = TaskCancelledError;
//# sourceMappingURL=task-cancelled-error.js.map