import { useGameStore } from '@/contexts/game.store';
import { useItemsStore } from '@/contexts/items.store';
import { useUserStore } from '@/contexts/user.store';
import { getPriceForClickItem, getPriceOfItem } from '@/lib/game';
import { cn } from '@/lib/utils';
import Decimal from 'break_infinity.js';
import { logger } from '@/lib/logger';
import { decimalToHumanReadable } from '@/lib/bignumber';
import styles from './shop.module.scss';
import clickSound from '@/assets/audio/buy-item.wav';
import { useBalance } from '@/contexts/balance/BalanceUtils';
import { useEffect, useState } from 'react';
import CreditLogo from '@/assets/credits_icon.webp';

export default function Shop() {
  const buyItem = useGameStore((state) => state.actions.buyItem);
  const itemsBought = useUserStore((state) => state.user?.itemsBought);
  const { balance } = useBalance();
  const items = useItemsStore((state) => state.items);
  const [audio, setAudio] = useState<HTMLAudioElement>();

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
    // moneyPerSecond: (itemsLevels[item.id] * item.moneyPerSecond) || Decimal.fromString('0'),
  }));

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
              'flex flex-row gap-2 border p-2 cursor-pointer relative',
              {
                'opacity-70': item.price.gt(balance),
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
            <img src={item.image} alt={item.name} className="w-12 h-12" />
            <div className="flex flex-col gap-2">
              <p className="text-white">{item.name}</p>

              <p className="price text-white flex flex-row gap-1">
                <img width="20" height="20" src={CreditLogo} alt="credit" />
                {decimalToHumanReadable(item.price)}
              </p>

              <p className="text-white">
                {item.moneyPerSecond.eq(0)
                  ? `x${item.moneyPerClickMult.toString()} per click`
                  : `+${decimalToHumanReadable(
                      item.moneyPerSecond,
                    )} per second`}
              </p>
              <p className="level text-white absolute top-1 right-1">
                lvl {decimalToHumanReadable(item.level)}
              </p>
              <p>{decimalToHumanReadable(item.moneyPerSecond)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
