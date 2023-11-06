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
import { decimalToHumanReadable } from '@/lib/bignumber';
import styles from './shop.module.scss';
import { useBalance } from '@/contexts/balance/BalanceUtils';
import { useEffect, useState } from 'react';
import CreditLogo from '@/assets/credits_icon.webp';
import EmeraldsShop from './EmeraldsShop';
import memoizeOne from 'memoize-one';
import { IPrestigeBought } from '@/types/prestige';
import { getHighestPrestigeMult } from '../../../lib/game';
import { IItemBought } from '@/types/item';
import { env } from '@/env';
import cursorSvg from '@/assets/Cursor.svg';
import boostImage from '@/assets/Standard_rocket_boost_icon.png';
import gradient from '@/assets/gradient.png';

const memoizedPresitgesSorted = memoizeOne((prestiges: IPrestigeBought[]) => {
  return prestiges.sort((a, b) =>
    b.prestige.moneyMult.cmp(a.prestige.moneyMult),
  );
});

const memoizedItemsBoughtSorted = memoizeOne((items: IItemBought[]) => {
  return items.sort((a, b) => b.item.moneyPerSecond.cmp(a.item.moneyPerSecond));
});

export default function Shop() {
  const buyItem = useGameStore((state) => state.actions.buyItem);
  const itemsBought = useUserStore((state) => state.user?.itemsBought);
  const prestigesBought = useUserStore((state) => state.user?.prestigesBought);
  const { balance } = useBalance();
  const [isCredit, setIsCredit] = useState(true);
  const items = useItemsStore((state) => state.items);
  const [audios, setAudios] = useState<HTMLAudioElement[]>([]);
  const moneyPerSecond = getMoneyFromInvestmentsPerSeconds({
    itemsBought: itemsBought ?? [],
    prestigesBought: prestigesBought ?? [],
  });
  const [navAudio, setNavAudio] = useState<HTMLAudioElement>();

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
      ? (itemEarnPerSecond[item.id] as Decimal)
          .times(
            getHighestPrestigeMult({
              prestigesBought: prestigesBought ?? [],
            }),
          )
          .div(moneyPerSecond)
          .times(100)
      : Decimal.fromString('0'),
  }));

  const itemsBoughtSorted = memoizedItemsBoughtSorted(
    itemsBought ? [...itemsBought] : [],
  );
  const latestItemBought =
    itemsBoughtSorted.length > 0 ? itemsBoughtSorted[0] : null;
  const latestItemBoughtIndex = itemsWithPrice.findIndex(
    (item) => item.id === latestItemBought?.item.id,
  );

  //? All items + 3 items that are not bought
  const itemsDisplayList = itemsWithPrice.filter((_, index) => {
    //? Item index <= latestItemBoughtIndex + 3
    if (index < 3 || index <= latestItemBoughtIndex + 2) {
      return true;
    }
  });

  const prestigesSorted = memoizedPresitgesSorted(
    prestigesBought ? [...prestigesBought] : [],
  );
  const latestPrestigeMult: Decimal =
    prestigesSorted.length > 0
      ? prestigesSorted[0].prestige.moneyMult
      : Decimal.fromString('1');

  useEffect(() => {
    const audio1 = new Audio(
      env.VITE_API_URL + '/public/items/buy/SFX_UI_MainMenu_0025.ogg',
    );
    audio1.volume = 0.5;
    const audio2 = new Audio(
      env.VITE_API_URL + '/public/items/buy/SFX_UI_MainMenu_0026.ogg',
    );
    audio2.volume = 0.5;
    const audio3 = new Audio(
      env.VITE_API_URL + '/public/items/buy/SFX_UI_MainMenu_0027.ogg',
    );
    audio3.volume = 0.5;
    const audio4 = new Audio(
      env.VITE_API_URL + '/public/items/buy/SFX_UI_MainMenu_0030.ogg',
    );
    audio4.volume = 0.5;
    const audio5 = new Audio(
      env.VITE_API_URL + '/public/items/buy/SFX_UI_MainMenu_0031.ogg',
    );
    audio5.volume = 0.5;
    setAudios([audio1, audio2, audio3, audio4, audio5]);
    const navAudio = new Audio(
      env.VITE_API_URL + '/public/ui/SFX_UI_MainMenu_0002.ogg',
    );
    navAudio.volume = 0.5;
    setNavAudio(navAudio);
    return () => {
      audio1.remove();
      audio2.remove();
      audio3.remove();
      audio4.remove();
      audio5.remove();
      navAudio.remove();
    };
  }, []);

  const handleBuy = (id: string) => {
    buyItem(id);
    if (audios.length > 0) {
      const audio = audios[Math.floor(Math.random() * audios.length)];
      audio.currentTime = 0;
      audio.play();
    }
  };

  return (
    <div className="flex flex-col mt-32 pb-6 h-full">
      <div
        className={cn(
          'bg-gradient-to-t relative from-gradient-dark from-0% to-gradient-light to-100% justify-evenly flex touch-pan-y w-[calc(100%-40px)] self-center mb-2 rounded-xl p-1',
        )}
      >
        <button
          className={cn('text-white p-3 py-1 w-full rounded-[8px] z-10')}
          onClick={() => {
            if (navAudio) {
              navAudio.currentTime = 0;
              navAudio.play();
            }
            setIsCredit(true);
          }}
        >
          Credits
        </button>
        <button
          className={cn('text-white p-3 py-1 w-full rounded-[8px] z-10')}
          onClick={() => {
            if (navAudio) {
              navAudio.currentTime = 0;
              navAudio.play();
            }
            setIsCredit(false);
          }}
        >
          Emeralds
        </button>
        <div
          className="bg-gradient-light border border-background absolute top-0 h-[calc(100%-8px)] w-[calc(50%-4px)] left-0 m-1 rounded-[8px] transition-all duration-200 ease-in"
          style={{
            transform: isCredit ? 'translateX(0%)' : 'translateX(100%)',
          }}
        ></div>
      </div>
      <section
        className={cn(styles.shop + ' flex flex-col rounded-xl', {
          'after:!hidden': !isCredit,
        })}
        style={{
          backgroundImage: `url(${gradient})`,
          backgroundSize: 'cover',
        }}
      >
        {isCredit ? (
          <>
            <ul
              className={cn(
                'flex flex-col gap-1.5 overflow-auto touch-pan-y relative items-center rounded-xl pt-3 px-3 pb-10',
              )}
            >
              {itemsDisplayList.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    'flex flex-row gap-2 border p-2 cursor-pointer relative transition-all active:scale-[0.98] w-full items-center rounded-lg',
                    // {
                    //   'opacity-[.65]': item.price.gt(balance),
                    //   'pointer-events-none': item.price.gt(balance),
                    // },
                  )}
                  onClick={() => {
                    // if (item.price.gt(balance)) {
                    //   logger.debug('Not enough money to buy item');
                    //   return;
                    // }
                    handleBuy(item.id);
                  }}
                >
                  {item.kind === 'car' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="max-w-[4rem] h-full object-contain"
                    />
                  ) : item.kind === 'click' ? (
                    <img
                      src={cursorSvg}
                      alt={item.name}
                      className="w-[4rem] h-[2.5rem] object-contain"
                    />
                  ) : item.kind === 'boost' ? (
                    <img
                      src={boostImage}
                      alt={item.name}
                      className="w-[4rem] h-[2.5rem] object-contain"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="max-w-[4rem] h-full object-contain"
                    />
                  )}
                  <div className="flex flex-col gap-1 flex-1 justify-between h-full">
                    <div className="flex flex-row space-x-1 items-center">
                      {/* NAME */}
                      <p className="text-white text-sm">{item.name}</p>
                      {item.percentageInBalance.gt(0) && (
                        <p className="text-white/80 whitespace-nowrap percentage text-xs">
                          ({item.percentageInBalance.toFixed(1).toString()}%)
                        </p>
                      )}
                    </div>

                    {/* PRICE */}
                    <p className="price text-white flex flex-row gap-1 text-lg">
                      <img
                        width="20"
                        height="20"
                        src={CreditLogo}
                        alt="credit"
                        className="object-contain"
                      />
                      {decimalToHumanReadable(item.price, true)}
                    </p>
                  </div>
                  <div className="gap-1 flex flex-col justify-between h-full">
                    {/* Money per Click */}
                    <p className="text-white text-xs text-end">
                      {item.moneyPerSecond.eq(0)
                        ? `x${item.moneyPerClickMult.toString()}/click`
                        : `+${decimalToHumanReadable(
                            item.moneyPerSecond.mul(latestPrestigeMult),
                          )}/s`}
                    </p>
                    {/* LEVEL */}
                    <p className="level text-white text-end">
                      lvl {decimalToHumanReadable(item.level, true)}
                    </p>
                  </div>

                  {/* LEVEL */}
                  {/* <p className="level text-white absolute top-1 right-1">
                      lvl {decimalToHumanReadable(item.level, true)}
                    </p> */}

                  {/* PERCENTAGE IN BALANCE */}
                  {/* {item.percentageInBalance.gt(0) && (
                    <p className="text-white percentage absolute bottom-1 right-1">
                      {item.percentageInBalance.toFixed(1).toString()} %
                    </p>
                  )} */}
                </li>
              ))}
            </ul>
            <p className="text-white text-end text-sm absolute bottom-1 rounded-xl px-2 overflow-hidden right-2 backdrop-blur-sm bg-background/40 p-1">
              % =&gt; gains impact
            </p>
          </>
        ) : (
          <EmeraldsShop />
        )}
      </section>
    </div>
  );
}
