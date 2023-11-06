import { useUserStore } from '@/contexts/user.store';
import { decimalToHumanReadable } from '@/lib/bignumber';
import { getUserBalance } from '@/lib/game';
import { cn, getTimeBetween } from '@/lib/utils';
import Decimal from 'break_infinity.js';
import { useEffect, useState } from 'react';
import CreditLogo from '@/assets/credits_icon.webp';
import { popupMinOfflineTime } from '@/lib/constant';
import { maxPassiveIncomeInterval } from '../../../../backend/src/lib/constant';
import Button from './ui/Button';

export default function PassivePopup() {
  const user = useUserStore((state) => state.user);
  const [inactiveTime, setInactiveTime] = useState<Date | null>(null);
  const [showPopup, setShowPopup] = useState<false | Decimal>(false);
  const [alreadyShown, setAlreadyShown] = useState(false);

  useEffect(() => {
    if (!user || alreadyShown) return;

    const lastBalance = localStorage.getItem('lastBalance');
    const lastBalanceTime = localStorage.getItem('lastBalanceTime');
    const now = Date.now();

    //? If the user has been offline for more than 1 minute, show a popup
    if (
      now - parseInt(lastBalanceTime || '0') > popupMinOfflineTime &&
      lastBalance
    ) {
      const realInactiveTime = new Date(parseInt(lastBalanceTime || '0'));
      if (realInactiveTime.getTime() + maxPassiveIncomeInterval < now) {
        setInactiveTime(new Date(now - maxPassiveIncomeInterval));
      } else {
        setInactiveTime(realInactiveTime);
      }
      const lastBalanceDecimal = new Decimal(lastBalance);
      const newBalance = getUserBalance(user);
      const difference = newBalance.minus(lastBalanceDecimal);
      if (difference.greaterThan(0)) {
        setShowPopup(difference);
      }
      setAlreadyShown(true);
    }
  }, [user, alreadyShown]);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center',
        showPopup ? 'visible' : 'invisible',
      )}
      onClick={() => setShowPopup(false)}
    >
      {typeof showPopup === 'object' && (
        <div className="rounded-xl p-5 flex flex-col items-center rounded-t-2xl overflow-hidden border-2 border-[#245184] bg-gradient-to-t from-gradient-dark to-gradient-light text-white">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl text-center flex flex-row gap-2">
              + {decimalToHumanReadable(showPopup)}
              <img
                width="20"
                height="20"
                src={CreditLogo}
                alt="credit"
                className="object-contain"
              />
            </h2>
            <p className="text-sm text-white/75">
              {inactiveTime &&
                getTimeBetween(new Date(), inactiveTime, {
                  markAsNowSince: 0,
                })}
            </p>
          </div>
          <Button onClick={() => setShowPopup(false)}>Claim</Button>
        </div>
      )}
    </div>
  );
}
