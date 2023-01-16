import { User } from "next-auth";
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

export interface IWithdraw {
  btcPrice: number;
  xprPrice: number;
}
