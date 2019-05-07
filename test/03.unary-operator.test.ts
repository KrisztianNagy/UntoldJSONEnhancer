import { expect } from 'chai';
import JSONEnhancer from '../src';
import { ExpressionEvaluator } from '../src/expressions/expression-evaluator';

describe('Expression Unary Operators', () => {
    it('should understand minus', () => {
        const expressionEvaluator = new ExpressionEvaluator();
        const result = expressionEvaluator.evaluate('-1');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(-1);
    });

    it('should understand plus', () => {
        const expressionEvaluator = new ExpressionEvaluator();
        const result = expressionEvaluator.evaluate('+1');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(1);
    });

    it('should understand json pointer single', () => {
        const expressionEvaluator = new ExpressionEvaluator({ scope: { item: 'bucket' } });
        const result = expressionEvaluator.evaluate('@".item"');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq('bucket');
    });

    it('should understand json pointer multiple', () => {
        const expressionEvaluator = new ExpressionEvaluator({ scope: { item: 'bucket' } });
        const result = expressionEvaluator.evaluate('@*".item"');

        expect(result.error).to.eq(false);
        expect(result.value[0]).to.eq('bucket');
    });
});
