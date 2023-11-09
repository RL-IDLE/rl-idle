import Decimal from 'break_infinity.js';
import { useEffect, useState } from 'react';
import { useUserStore } from '../user.store';
import { getUserBalance } from '@/lib/game';
import { refreshInterval } from '@/lib/constant';
import { BalanceContext } from './BalanceContext';
import { maxPassiveIncomeInterval } from '../../../../backend/src/lib/constant';

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);

  const [balance, setBalance] = useState<Decimal>(new Decimal(0));
  const [difference, setDifference] = useState<Decimal | null>(
    Decimal.fromString('0'),
  );

  useEffect(() => {
    let lastTimeSaved = Date.now();
    const refreshBalance = () => {
      const newBalance = getUserBalance(user);
      setBalance(newBalance);
      //? Save balance to local storage every 5 seconds
      if (Date.now() - lastTimeSaved > 5000) {
        localStorage.setItem('lastBalance', newBalance.toString());
        localStorage.setItem('lastBalanceTime', Date.now().toString());
        localStorage.setItem(
          'maxPassiveIncomeInterval',
          maxPassiveIncomeInterval.toString(),
        );
        if (
          'serviceWorker' in navigator &&
          navigator.serviceWorker.controller
        ) {
          navigator.serviceWorker.controller.postMessage({
            kind: 'save',
            lastBalance: newBalance.toString(),
            lastBalanceTime: Date.now().toString(),
            maxPassiveIncomeInterval: maxPassiveIncomeInterval.toString(),
          });
        }
        lastTimeSaved = Date.now();
      }
    };
    refreshBalance();
    const interval = setInterval(refreshBalance, refreshInterval);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <BalanceContext.Provider
      value={{
        balance,
        difference,
        setDifference,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
}
