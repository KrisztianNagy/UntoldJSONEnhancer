import * as jsep from 'jsep';
import { IExpression, IBinaryExpression, IMemberExpression, ICallExpression, IConditionalExpression, IUnaryExpression, IIdentifier } from '../models/jsep';
import { ExpressionResult } from '../models/expression-result';
import { ExpressionOperators } from './expression-operators';
import { PointerEvaluator } from './pointer-evaluator';
import { ExpressionProcessingState } from '../models/expression-processing-state';
import { ExpressionEvaluatorOptions } from '../models/expression-evaluator-options';

export class ExpressionEvaluator {
    private jsep: any;
    private pointerEvaluator: PointerEvaluator;
    private scope: any;

    constructor(expressionEvaluatorOptions?: ExpressionEvaluatorOptions) {
        this.pointerEvaluator = new PointerEvaluator();
        this.jsep = jsep;
        this.jsep.addUnaryOp('@');
        this.jsep.addUnaryOp('@*');

        this.scope = expressionEvaluatorOptions && expressionEvaluatorOptions.scope ? expressionEvaluatorOptions.scope : null;
    }

    evaluate(expression: string | IExpression, expressionEvaluatorOptions?: ExpressionEvaluatorOptions) {
        const parsedExpression =
            typeof expression === 'string'
                ? this.parseTree(expression)
                : {
                      tree: expression,
                      error: false,
                      value: null,
                      errorMessage: ''
                  };

        if (!parsedExpression.error) {
            try {
                const scope = expressionEvaluatorOptions ? expressionEvaluatorOptions.scope : this.scope;
                const expressionResult = this.processNode(<IExpression>parsedExpression.tree, { scope: scope });
                parsedExpression.value = expressionResult;
            } catch (ex) {
                parsedExpression.error = true;
                parsedExpression.errorMessage = ex;
            }
        }
        return parsedExpression;
    }

    parseTree(input: string): ExpressionResult {
        try {
            const tree = this.jsep(input);

            return {
                tree: tree,
                error: false,
                errorMessage: ''
            };
        } catch (ex) {
            return {
                error: true,
                errorMessage: ex.message
            };
        }
    }

    private processNode(node: IExpression, state: ExpressionProcessingState): any {
        switch (node.type) {
            case 'Literal':
                return node.value;
            case 'Identifier':
                return this.resolveIdentifier(<IIdentifier>node, state);
            case 'BinaryExpression':
                return this.resolveBinaryExpression(<IBinaryExpression>node, state);
            case 'UnaryExpression':
                return this.resolveUnaryExpression(<IUnaryExpression>node, state);
            case 'MemberExpression':
                return this.resolveMemberExpression(<IMemberExpression>node, state);
            case 'CallExpression':
                return this.resolveCallExpression(<ICallExpression>node, state);
            case 'ConditionalExpression':
                return this.resolveConditionalExpression(<IConditionalExpression>node, state);
            default:
                throw new Error('Could not resolve: ' + node.type);
        }
    }

