import { expect } from 'chai';
import JSONEnhancer from '../src';

describe('Expression Unary Operators', () => {
    it('should understand minus', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('-1');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(-1);
    });

    it('should understand plus', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('+1');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(1);
    });

    it('should understand json pointer single', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('@".item"', { scope: { item: 'bucket' } });

        expect(result.error).to.eq(false);
        expect(result.value).to.eq('bucket');
    });

    it('should understand json pointer multiple', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('@*".item"', { scope: { item: 'bucket' } });

        expect(result.error).to.eq(false);
        expect(result.value[0]).to.eq('bucket');
    });
});
