import { useUserStore } from '@/contexts/user.store';
import { getMoneyFromInvestmentsPerSeconds, getUserBalance } from '@/lib/game';
import Decimal from 'break_infinity.js';
import { useEffect, useState } from 'react';
import styles from './balance.module.scss';
import { decimalToHumanReadable } from '@/lib/bignumber';

const refreshInterval = 200;

export default function Balance() {
  const user = useUserStore((state) => state.user);
  const [balance, setBalance] = useState<Decimal>(getUserBalance(user));
  const moneyPerSecond = getMoneyFromInvestmentsPerSeconds(user);
  console.log(balance);

  useEffect(() => {
    const refreshBalance = () => setBalance(getUserBalance(user));
    refreshBalance();
    const interval = setInterval(refreshBalance, refreshInterval);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className={styles.balance}>
      <h2>{decimalToHumanReadable(balance)}</h2>
      <h3>{decimalToHumanReadable(moneyPerSecond)}</h3>
    </div>
  );
}
