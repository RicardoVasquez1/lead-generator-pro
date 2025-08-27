import { AuthenticatedRequest } from '@n8n/db';
import { EventService } from './event.service';
export declare class EventsController {
    private readonly eventService;
    constructor(eventService: EventService);
    sessionStarted(req: AuthenticatedRequest): void;
}
