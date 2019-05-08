import { JSONRule } from './models/json-rule';
export default class JSONEnhancer {
    private schemas;
    private evaluator;
    private pointer;
    private scope;
    constructor();
    setGlobalScope(scope?: any): void;
    setSchema(schemaName: string, rules?: JSONRule[], scope?: any): void;
    deleteSchema(schemaName: string): void;
    addRuleToSchema(schemaName: string, targetQueryString: string, rule: string): void;
    addSchemaToSchema(schemaName: string, targetQueryString: string, innerSchema: string): void;
    setSchemaScope(schemaName: string, scope?: any): void;
    enhance(object: any, schemaName: string): void;
    private getSchema;
    private enhanceSchemas;
    private enhanceSchemaInArrays;
    private enhanceRules;
}
