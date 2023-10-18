import { useUserStore } from '@/contexts/user.store';
import { getMoneyFromInvestmentsPerSeconds, getUserBalance } from '@/lib/game';
import Decimal from 'break_infinity.js';
import { useEffect, useState } from 'react';

const refreshInterval = 200;

export default function Balance() {
  const user = useUserStore((state) => state.user);
  const [balance, setBalance] = useState<Decimal>(Decimal.fromString('0'));
  const moneyPerSecond = getMoneyFromInvestmentsPerSeconds(user);

  useEffect(() => {
    const refreshBalance = () => setBalance(getUserBalance(user));
    refreshBalance();
    const interval = setInterval(refreshBalance, refreshInterval);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div>
      <h2>{balance.toString()}</h2>
      <h3>{moneyPerSecond.toString()}</h3>
    </div>
  );
}
