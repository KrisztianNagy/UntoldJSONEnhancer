import { IExpression } from './jsep';

export class ExpressionResult {
    tree?: IExpression;
    value?: any;
    error: boolean;
    errorMessage: string;
}
