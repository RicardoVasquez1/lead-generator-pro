interface LLMProviderConfig {
    apiKey: string;
    baseUrl?: string;
    headers?: Record<string, string>;
}
export declare const o4mini: (config: LLMProviderConfig) => Promise<import("@langchain/openai").ChatOpenAI<import("@langchain/openai").ChatOpenAICallOptions>>;
export declare const gpt41mini: (config: LLMProviderConfig) => Promise<import("@langchain/openai").ChatOpenAI<import("@langchain/openai").ChatOpenAICallOptions>>;
export declare const gpt41: (config: LLMProviderConfig) => Promise<import("@langchain/openai").ChatOpenAI<import("@langchain/openai").ChatOpenAICallOptions>>;
export declare const anthropicClaudeSonnet4: (config: LLMProviderConfig) => Promise<import("@langchain/anthropic").ChatAnthropic>;
export {};
