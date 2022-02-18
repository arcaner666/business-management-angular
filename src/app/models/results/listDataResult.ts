import { Result } from 'src/app/models/results/result';
export interface ListDataResult<T> extends Result {
  data: T[];
}
