import { useGameStore } from '@/contexts/game.store';
import { useItemsStore } from '@/contexts/items.store';
import { useUserStore } from '@/contexts/user.store';
import { getPriceOfItem, getUserBalance } from '@/lib/game';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import Balance from '../balance';
import Decimal from 'break_infinity.js';

export default function Shop() {
  const buyItem = useGameStore((state) => state.actions.buyItem);
  const user = useUserStore((state) => state.user);
  const balance = getUserBalance(user);
  const items = useItemsStore((state) => state.items);
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
  console.log(
    '🚀 ~ file: events.service.ts:61 ~ EventsService ~ buyItem ~ alreadyBought:',
    itemsLevels,
  );

  const itemsWithPrice = items.map((item) => ({
    ...item,
    price: getPriceOfItem(
      item.price,
      itemsLevels[item.id] || Decimal.fromString('0'),
    ),
  }));

  const handleBuy = (id: string) => {
    buyItem(id);
  };

  return (
    <section className="flex flex-col h-full">
      <Balance />
      <ul className="flex flex-col gap-2 overflow-auto">
        {itemsWithPrice.map((item) => (
          <li
            key={item.id}
            className={cn('flex flex-col gap-2 border p-2', {
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
              {item.name} - {item.price.toString()}
            </p>
            <p>
              {item.moneyPerSecond.eq(0)
                ? `x${item.moneyPerClickMult.toString()} per click`
                : `+${item.moneyPerSecond.toString()} per second`}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
