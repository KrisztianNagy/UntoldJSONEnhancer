import { expect } from 'chai';
import JSONEnhancer from '../src';

describe('Expression Identifiers', () => {
    it('should be able to resolve member', () => {
        const enhancer = new JSONEnhancer();
        const expressionEvaluator = enhancer.evaluator;
        const scope = { engine: { horsepower: 90 } };
        const result = expressionEvaluator.evaluate('engine.horsepower', { scope: scope });

        expect(result.error).to.eq(false);
        expect(result.value).to.eq(90);
    });
});
