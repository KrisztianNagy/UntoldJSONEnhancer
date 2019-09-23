import { expect } from 'chai';
import JSONEnhancer from '../src';
import character from './data/character';

describe('Enhancer Template', () => {
    let characterCopy: any;

    beforeEach(() => {
        characterCopy = JSON.parse(JSON.stringify(character));
    });

    it('should be able to update properties', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '"stick"');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('stick');
    });

    it('should be able to create properties', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.age', '"1 year"');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.age).to.eq('1 year');
    });

    it('should be able to use the item', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '$current.name + "2"');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('Conan2');
    });

    it('should be able to use the target', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', 'target + "2"');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('sword2');
    });

    it('should be able to use the target for multi', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.items|name', 'target + "2"');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.items[0].name).to.eq('flask2');
        expect(characterCopy.items[1].name).to.eq('meat2');
    });

    it('should be able to use the parent', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '$parent.value.price');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq(1);
    });

    it('should be able to use the parent of parent', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '$parent.$parent.value.name');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('Conan');
    });
});
