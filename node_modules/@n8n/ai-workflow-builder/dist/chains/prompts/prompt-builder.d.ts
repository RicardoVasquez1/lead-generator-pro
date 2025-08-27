import type { INodeTypeDescription } from 'n8n-workflow';
import type { PromptBuilderContext } from '../../types/config';
export declare class ParameterUpdatePromptBuilder {
    static buildSystemPrompt(context: PromptBuilderContext): string;
    private static isSetNode;
    private static isIfNode;
    private static isHttpRequestNode;
    private static isToolNode;
    private static needsResourceLocatorGuide;
    private static hasTextFields;
    private static selectRelevantExamples;
    static hasResourceLocatorParameters(nodeDefinition: INodeTypeDescription): boolean;
    static estimateTokens(prompt: string): number;
}
