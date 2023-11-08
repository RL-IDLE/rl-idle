import Decimal from 'break_infinity.js';
import { createContext } from 'react';

export type IBalanceContext =
  | {
      balance: Decimal;
      difference: Decimal | null;
      setDifference: (difference: Decimal | null) => void;
    }
  | undefined;

export const BalanceContext = createContext<IBalanceContext>(undefined);
