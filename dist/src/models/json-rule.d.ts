import { QueryResult } from 'untold-json-pointer/dist/src/models/query-result';
import { IExpression } from './jsep';
export declare class JSONRule {
    targetQueryString: string;
    targetQuery: QueryResult;
    ruleExpression: IExpression | undefined;
}
