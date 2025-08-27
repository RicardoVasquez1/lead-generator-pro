"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacySqliteExecutionRecoveryService = void 0;
const backend_common_1 = require("@n8n/backend-common");
const config_1 = require("@n8n/config");
const db_1 = require("@n8n/db");
const di_1 = require("@n8n/di");
const assert_1 = __importDefault(require("assert"));
let LegacySqliteExecutionRecoveryService = class LegacySqliteExecutionRecoveryService {
    constructor(logger, executionRepository, globalConfig, dbConnection) {
        this.executionRepository = executionRepository;
        this.globalConfig = globalConfig;
        this.dbConnection = dbConnection;
        this.logger = logger.scoped('legacy-sqlite-execution-recovery');
    }
    async cleanupWorkflowExecutions() {
        (0, assert_1.default)(this.globalConfig.database.isLegacySqlite, 'Only usable when on legacy SQLite driver');
        (0, assert_1.default)(this.dbConnection.connectionState.connected && this.dbConnection.connectionState.migrated, 'The database connection must be connected and migrated before running cleanupWorkflowExecutions');
        this.logger.debug('Starting legacy SQLite execution recovery...');
        const invalidExecutions = await this.executionRepository.findQueuedExecutionsWithoutData();
        if (invalidExecutions.length > 0) {
            await this.executionRepository.markAsCrashed(invalidExecutions.map((e) => e.id));
            this.logger.debug(`Marked ${invalidExecutions.length} executions as crashed due to missing execution data.`);
        }
        this.logger.debug('Legacy SQLite execution recovery completed.');
    }
};
exports.LegacySqliteExecutionRecoveryService = LegacySqliteExecutionRecoveryService;
exports.LegacySqliteExecutionRecoveryService = LegacySqliteExecutionRecoveryService = __decorate([
    (0, di_1.Service)(),
    __metadata("design:paramtypes", [backend_common_1.Logger,
        db_1.ExecutionRepository,
        config_1.GlobalConfig,
        db_1.DbConnection])
], LegacySqliteExecutionRecoveryService);
//# sourceMappingURL=legacy-sqlite-execution-recovery.service.js.map