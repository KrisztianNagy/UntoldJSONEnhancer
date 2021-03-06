import { QueryResult } from 'untold-json-pointer/dist/src/models/query-result';
import { Expression } from 'jsep';

export class SchemaRule {
    targetQueryString: string;
    targetQuery: QueryResult;
    calculation: Expression;
}
