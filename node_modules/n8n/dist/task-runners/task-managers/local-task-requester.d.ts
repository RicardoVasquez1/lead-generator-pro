import type { RequesterMessage } from '@n8n/task-runner';
import { EventService } from '../../events/event.service';
import { NodeTypes } from '../../node-types';
import { TaskBroker } from '../../task-runners/task-broker/task-broker.service';
import { TaskRequester } from './task-requester';
export declare class LocalTaskRequester extends TaskRequester {
    taskBroker: TaskBroker;
    id: string;
    constructor(nodeTypes: NodeTypes, eventService: EventService);
    registerRequester(): void;
    sendMessage(message: RequesterMessage.ToBroker.All): void;
}
