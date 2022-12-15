import { Errors } from "utils/Errors";

type TTransaction = {
  hash: string;
  age: string;
  from: string;
  to: string;
  value: number;
};
export interface ITransactions {
  transactions?: TTransaction[];
  error?: Errors;
}
