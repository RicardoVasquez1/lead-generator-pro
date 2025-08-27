import { type InstalledNodes, type InstalledPackages, type User } from '@n8n/db';
import { z } from 'zod';
import { BaseCommand } from './base-command';
declare const flagsSchema: z.ZodObject<{
    uninstall: z.ZodOptional<z.ZodBoolean>;
    package: z.ZodOptional<z.ZodString>;
    credential: z.ZodOptional<z.ZodString>;
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    credential?: string | undefined;
    uninstall?: boolean | undefined;
    userId?: string | undefined;
    package?: string | undefined;
}, {
    credential?: string | undefined;
    uninstall?: boolean | undefined;
    userId?: string | undefined;
    package?: string | undefined;
}>;
export declare class CommunityNode extends BaseCommand<z.infer<typeof flagsSchema>> {
    run(): Promise<void>;
    catch(error: Error): Promise<void>;
    uninstallCredential(credentialType: string, userId: string): Promise<void>;
    findUserById(userId: string): Promise<User | null>;
    findCredentialsByType(credentialType: string): Promise<import("@n8n/db").CredentialsEntity[]>;
    deleteCredential(user: User, credentialId: string): Promise<void>;
    uninstallPackage(packageName: string): Promise<void>;
    pruneDependencies(): Promise<void>;
    deleteCommunityNode(node: InstalledNodes): Promise<import("@n8n/typeorm").DeleteResult>;
    removeCommunityPackage(packageName: string, communityPackage: InstalledPackages): Promise<void>;
    findCommunityPackage(packageName: string): Promise<InstalledPackages | null>;
}
export {};
