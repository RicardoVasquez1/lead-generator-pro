"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentWorkflow = getCurrentWorkflow;
exports.getWorkflowState = getWorkflowState;
exports.getCurrentWorkflowFromTaskInput = getCurrentWorkflowFromTaskInput;
exports.updateWorkflowConnections = updateWorkflowConnections;
exports.addNodeToWorkflow = addNodeToWorkflow;
exports.addNodesToWorkflow = addNodesToWorkflow;
exports.removeNodeFromWorkflow = removeNodeFromWorkflow;
exports.removeNodesFromWorkflow = removeNodesFromWorkflow;
exports.updateNodeInWorkflow = updateNodeInWorkflow;
exports.addConnectionToWorkflow = addConnectionToWorkflow;
const langgraph_1 = require("@langchain/langgraph");
function getCurrentWorkflow(state) {
    return state.workflowJSON;
}
function getWorkflowState() {
    return (0, langgraph_1.getCurrentTaskInput)();
}
function getCurrentWorkflowFromTaskInput() {
    const state = getWorkflowState();
    return getCurrentWorkflow(state);
}
function updateWorkflowConnections(connections) {
    return {
        workflowOperations: [{ type: 'mergeConnections', connections }],
    };
}
function addNodeToWorkflow(node) {
    return addNodesToWorkflow([node]);
}
function addNodesToWorkflow(nodes) {
    return {
        workflowOperations: [{ type: 'addNodes', nodes }],
    };
}
function removeNodeFromWorkflow(nodeId) {
    return {
        workflowOperations: [{ type: 'removeNode', nodeIds: [nodeId] }],
    };
}
function removeNodesFromWorkflow(nodeIds) {
    return {
        workflowOperations: [{ type: 'removeNode', nodeIds }],
    };
}
function updateNodeInWorkflow(state, nodeId, updates) {
    const existingNode = state.workflowJSON.nodes.find((n) => n.id === nodeId);
    if (!existingNode) {
        return {};
    }
    return {
        workflowOperations: [{ type: 'updateNode', nodeId, updates }],
    };
}
function addConnectionToWorkflow(sourceNodeId, _targetNodeId, connection) {
    return {
        workflowOperations: [
            {
                type: 'mergeConnections',
                connections: {
                    [sourceNodeId]: {
                        main: [[connection]],
                    },
                },
            },
        ],
    };
}
//# sourceMappingURL=state.js.map