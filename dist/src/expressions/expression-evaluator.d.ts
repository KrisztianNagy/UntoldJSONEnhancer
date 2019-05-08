import { IExpression } from '../models/jsep';
import { ExpressionResult } from '../models/expression-result';
import { ExpressionEvaluatorOptions } from '../models/expression-evaluator-options';
export declare class ExpressionEvaluator {
    private jsep;
    private pointerEvaluator;
    private scope;
    constructor(expressionEvaluatorOptions?: ExpressionEvaluatorOptions);
    evaluate(expression: string | IExpression, expressionEvaluatorOptions?: ExpressionEvaluatorOptions): ExpressionResult;
    parseTree(input: string): ExpressionResult;
    private processNode;
    private resolveBinaryExpression;
    private resolveUnaryExpression;
    private resolveConditionalExpression;
    private resolveIdentifier;
    private resolveMemberExpression;
    private resolveCallExpression;
    private resolvePipeExpression;
}
