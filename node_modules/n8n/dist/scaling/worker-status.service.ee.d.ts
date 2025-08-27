import { WorkerStatus } from '@n8n/api-types';
import { InstanceSettings } from 'n8n-core';
import { Push } from '../push';
import { JobProcessor } from './job-processor';
import { Publisher } from './pubsub/publisher.service';
export declare class WorkerStatusService {
    private readonly jobProcessor;
    private readonly instanceSettings;
    private readonly publisher;
    private readonly push;
    constructor(jobProcessor: JobProcessor, instanceSettings: InstanceSettings, publisher: Publisher, push: Push);
    requestWorkerStatus(): Promise<void>;
    handleWorkerStatusResponse(payload: WorkerStatus): void;
    publishWorkerResponse(): Promise<void>;
    private generateStatus;
    private getOsCpuString;
}
