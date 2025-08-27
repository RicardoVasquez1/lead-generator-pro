"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeToolsInParallel = executeToolsInParallel;
const messages_1 = require("@langchain/core/messages");
const tools_1 = require("@langchain/core/tools");
const langgraph_1 = require("@langchain/langgraph");
const errors_1 = require("../errors");
async function executeToolsInParallel(options) {
    const { state, toolMap } = options;
    const lastMessage = state.messages.at(-1);
    if (!lastMessage || !(0, messages_1.isAIMessage)(lastMessage)) {
        const error = new errors_1.WorkflowStateError('Most recent message must be an AIMessage with tool calls');
        throw error;
    }
    const aiMessage = lastMessage;
    if (!aiMessage.tool_calls?.length) {
        const error = new errors_1.WorkflowStateError('AIMessage must have tool calls');
        throw error;
    }
    const toolResults = await Promise.all(aiMessage.tool_calls.map(async (toolCall) => {
        try {
            const tool = toolMap.get(toolCall.name);
            if (!tool) {
                throw new errors_1.ToolExecutionError(`Tool ${toolCall.name} not found`, {
                    toolName: toolCall.name,
                });
            }
            const result = await tool.invoke(toolCall.args ?? {}, {
                toolCall: {
                    id: toolCall.id,
                    name: toolCall.name,
                    args: toolCall.args ?? {},
                },
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            let errorContent;
            if (error instanceof tools_1.ToolInputParsingException ||
                errorMessage.includes('expected schema')) {
                errorContent = `Invalid input for tool ${toolCall.name}: ${errorMessage}`;
            }
            else {
                errorContent = `Tool ${toolCall.name} failed: ${errorMessage}`;
            }
            return new messages_1.ToolMessage({
                content: errorContent,
                tool_call_id: toolCall.id ?? '',
                additional_kwargs: { error: true },
            });
        }
    }));
    const allMessages = [];
    const stateUpdates = [];
    toolResults.forEach((result) => {
        if ((0, langgraph_1.isCommand)(result)) {
            const update = result.update;
            if (update) {
                stateUpdates.push(update);
            }
        }
        else {
            allMessages.push(result);
        }
    });
    stateUpdates.forEach((update) => {
        if (update.messages && Array.isArray(update.messages)) {
            allMessages.push(...update.messages);
        }
    });
    const allOperations = [];
    for (const update of stateUpdates) {
        if (update.workflowOperations && Array.isArray(update.workflowOperations)) {
            allOperations.push(...update.workflowOperations);
        }
    }
    const finalUpdate = {
        messages: allMessages,
    };
    if (allOperations.length > 0) {
        finalUpdate.workflowOperations = allOperations;
    }
    return finalUpdate;
}
//# sourceMappingURL=tool-executor.js.map