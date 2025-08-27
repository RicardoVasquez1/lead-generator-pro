"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWorkflowsByNodesQuery = buildWorkflowsByNodesQuery;
function buildWorkflowsByNodesQuery(nodeTypes, dbType) {
    let whereClause;
    const parameters = { nodeTypes };
    switch (dbType) {
        case 'postgresdb':
            whereClause = `EXISTS (
					SELECT 1
					FROM jsonb_array_elements(workflow.nodes::jsonb) AS node
					WHERE node->>'type' = ANY(:nodeTypes)
				)`;
            break;
        case 'mysqldb':
        case 'mariadb': {
            const conditions = nodeTypes
                .map((_, i) => `JSON_SEARCH(JSON_EXTRACT(workflow.nodes, '$[*].type'), 'one', :nodeType${i}) IS NOT NULL`)
                .join(' OR ');
            whereClause = `(${conditions})`;
            nodeTypes.forEach((nodeType, index) => {
                parameters[`nodeType${index}`] = nodeType;
            });
            break;
        }
        case 'sqlite': {
            const conditions = nodeTypes
                .map((_, i) => `EXISTS (SELECT 1 FROM json_each(workflow.nodes) WHERE json_extract(json_each.value, '$.type') = :nodeType${i})`)
                .join(' OR ');
            whereClause = `(${conditions})`;
            nodeTypes.forEach((nodeType, index) => {
                parameters[`nodeType${index}`] = nodeType;
            });
            break;
        }
        default:
            throw new Error('Unsupported database type');
    }
    return { whereClause, parameters };
}
//# sourceMappingURL=build-workflows-by-nodes-query.js.map