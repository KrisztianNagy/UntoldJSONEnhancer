import JSONPointer from 'untold-json-pointer';
import { JSONSchema } from './models/json-schema';
import { ExpressionEvaluator } from './expressions/expression-evaluator';
import { JSONRule } from './models/json-rule';

export default class JSONEnhancer {
    private schemas: JSONSchema[];
    public evaluator: ExpressionEvaluator;
    private pointer: JSONPointer;
    private scope: any;

    constructor() {
        this.evaluator = new ExpressionEvaluator();
        this.pointer = new JSONPointer();
        this.schemas = [];
    }

    setGlobalScope(scope: any = {}) {
        this.scope = scope;
    }

    setSchema(schemaName: string, rules: JSONRule[] = [], scope: any = {}) {
        const found = this.schemas.filter(schema => schema.name === schemaName);

        if (!found.length) {
            this.schemas.push({
                name: schemaName,
                rules: rules,
                scope: scope,
                schemas: []
            });
        } else {
            found[0].rules = rules;
        }
    }

    deleteSchema(schemaName: string) {
        this.schemas = this.schemas.filter(schema => schema.name !== schemaName);
    }

    addRuleToSchema(schemaName: string, targetQueryString: string, rule: string) {
        const targetSchema = this.getSchema(schemaName);

        if (!targetSchema) {
            return;
        }

        const targetQuery = this.pointer.createQuery(targetQueryString);
        const ruleExpression = this.evaluator.parseTree(rule);

        targetSchema.rules.push({
            targetQueryString: targetQueryString,
            targetQuery: targetQuery,
            ruleExpression: ruleExpression.tree
        });
    }

    addSchemaToSchema(schemaName: string, targetQueryString: string, innerSchema: string) {
        const targetSchema = this.getSchema(schemaName);

        if (!targetSchema) {
            return;
        }

        const targetQuery = this.pointer.createQuery(targetQueryString);

        targetSchema.schemas.push({
            targetQueryString: targetQueryString,
            targetQuery: targetQuery,
            schemaName: innerSchema
        });
    }

    setSchemaScope(schemaName: string, scope: any = {}) {
        const targetSchema = this.getSchema(schemaName);

        if (!targetSchema) {
            return;
        }

        targetSchema.scope = scope;
    }

    enhance(object: any, schemaName: string) {
        const targetSchema = this.getSchema(schemaName);

        if (!targetSchema) {
            return;
        }

        this.enhanceSchemas(object, targetSchema);
        this.enhanceRules(object, targetSchema);
    }

    private getSchema(schemaName: string) {
        const schemas = this.schemas.filter(schema => schema.name === schemaName);

        if (schemas.length) {
            return schemas[0];
        }

        return null;
    }

    private enhanceSchemas(object: any, targetSchema: JSONSchema) {
        targetSchema.schemas.forEach(innerSchema => {
            const schemaObject = this.getSchema(innerSchema.schemaName);

            if (!schemaObject) {
                return;
            }

            const schemaTarget = this.pointer.executeQuery(object, innerSchema.targetQuery);

            if (!schemaTarget.error) {
                schemaTarget.getAll().forEach((target, index) => {
                    this.enhanceSchemaInArrays(target, innerSchema.schemaName);
                });
            }
        });
    }

    private enhanceSchemaInArrays(target: any, schemaName: string) {
        if (Array.isArray(target)) {
            target.forEach(targetElement => {
                this.enhanceSchemaInArrays(targetElement, schemaName);
            });
        } else {
            this.enhance(target, schemaName);
        }
    }

    private enhanceRules(object: any, targetSchema: JSONSchema) {
        const currentScope: any = {
            $current: object
        };

        targetSchema.rules.forEach(rule => {
            if (rule.ruleExpression) {
                const ruleTarget = this.pointer.executeQuery(object, rule.targetQuery);

                if (!ruleTarget.error) {
                    ruleTarget.getAll().forEach((target, index) => {
                        const parentHierarchy = ruleTarget.parentsAt(index);

                        const targetScope: any = { target: target };
                        let parent = targetScope;

                        parentHierarchy.forEach(item => {
                            parent.$parent = {
                                value: item
                            };

                            parent = parent.$parent;
                        });

                        const scope = { ...this.scope, ...targetSchema.scope, ...currentScope, ...targetScope };

                        const ruleValue = this.evaluator.evaluate(<any>rule.ruleExpression, { scope: scope });

                        if (!ruleValue.error) {
                            ruleTarget.setAt(ruleValue.value, index);
                        }
                    });
                }
            }
        });
    }
}
