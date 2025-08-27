import { PasswordUpdateRequestDto, SettingsUpdateRequestDto, UserUpdateRequestDto } from '@n8n/api-types';
import { Logger } from '@n8n/backend-common';
import type { User, PublicUser } from '@n8n/db';
import { UserRepository, AuthenticatedRequest } from '@n8n/db';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../events/event.service';
import { ExternalHooks } from '../external-hooks';
import { MfaService } from '../mfa/mfa.service';
import { MeRequest } from '../requests';
import { PasswordUtility } from '../services/password.utility';
import { UserService } from '../services/user.service';
export declare class MeController {
    private readonly logger;
    private readonly externalHooks;
    private readonly authService;
    private readonly userService;
    private readonly passwordUtility;
    private readonly userRepository;
    private readonly eventService;
    private readonly mfaService;
    constructor(logger: Logger, externalHooks: ExternalHooks, authService: AuthService, userService: UserService, passwordUtility: PasswordUtility, userRepository: UserRepository, eventService: EventService, mfaService: MfaService);
    updateCurrentUser(req: AuthenticatedRequest, res: Response, payload: UserUpdateRequestDto): Promise<PublicUser>;
    updatePassword(req: AuthenticatedRequest, res: Response, payload: PasswordUpdateRequestDto): Promise<{
        success: boolean;
    }>;
    storeSurveyAnswers(req: MeRequest.SurveyAnswers): Promise<{
        success: boolean;
    }>;
    updateCurrentUserSettings(req: AuthenticatedRequest, _: Response, payload: SettingsUpdateRequestDto): Promise<User['settings']>;
}
