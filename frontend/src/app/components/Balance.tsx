import { useUserStore } from '@/contexts/user.store';
import { getMoneyFromInvestmentsPerSeconds } from '@/lib/game';
import styles from './balance.module.scss';
import { decimalToHumanReadable } from '@/lib/bignumber';
import CreditLogo from '@/assets/credits_icon.webp';
import { useBalance } from '@/contexts/balance/BalanceUtils';

export default function Balance() {
  const user = useUserStore((state) => state.user);
  const { balance } = useBalance();

  const moneyPerSecond = getMoneyFromInvestmentsPerSeconds(user);

  return (
    <div
      className={
        styles.balance +
        ' absolute top-0 left-0 z-50 mt-5 ml-5 p-3 flex items-center justify-center rounded-xl flex-wrap'
      }
    >
      <h2 className="text-center relative w-fit text-white flex flex-col">
        {decimalToHumanReadable(balance, balance.lt('1000') ? true : false)}
        <span>+{decimalToHumanReadable(moneyPerSecond)} /s</span>
      </h2>
      <img width="45" height="45" src={CreditLogo} alt="credit" />
    </div>
  );
}
