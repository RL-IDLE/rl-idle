import { useUserStore } from '@/contexts/user.store';
import { decimalToHumanReadable } from '@/lib/bignumber';
import { getUserBalance } from '@/lib/game';
import { cn, getTimeBetween } from '@/lib/utils';
import Decimal from 'break_infinity.js';
import { useEffect, useState } from 'react';
import CreditLogo from '@/assets/credits_icon.webp';
import {
  maxPassiveIncomeInterval,
  passiveIncomeMultiplier,
} from '../../../../backend/src/lib/constant';
import Button from './ui/Button';
import { useBalance } from '@/contexts/balance/BalanceUtils';
import { popupMinOfflineTime } from '@/lib/constant';

export default function PassivePopup() {
  const user = useUserStore((state) => state.user);
  const [inactiveTimeNow, setInactiveTimeNow] = useState<Date | null>(null);
  const [inactiveTime, setInactiveTime] = useState<Date | null>(null);
  const [showPopup, setShowPopup] = useState<false | Decimal>(false);
  const [alreadyShown, setAlreadyShown] = useState(false);
  const { setDifference } = useBalance();

  useEffect(() => {
    const lastBalanceTime = localStorage.getItem('lastBalanceTime');
    const now = Date.now();

    const realInactiveTime = new Date(parseInt(lastBalanceTime || '0'));
    if (realInactiveTime.getTime() + maxPassiveIncomeInterval < now) {
      setInactiveTime(new Date(now - maxPassiveIncomeInterval));
      setInactiveTimeNow(new Date());
    } else {
      setInactiveTime(realInactiveTime);
      setInactiveTimeNow(new Date());
    }
  }, []);

  useEffect(() => {
    if (!user || alreadyShown || !inactiveTime || !inactiveTimeNow) return;

    const lastBalance = localStorage.getItem('lastBalance');

    //? If the user has been offline for more than 1 minute, show a popup
    if (
      inactiveTimeNow.getTime() - inactiveTime.getTime() >
        popupMinOfflineTime &&
      // inactiveTimeNow.getTime() - inactiveTime.getTime() > 0 &&
      lastBalance
    ) {
      const oldBalance = getUserBalance(user, inactiveTime);
      const newBalance = getUserBalance(user);
      const difference = newBalance
        .minus(oldBalance)
        .mul(passiveIncomeMultiplier);
      if (difference.greaterThan(0)) {
        setDifference(difference);
        setShowPopup(difference);
      }
      setAlreadyShown(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, alreadyShown, inactiveTimeNow, inactiveTime]);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 z-50 w-full h-full bg-black/80 flex items-center justify-center',
        showPopup ? 'visible' : 'invisible',
      )}
      onClick={() => {
        setShowPopup(false);
        setDifference(null);
      }}
    >
      {typeof showPopup === 'object' && (
        <div className="rounded-xl px-4 py-3 flex flex-col rounded-t-2xl overflow-hidden border-2 border-background bg-gradient-to-t from-gradient-dark to-gradient-light text-white gap-4 w-10/12 max-w-[400px]">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <h2 className="text-xl">Passive income</h2>
              <p className="text-sm text-white/75">
                inactive for{' '}
                {inactiveTime &&
                  inactiveTimeNow &&
                  getTimeBetween(inactiveTimeNow, inactiveTime, {
                    markAsNowSince: 0,
                  })}
              </p>
            </div>
            <h3 className="text-2xl text-center flex flex-row gap-2 self-center">
              + {decimalToHumanReadable(showPopup)}
              <img
                width="30"
                height="30"
                src={CreditLogo}
                alt="credit"
                className="object-contain"
              />
            </h3>
          </div>
          <Button
            onClick={() => {
              setShowPopup(false);
              setDifference(null);
            }}
          >
            Claim
          </Button>
        </div>
      )}
    </div>
  );
}
