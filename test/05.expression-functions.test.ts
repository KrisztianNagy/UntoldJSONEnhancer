import { expect } from 'chai';
import JSONEnhancer from '../src';

describe('Expression Functions', () => {
    it('should be able handle pipe', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;

        const scope = { Math: Math };
        const result = expressionEvaluator.evaluate(' 1.4 | Math.floor', { scope: scope });

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(1);
    });

    it('should be able handle function with 0 parameters', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;

        const scope = { Math: Math };
        const result = expressionEvaluator.evaluate('Math.PI', { scope: scope });

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(3.141592653589793);
    });

    it('should be able handle function with 1 parameter', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;

        const scope = { Math: Math };
        const result = expressionEvaluator.evaluate('Math.floor(1.4)', { scope: scope });

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(1);
    });

    it('should be able handle function with 2 parameters', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;

        const scope = { Math: Math };
        const result = expressionEvaluator.evaluate('Math.pow(2, 3)', { scope: scope });

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(8);
    });
});
