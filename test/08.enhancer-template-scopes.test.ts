import { expect } from 'chai';
import JSONEnhancer from '../src';
import character from './data/character';

describe('Enhancer Template Scopes', () => {
    let characterCopy: any;

    beforeEach(() => {
        characterCopy = JSON.parse(JSON.stringify(character));
    });

    it('should be able to add global scopes', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.setGlobalScope({ title: 'Default' });

        enhancer.addRuleToSchema('Character', '.name', 'title');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.name).to.eq('Default');
    });

    it('should be able to add schema scopes', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.setSchemaScope('Character', { title: 'Schema' });

        enhancer.addRuleToSchema('Character', '.name', 'title');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.name).to.eq('Schema');
    });

    it('should be able to use both global and schema scopes', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.setGlobalScope({ title: 'Default' });
        enhancer.setSchemaScope('Character', { title2: 'Schema' });

        enhancer.addRuleToSchema('Character', '.name', 'title + " " + title2');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.name).to.eq('Default Schema');
    });

    it('should schema overwrite global', () => {
        const enhancer = new JSONEnhancer();
        enhancer.setSchema('Character');
        enhancer.setGlobalScope({ title: 'Default' });
        enhancer.setSchemaScope('Character', { title: 'Schema' });

        enhancer.addRuleToSchema('Character', '.name', 'title');

        enhancer.enhance(characterCopy, 'Character');

        expect(characterCopy.name).to.eq('Schema');
    });
});
