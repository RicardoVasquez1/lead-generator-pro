export declare function buildWorkflowsByNodesQuery(nodeTypes: string[], dbType: 'postgresdb' | 'mysqldb' | 'mariadb' | 'sqlite'): {
    whereClause: string;
    parameters: Record<string, string | string[]>;
};
