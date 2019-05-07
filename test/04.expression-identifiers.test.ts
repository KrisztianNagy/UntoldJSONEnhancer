import { expect } from 'chai';
import { ExpressionEvaluator } from '../src/expressions/expression-evaluator';

describe('Expression Identifiers', () => {
    it('should be able to resolve member', () => {
        const scope = { engine: { horsepower: 90 } };
        const expressionEvaluator = new ExpressionEvaluator({ scope: scope });
        const result = expressionEvaluator.evaluate('engine.horsepower');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(90);
    });
});
