import { useGameStore } from '@/contexts/game.store';
import { useItemsStore } from '@/contexts/items.store';
import { useUserStore } from '@/contexts/user.store';
import {
  getMoneyFromInvestmentsPerSeconds,
  getPriceForClickItem,
  getPriceOfItem,
} from '@/lib/game';
import { cn } from '@/lib/utils';
import Decimal from 'break_infinity.js';
import { logger } from '@/lib/logger';
import { decimalToHumanReadable } from '@/lib/bignumber';
import styles from './shop.module.scss';
import clickSound from '@/assets/audio/buy-item.wav';
import { useBalance } from '@/contexts/balance/BalanceUtils';
import { useEffect, useState } from 'react';
import CreditLogo from '@/assets/credits_icon.webp';
import memoizeOne from 'memoize-one';
import { IPrestigeBought } from '@/types/prestige';

const memoizedPresitgesSorted = memoizeOne((prestiges: IPrestigeBought[]) => {
  return prestiges.sort((a, b) =>
    b.prestige.moneyMult.cmp(a.prestige.moneyMult),
  );
});

export default function Shop() {
  const buyItem = useGameStore((state) => state.actions.buyItem);
  const itemsBought = useUserStore((state) => state.user?.itemsBought);
  const prestigesBought = useUserStore((state) => state.user?.prestigesBought);
  const { balance } = useBalance();
  const items = useItemsStore((state) => state.items);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const moneyPerSecond = getMoneyFromInvestmentsPerSeconds(
    useUserStore((state) => state.user),
  );

  const itemsLevels: {
    [id: string]: Decimal | undefined;
  } =
    itemsBought?.reduce<{
      [id: string]: Decimal;
    }>(
      (prev, cur) => {
        if (prev[cur.item.id] as Decimal | undefined) {
          prev[cur.item.id] = prev[cur.item.id].add(Decimal.fromString('1'));
        } else {
          prev[cur.item.id] = Decimal.fromString('1');
        }
        return prev;
      },
      {} as {
        [id: string]: Decimal;
      },
    ) ?? {};

  const itemEarnPerSecond: {
    [id: string]: Decimal | undefined;
  } =
    itemsBought?.reduce<{
      [id: string]: Decimal;
    }>(
      (prev, cur) => {
        if (prev[cur.item.id] as Decimal | undefined) {
          prev[cur.item.id] = prev[cur.item.id].add(cur.item.moneyPerSecond);
        } else {
          prev[cur.item.id] = cur.item.moneyPerSecond;
        }
        return prev;
      },
      {} as {
        [id: string]: Decimal;
      },
    ) ?? {};

  const itemsWithPrice = items.map((item) => ({
    ...item,
    price:
      item.name === 'Click'
        ? getPriceForClickItem(
            item.price,
            itemsLevels[item.id] || Decimal.fromString('0'),
          )
        : getPriceOfItem(
            item.price,
            itemsLevels[item.id] || Decimal.fromString('0'),
          ),
    level: itemsLevels[item.id] || Decimal.fromString('0'),
    ernPerSecond: itemEarnPerSecond[item.id] || Decimal.fromString('0'),
    percentageInBalance: itemEarnPerSecond[item.id]
      ? (itemEarnPerSecond[item.id] as Decimal).div(moneyPerSecond).times(100)
      : Decimal.fromString('0'),
  }));

  const prestigesSorted = memoizedPresitgesSorted(
    prestigesBought ? [...prestigesBought] : [],
  );
  const latestPrestigeMult: Decimal =
    prestigesSorted.length > 0
      ? prestigesSorted[0].prestige.moneyMult
      : Decimal.fromString('1');

  useEffect(() => {
    const newAudio = new Audio(clickSound);
    setAudio(newAudio);
    return () => {
      newAudio.remove();
    };
  }, []);

  const handleBuy = (id: string) => {
    buyItem(id);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  return (
    <section className={styles.shop + ' flex flex-col mt-32 rounded-xl pt-5'}>
      <ul className="flex flex-col gap-2 overflow-auto touch-pan-y items-center rounded-xl pt-3 pb-3">
        {itemsWithPrice.map((item) => (
          <li
            key={item.id}
            className={cn(
              'flex flex-row gap-2 border p-2 cursor-pointer relative transition-all active:scale-[0.98]',
              {
                'opacity-[.65]': item.price.gt(balance),
                'pointer-events-none': item.price.gt(balance),
              },
            )}
            onClick={() => {
              if (item.price.gt(balance)) {
                logger.debug('Not enough money to buy item');
                return;
              }
              handleBuy(item.id);
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="max-w-[6rem] h-full object-contain"
            />
            <div className="flex flex-col gap-2">
              {/* NAME */}
              <p className="text-white">{item.name}</p>

              {/* PRICE */}
              <p className="price text-white flex flex-row gap-1 text-lg">
                <img
                  width="20"
                  height="20"
                  src={CreditLogo}
                  alt="credit"
                  className="object-contain"
                />
                {decimalToHumanReadable(item.price)}
              </p>

              {/* Money per Click */}
              <p className="text-white text-xs">
                {item.moneyPerSecond.eq(0)
                  ? `x${item.moneyPerClickMult.toString()} per click`
                  : `+${decimalToHumanReadable(
                      item.moneyPerSecond.mul(latestPrestigeMult),
                    )} per second`}
              </p>

              {/* LEVEL */}
              <p className="level text-white absolute top-1 right-1">
                lvl {decimalToHumanReadable(item.level)}
              </p>

              {/* PERCENTAGE IN BALANCE */}
              {item.percentageInBalance.gt(0) && (
                <p className="text-white percentage absolute bottom-1 right-1">
                  {item.percentageInBalance.toFixed(1).toString()} %
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-white text-end opacity-70 mr-4 text-sm">
        % of total clicks per second
      </p>
    </section>
  );
}
