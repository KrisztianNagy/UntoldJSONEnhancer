import { expect } from 'chai';
import JSONEnhancer from '../src';

describe('Expression Combined Binary Operators', () => {
    it('should be able to combine plus and mins', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('5 + 6 - 7');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(4);
    });

    it('should be able to know + and * precendence', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('5 + 3 * 2 + 1');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(12);
    });

    it('should be able to know + - () precendence', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('6 - (2 + 3)');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(1);
    });
});