    private resolveBinaryExpression(binaryExpression: IBinaryExpression, state: ExpressionProcessingState): any {
        switch (binaryExpression.operator) {
            case '+':
                return ExpressionOperators.basicPlusOperator(this.processNode(binaryExpression.left, state), this.processNode(binaryExpression.right, state));
            case '-':
                return ExpressionOperators.basicMinusOperator(this.processNode(binaryExpression.left, state), this.processNode(binaryExpression.right, state));
            case '*':
                return ExpressionOperators.basicMultipleOperator(
                    this.processNode(binaryExpression.left, state),
                    this.processNode(binaryExpression.right, state)
                );
            case '/':
                return ExpressionOperators.basicDivideOperator(this.processNode(binaryExpression.left, state), this.processNode(binaryExpression.right, state));
            case '%':
                return ExpressionOperators.basicModuloOperator(this.processNode(binaryExpression.left, state), this.processNode(binaryExpression.right, state));
            case '&&':
                return this.processNode(binaryExpression.left, state) && this.processNode(binaryExpression.right, state);
            case '||':
                return this.processNode(binaryExpression.left, state) || this.processNode(binaryExpression.right, state);
            case '==':
                return this.processNode(binaryExpression.left, state) == this.processNode(binaryExpression.right, state);
            case '===':
                return this.processNode(binaryExpression.left, state) === this.processNode(binaryExpression.right, state);
            case '!=':
                return this.processNode(binaryExpression.left, state) !== this.processNode(binaryExpression.right, state);
            case '!==':
                return this.processNode(binaryExpression.left, state) !== this.processNode(binaryExpression.right, state);
            case '>':
                return this.processNode(binaryExpression.left, state) > this.processNode(binaryExpression.right, state);
            case '>=':
                return this.processNode(binaryExpression.left, state) >= this.processNode(binaryExpression.right, state);
            case '<':
                return this.processNode(binaryExpression.left, state) < this.processNode(binaryExpression.right, state);
            case '<=':
                return this.processNode(binaryExpression.left, state) <= this.processNode(binaryExpression.right, state);
            case '|':
                return this.resolvePipeExpression(binaryExpression.right, binaryExpression.left, state);
            default:
                throw new Error('Could not find operator: ' + binaryExpression.operator);
        }
    }

    private resolveUnaryExpression(unaryExpresion: IUnaryExpression, state: ExpressionProcessingState): any {
        const value = this.processNode(unaryExpresion.argument, state);

        switch (unaryExpresion.operator) {
            case '@':
                return this.pointerEvaluator.evaluateSingle(value, state.scope);
            case '@*':
                return this.pointerEvaluator.evaluateMulti(value, state.scope);
            case '+':
                return value;
            case '-':
                return -value;
            default:
                throw new Error('Could not find operator: ' + unaryExpresion.operator);
        }
    }

    private resolveConditionalExpression(conditionaExpression: IConditionalExpression, state: ExpressionProcessingState): any {
        return this.processNode(conditionaExpression.test, state) ? conditionaExpression.consequent : conditionaExpression.alternate;
    }

    private resolveIdentifier(identifier: IIdentifier, state: ExpressionProcessingState) {
        const started = !state.startedQueryConcatenation;

        if (started) {
            const parsed = this.pointerEvaluator.evaluateSingle('.' + identifier.name, state.scope);
            return parsed;
        }

        return identifier.name;
    }

    private resolveMemberExpression(memberExpression: IMemberExpression, state: ExpressionProcessingState) {
        const started = !state.startedQueryConcatenation;

        const nextState: ExpressionProcessingState = JSON.parse(JSON.stringify(state));
        nextState.startedQueryConcatenation = true;

        const query = this.processNode(memberExpression.object, nextState) + '["' + this.processNode(memberExpression.property, nextState) + '"]';

        if (started) {
            const parsed = this.pointerEvaluator.evaluateSingle('.' + query, state.scope);
            return parsed;
        }

        return query;
    }

    private resolveCallExpression(callExpression: ICallExpression, state: ExpressionProcessingState) {
        const functionObject = this.processNode(callExpression.callee, state);

        if (functionObject && functionObject instanceof Function) {
            const parsedArguments: any[] = [];

            if (callExpression.arguments && callExpression.arguments.length) {
                callExpression.arguments.forEach(arg => {
                    parsedArguments.push(this.processNode(arg, state));
                });
            }

            return functionObject(...parsedArguments);
        } else {
            throw new Error(functionObject + ' is not a function');
        }
    }

    private resolvePipeExpression(functionIdentifier: IExpression, argument: IExpression, state: ExpressionProcessingState) {
        const functionObject = this.processNode(functionIdentifier, state);

        if (functionObject && functionObject instanceof Function) {
            const argumentObject = this.processNode(argument, state);
            return functionObject(argumentObject);
        } else {
            throw new Error(functionObject + ' is not a function');
        }
    }
}
