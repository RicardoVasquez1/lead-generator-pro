import { z } from 'zod';
import { Z } from 'zod-class';
declare const OidcConfigDto_base: Z.Class<{
    clientId: z.ZodString;
    clientSecret: z.ZodString;
    discoveryEndpoint: z.ZodString;
    loginEnabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}>;
export declare class OidcConfigDto extends OidcConfigDto_base {
}
export {};
