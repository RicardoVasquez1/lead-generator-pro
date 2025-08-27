"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMappingColumns = getMappingColumns;
const transport_1 = require("../../transport");
const utils_1 = require("../helpers/utils");
const fieldTypeMapping = {
    string: ['text', 'varchar', 'character varying', 'character', 'char'],
    number: [
        'integer',
        'smallint',
        'bigint',
        'decimal',
        'numeric',
        'real',
        'double precision',
        'smallserial',
        'serial',
        'bigserial',
    ],
    boolean: ['boolean'],
    dateTime: [
        'timestamp',
        'date',
        'timestampz',
        'timestamp without time zone',
        'timestamp with time zone',
    ],
    time: ['time', 'time without time zone', 'time with time zone'],
    object: ['json', 'jsonb'],
    options: ['enum', 'USER-DEFINED'],
    array: ['ARRAY'],
};
function mapPostgresType(postgresType) {
    let mappedType = 'string';
    for (const t of Object.keys(fieldTypeMapping)) {
        const postgresTypes = fieldTypeMapping[t];
        if (postgresTypes?.includes(postgresType)) {
            mappedType = t;
        }
    }
    return mappedType;
}
async function getMappingColumns() {
    const credentials = await this.getCredentials('postgres');
    const { db } = await transport_1.configurePostgres.call(this, credentials);
    const schema = this.getNodeParameter('schema', 0, {
        extractValue: true,
    });
    const table = this.getNodeParameter('table', 0, {
        extractValue: true,
    });
    const operation = this.getNodeParameter('operation', 0, {
        extractValue: true,
    });
    const columns = await (0, utils_1.getTableSchema)(db, schema, table, { getColumnsForResourceMapper: true });
    const unique = operation === 'upsert' ? await (0, utils_1.uniqueColumns)(db, table, schema) : [];
    const enumInfo = await (0, utils_1.getEnums)(db);
    const fields = await Promise.all(columns.map(async (col) => {
        const canBeUsedToMatch = operation === 'upsert' ? unique.some((u) => u.attname === col.column_name) : true;
        const type = mapPostgresType(col.data_type);
        const options = type === 'options' ? (0, utils_1.getEnumValues)(enumInfo, col.udt_name) : undefined;
        const hasDefault = Boolean(col.column_default);
        const isGenerated = col.is_generated === 'ALWAYS' ||
            ['ALWAYS', 'BY DEFAULT'].includes(col.identity_generation ?? '');
        const nullable = col.is_nullable === 'YES';
        return {
            id: col.column_name,
            displayName: col.column_name,
            required: !nullable && !hasDefault && !isGenerated,
            defaultMatch: (col.column_name === 'id' && canBeUsedToMatch) || false,
            display: true,
            type,
            canBeUsedToMatch,
            options,
        };
    }));
    return { fields };
}
//# sourceMappingURL=resourceMapping.js.map