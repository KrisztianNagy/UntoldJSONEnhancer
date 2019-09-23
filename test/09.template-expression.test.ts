import { expect } from 'chai';
import JSONEnhancer from '../src';
import character from './data/character';

describe('Checking template expressions', () => {
    let characterCopy: any;

    beforeEach(() => {
        characterCopy = JSON.parse(JSON.stringify(character));
    });

    it('shouldbe able to read simple values', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '@".$current.name" + "2"');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('Conan2');
    });

    it('shouldbe able to read simple arrays with single read', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '@".$current.items|name"');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('flask');
    });

    it('shouldbe able to read simple arrays with multi read', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '@*".$current.items|name"[1]');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('meat');
    });

    it('shouldbe able to read simple arrays with condition', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '@".$current.items{.name === \'diamond\'}|name"');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('diamond');
    });

    it('shouldbe able to read simple arrays with condition 2', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '@(".$current.items{.name === \'" + "diamond" +"\' }|name")');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('diamond');
    });

    it('shouldbe able to read simple arrays with condition 2', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.addRuleToSchema('Character', '.weapon.name', '@(".$current.items{.name === \'" + @(".$current.items{.weight === 1}|name") +"\' }|name")');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.weapon.name).to.eq('meat');
    });
});
