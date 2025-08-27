import { Logger } from '@n8n/backend-common';
import type { Redis as SingleNodeClient, Cluster as MultiNodeClient } from 'ioredis';
import { InstanceSettings } from 'n8n-core';
import { RedisClientService } from '../../services/redis-client.service';
import { PubSubEventBus } from './pubsub.eventbus';
import type { PubSub } from './pubsub.types';
export declare class Subscriber {
    private readonly logger;
    private readonly instanceSettings;
    private readonly pubsubEventBus;
    private readonly redisClientService;
    private readonly client;
    constructor(logger: Logger, instanceSettings: InstanceSettings, pubsubEventBus: PubSubEventBus, redisClientService: RedisClientService);
    getClient(): SingleNodeClient | MultiNodeClient;
    shutdown(): void;
    subscribe(channel: PubSub.Channel): Promise<void>;
    private parseMessage;
}
