import { useUserStore } from '@/contexts/user.store';
import { getMoneyFromInvestmentsPerSeconds, getUserBalance } from '@/lib/game';
import Decimal from 'break_infinity.js';
import { useEffect, useState } from 'react';
import styles from './balance.module.scss';
import { decimalToHumanReadable } from '@/lib/bignumber';
import CreditLogo from '@/assets/credits_icon.webp';

const refreshInterval = 200;

export default function Balance() {
  const user = useUserStore((state) => state.user);
  const [balance, setBalance] = useState<Decimal>(getUserBalance(user));
  const moneyPerSecond = getMoneyFromInvestmentsPerSeconds(user);

  useEffect(() => {
    const refreshBalance = () => setBalance(getUserBalance(user));
    refreshBalance();
    const interval = setInterval(refreshBalance, refreshInterval);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div
      className={
        styles.balance +
        ' absolute top-0 left-0 z-50 mt-5 ml-5 p-3 flex items-center justify-center rounded-xl flex-wrap'
      }
    >
      <h2 className="text-center relative w-fit text-white flex flex-col">
        {decimalToHumanReadable(balance)}
        <span>+{decimalToHumanReadable(moneyPerSecond)} /s</span>
      </h2>
      <img width="45" height="45" src={CreditLogo} alt="" />
    </div>
  );
}
