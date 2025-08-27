import { type CronExpression } from 'n8n-workflow';
import type { IRecurrenceRule, ScheduleInterval } from './SchedulerInterface';
export declare function recurrenceCheck(recurrence: IRecurrenceRule, recurrenceRules: number[], timezone: string): boolean;
export declare const toCronExpression: (interval: ScheduleInterval) => CronExpression;
export declare function intervalToRecurrence(interval: ScheduleInterval, index: number): IRecurrenceRule;
//# sourceMappingURL=GenericFunctions.d.ts.map