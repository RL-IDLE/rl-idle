import Decimal from 'break_infinity.js';
import { useContext } from 'react';
import { BalanceContext } from './BalanceProvider';

export type IBalanceContext =
  | {
      balance: Decimal;
    }
  | undefined;

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
