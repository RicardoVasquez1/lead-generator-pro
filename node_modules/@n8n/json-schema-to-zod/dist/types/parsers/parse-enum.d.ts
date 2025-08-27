import { z } from 'zod';
import type { JsonSchemaObject, Serializable } from '../types';
export declare const parseEnum: (jsonSchema: JsonSchemaObject & {
    enum: Serializable[];
}) => z.ZodNever | z.ZodUnion<[z.ZodTypeAny, z.ZodTypeAny]> | z.ZodLiteral<z.Primitive> | z.ZodEnum<[string]>;
