import { useGameStore } from '@/contexts/game.store';
import { useItemsStore } from '@/contexts/items.store';
import { useUserStore } from '@/contexts/user.store';
import { getPriceForClickItem, getPriceOfItem } from '@/lib/game';
import { cn } from '@/lib/utils';
import Decimal from 'break_infinity.js';
import { logger } from '@/lib/logger';
import { decimalToHumanReadable } from '@/lib/bignumber';
import clickSound from '@/assets/audio/buy-item.wav';
import { useBalance } from '@/contexts/balance/BalanceUtils';

export default function Shop() {
  const buyItem = useGameStore((state) => state.actions.buyItem);
  const user = useUserStore((state) => state.user);
  const { balance } = useBalance();
  const items = useItemsStore((state) => state.items);
  const audio = new Audio(clickSound);
  const itemsLevels: {
    [id: string]: Decimal | undefined;
  } =
    user?.itemsBought.reduce<{
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
  }));

  const handleBuy = (id: string) => {
    buyItem(id);
    audio.play();
  };

  return (
    <section className="flex flex-col h-full mt-32 pb-28">
      <ul className="flex flex-col gap-2 overflow-auto touch-pan-y bg-white pb-28">
        {itemsWithPrice.map((item) => (
          <li
            key={item.id}
            className={cn('flex flex-col gap-2 border p-2 cursor-pointer', {
              'border-red-500': item.price.gt(balance),
            })}
            onClick={() => {
              if (item.price.gt(balance)) {
                logger.debug('Not enough money to buy item');
                return;
              }
              handleBuy(item.id);
            }}
          >
            <img src={item.image} alt={item.name} className="w-12 h-12" />
            <p>
              {item.name} - {decimalToHumanReadable(item.price)}
            </p>
            <p>
              {item.moneyPerSecond.eq(0)
                ? `x${item.moneyPerClickMult.toString()} per click`
                : `+${decimalToHumanReadable(item.moneyPerSecond)} per second`}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
