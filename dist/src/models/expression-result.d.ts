import { IExpression } from './jsep';
export declare class ExpressionResult {
    tree?: IExpression;
    value?: any;
    error: boolean;
    errorMessage: string;
}
