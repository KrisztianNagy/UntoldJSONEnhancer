import { QueryResult } from 'untold-json-pointer/dist/src/models/query-result';

export class EmbededSchema {
    targetQueryString: string;
    targetQuery: QueryResult;
    schemaName: string;
}
