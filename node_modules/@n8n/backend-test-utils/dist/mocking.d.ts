import { type Constructable } from '@n8n/di';
import type { DeepPartial } from 'ts-essentials';
export declare const mockInstance: <T>(serviceClass: Constructable<T>, data?: DeepPartial<T> | undefined) => { [K in keyof T]: T[K] extends (...args: infer A) => infer B ? import("jest-mock-extended").CalledWithMock<B, A> : T[K]; } & T;
