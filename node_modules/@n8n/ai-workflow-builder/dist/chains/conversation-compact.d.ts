import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { BaseMessage } from '@langchain/core/messages';
export declare function conversationCompactChain(llm: BaseChatModel, messages: BaseMessage[], previousSummary?: string): Promise<{
    success: boolean;
    summary: Record<string, any>;
    summaryPlain: string;
}>;
