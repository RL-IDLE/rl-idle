import CreditLogo from '@/assets/credits_icon.webp';
import gradient from '@/assets/gradient.png';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { router } from '@/lib/api';
import { IUser } from '@/types/user';
import unrankedIcon from '@/assets/Unranked_icon.webp';
import Decimal from 'break_infinity.js';

export default function Ranking() {
  // const user = useUserStore((state) => state.user);
  const [top20Users, setTop20Users] = useState<IUser[]>([]);

  const fetchTop20Users = async () => {
    const users = await router.user.getTop20Users(undefined);
    setTop20Users(
      users.map((user) => ({
        ...user,
        moneyFromClick: Decimal.fromString(user.moneyFromClick),
        moneyPerClick: Decimal.fromString(user.moneyPerClick),
        moneyUsed: Decimal.fromString(user.moneyUsed),
        emeralds: Decimal.fromString(user.emeralds),
        itemsBought: user.itemsBought.map((itemBought) => ({
          id: itemBought.id,
          item: {
            id: itemBought.item.id,
            name: itemBought.item.name,
            price: Decimal.fromString(itemBought.item.price),
            moneyPerSecond: Decimal.fromString(itemBought.item.moneyPerSecond),
            moneyPerClickMult: Decimal.fromString(
              itemBought.item.moneyPerClickMult,
            ),
            url: itemBought.item.url,
            kind: itemBought.item.kind,
          },
          createdAt: new Date(itemBought.createdAt),
        })),
        prestigesBought: user.prestigesBought.map((prestigeBought) => ({
          id: prestigeBought.id,
          prestige: {
            id: prestigeBought.prestige.id,
            name: prestigeBought.prestige.name,
            price: Decimal.fromString(prestigeBought.prestige.price),
            moneyMult: Decimal.fromString(prestigeBought.prestige.moneyMult),
            image: prestigeBought.prestige.image,
          },
          createdAt: new Date(prestigeBought.createdAt),
        })),
        latestBalance: Decimal.fromString(user.latestBalance),
      })),
    );
  };

  useEffect(() => {
    const interval = setInterval(fetchTop20Users, 10000);
    fetchTop20Users();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="flex flex-col pt-32 pb-28 h-full">
      <div
        className={cn(
          'rounded-xl overflow-hidden self-center text-white w-[calc(100%-40px)] flex flex-col items-center h-full px-2',
        )}
        style={{
          backgroundImage: `url(${gradient})`,
          backgroundSize: 'cover',
        }}
      >
        <h1 className="text-white text-center p-3 text-3xl">Ranking</h1>
        <ul
          className={cn(
            'flex flex-col gap-1.5 overflow-auto touch-pan-y relative items-center rounded-xl pt-1 pb-1 w-full',
          )}
        >
          {top20Users.map((user, index) => {
            const lastPrestigeImg =
              user.prestigesBought.at(-1)?.prestige.image ?? unrankedIcon;
            // const balance = getUserBalance(user);
            return (
              <li
                key={index}
                className={`flex flex-row gap-2 p-2 py-0.5 cursor-pointer relative transition-all w-full items-center rounded-lg border-[#C6F0FF] border-opacity-50 border`}
              >
                <p className="text-white text-1xl flex flex-row items-center space-x-2">
                  {index + 1}
                  {lastPrestigeImg && (
                    <img
                      width="30"
                      src={lastPrestigeImg}
                      className="text-white ml-2"
                    />
                  )}
                  <span>{user.username ? user.username : 'Anonymous'}</span>
                </p>

                <p className="flex text-white ml-auto text-1xl gap-2 align-center h-fit">
                  <span className="h-fit">{user.latestBalance.toString()}</span>{' '}
                  <img width="25" src={CreditLogo} alt="credit" />
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
