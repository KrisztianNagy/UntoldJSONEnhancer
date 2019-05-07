import { expect } from 'chai';
import { ExpressionEvaluator } from '../src/expressions/expression-evaluator';

describe('Expression Functions', () => {
    it('should be able handle pipe', () => {
        const scope = { Math: Math };
        const expressionEvaluator = new ExpressionEvaluator({ scope: scope });
        const result = expressionEvaluator.evaluate(' 1.4 | Math.floor');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(1);
    });

    it('should be able handle function with 0 parameters', () => {
        const scope = { Math: Math };
        const expressionEvaluator = new ExpressionEvaluator({ scope: scope });
        const result = expressionEvaluator.evaluate('Math.PI');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(3.141592653589793);
    });

    it('should be able handle function with 1 parameter', () => {
        const scope = { Math: Math };
        const expressionEvaluator = new ExpressionEvaluator({ scope: scope });
        const result = expressionEvaluator.evaluate('Math.floor(1.4)');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(1);
    });

    it('should be able handle function with 2 parameters', () => {
        const scope = { Math: Math };
        const expressionEvaluator = new ExpressionEvaluator({ scope: scope });
        const result = expressionEvaluator.evaluate('Math.pow(2, 3)');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(8);
    });
});
