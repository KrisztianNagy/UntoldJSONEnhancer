import { expect } from 'chai';
import JSONEnhancer from '../src';

describe('Expression Binary Operators', () => {
    it('should parse number addition', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;

        const result = expressionEvaluator.evaluate('1 + 2');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(3);
    });

    it('should parse number substraction', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('1 - 2');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(-1);
    });

    it('should parse multiplication', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('1 * 2');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(2);
    });

    it('should parse division', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('1 / 2');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(0.5);
    });

    it('should parse modulo', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('1 % 2');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(1);
    });

    it('should parse string concatenation', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const result = expressionEvaluator.evaluate('"con" + "catenate"');

        expect(result.error).to.eq(false);
        expect(result.value).to.eq('concatenate');
    });
});
