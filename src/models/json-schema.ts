import { JSONRule } from './json-rule';
import { EmbededSchema } from './embeded-schema';

export class JSONSchema {
    name: string;
    rules: JSONRule[];
    schemas: EmbededSchema[];
    scope: any;

    constructor() {}
}
