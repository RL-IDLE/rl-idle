import { useUserStore } from '@/contexts/user.store';
import { getMoneyFromInvestmentsPerSeconds, getUserBalance } from '@/lib/game';
import Decimal from 'break_infinity.js';
import { useEffect, useState } from 'react';
import styles from './balance.module.scss';
import { decimalToHumanReadable } from '@/lib/bignumber';
import CreditLogo from '@/assets/credits_icon.webp';
import { refreshInterval } from '@/lib/constant';

export default function Balance() {
  const user = useUserStore((state) => state.user);
  const [balance, setBalance] = useState<Decimal>(new Decimal(0));
  const moneyPerSecond = getMoneyFromInvestmentsPerSeconds(user);

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
    <div
      className={
        styles.balance +
        ' absolute top-0 left-0 z-50 mt-5 ml-5 p-3 flex items-center justify-center rounded-xl flex-wrap'
      }
    >
      <h2 className="text-center relative w-fit text-white flex flex-col">
        {decimalToHumanReadable(balance, true)}
        <span>+{decimalToHumanReadable(moneyPerSecond)} /s</span>
      </h2>
      <img width="45" height="45" src={CreditLogo} alt="credit" />
    </div>
  );
}
