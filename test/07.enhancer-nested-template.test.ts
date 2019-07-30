import { expect } from 'chai';
import JSONEnhancer from '../src';
import character from './data/character';

describe('Enhancer Nested templates', () => {
    let characterCopy: any;

    beforeEach(() => {
        characterCopy = JSON.parse(JSON.stringify(character));
    });

    it('should be able to use nested templates', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.setSchema('Item');
        enhancer.addRuleToSchema('Item', '.sumWeight', 'parent.value.weight * parent.value.quantity');

        enhancer.addSchemaToSchema('Character', '.items', 'Item');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.items[0].sumWeight).to.eq(1);
        expect(characterCopy.items[1].sumWeight).to.eq(3);
        expect(characterCopy.items[2].sumWeight).to.eq(2);
        expect(characterCopy.items[3].sumWeight).to.eq(0.5);
    });

    it('should be able to use nested templates with space in property name', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.setSchema('Ability');
        enhancer.addRuleToSchema('Ability', '.Score', "parent.value['Base Score'] + parent.value['Permanent Bonus'] + parent.value['Temporary Bonus']");
        enhancer.addRuleToSchema('Ability', '."Permanent Score"', '1 + 1');

        enhancer.addSchemaToSchema('Character', '.strength', 'Ability');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.strength.Score).to.eq(42);
        expect(characterCopy.strength['Permanent Score']).to.eq(2);
    });
});
