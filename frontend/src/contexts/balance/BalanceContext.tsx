import Decimal from 'break_infinity.js';
import { createContext } from 'react';

export type IBalanceContext =
  | {
      balance: Decimal;
    }
  | undefined;

export const BalanceContext = createContext<IBalanceContext>(undefined);
