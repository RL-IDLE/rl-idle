import Decimal from 'break_infinity.js';
import { createContext, useEffect, useState } from 'react';
import { useUserStore } from './user.store';
import { getUserBalance } from '@/lib/game';
import { refreshInterval } from '@/lib/constant';
import { IBalanceContext } from './BalanceContext';

export const BalanceContext = createContext<IBalanceContext>(undefined);

export function BalanceProvider({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);

  const [balance, setBalance] = useState<Decimal>(new Decimal(0));

  useEffect(() => {
    let lastTimeSaved = Date.now();
    const refreshBalance = () => {
      const newBalance = getUserBalance(user);
      setBalance(newBalance);
      //? Save balance to local storage every 5 seconds
      if (Date.now() - lastTimeSaved > 5000) {
        localStorage.setItem('lastBalance', newBalance.toString());
        localStorage.setItem('lastBalanceTime', Date.now().toString());
        lastTimeSaved = Date.now();
      }
    };
    refreshBalance();
    const interval = setInterval(refreshBalance, refreshInterval);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <BalanceContext.Provider value={{ balance }}>
      {children}
    </BalanceContext.Provider>
  );
}
