import { Result } from "src/app/models/results/result";
export interface SingleDataResult<T> extends Result{
    data: T;
}