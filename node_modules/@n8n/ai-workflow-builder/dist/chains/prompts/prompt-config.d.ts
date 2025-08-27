import type { NodePromptConfig } from '../../types/config';
export declare const DEFAULT_PROMPT_CONFIG: NodePromptConfig;
export declare function getNodeTypeCategory(nodeType: string, config?: NodePromptConfig): string | null;
export declare function mentionsResourceKeywords(changes: string[], config?: NodePromptConfig): boolean;
export declare function mentionsTextKeywords(changes: string[], config?: NodePromptConfig): boolean;
