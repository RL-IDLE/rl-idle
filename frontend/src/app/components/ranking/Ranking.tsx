import { useUserStore } from '@/contexts/user.store';
import { getUserBalance } from '@/lib/game';
import { useEffect } from 'react';
import CreditLogo from '@/assets/credits_icon.webp';
import gradient from '@/assets/gradient.png';
import { cn } from '@/lib/utils';

export default function Ranking() {
  const user = useUserStore((state) => state.user);
  const fakeUsersScores = [
    {
      id: '2f69b036-330c-4079-97f9-70388513f589',
      username: 'Pilmax',
      prestigesBought: [
        {
          id: '56ac98f3-85fc-409f-bdff-6e6f6c65d6e4',
          prestige: {
            id: '6156c8e1-bba4-4e6a-9bc6-f9d35e5c9305',
            name: 'Bronze I',
            price: '1000000',
            moneyMult: '2',
            image:
              'http://localhost:3000/public/prestige/Bronze1_rank_icon.webp',
          },
          createdAt: '2023-11-09T12:56:25.565Z',
        },
        {
          id: 'db0e60d0-f3f3-44a4-83ba-a89842ba915b',
          prestige: {
            id: 'b424b240-96f6-4324-bbd8-96095e79dd72',
            name: 'Bronze II',
            price: '16000000',
            moneyMult: '4',
            image:
              'http://localhost:3000/public/prestige/Bronze2_rank_icon.webp',
          },
          createdAt: '2023-11-09T12:56:43.745Z',
        },
        {
          id: '1c38ecc5-5726-4a42-9bd3-8221fd430f97',
          prestige: {
            id: '6de51a40-ef67-4668-9fc8-56a1d9f4b945',
            name: 'Bronze III',
            price: '260000000',
            moneyMult: '8',
            image:
              'http://localhost:3000/public/prestige/Bronze3_rank_icon.webp',
          },
          createdAt: '2023-11-09T12:56:44.881Z',
        },
        {
          id: 'e01ef771-8210-4fa4-b0d8-c79658deb628',
          prestige: {
            id: '0ff1b26f-34df-4f50-852a-2c7ee78ee509',
            name: 'Silver I',
            price: '4099999999.9999995',
            moneyMult: '16',
            image:
              'http://localhost:3000/public/prestige/Silver1_rank_icon.webp',
          },
          createdAt: '2023-11-09T12:56:45.172Z',
        },
        // {
        //   id: 'cc783066-84a6-418a-b78a-ff1b26eee3a6',
        //   prestige: {
        //     id: '900859f6-aa91-4437-8596-9493ec561c2f',
        //     name: 'Silver II',
        //     price: '66000000000',
        //     moneyMult: '32',
        //     image:
        //       'http://localhost:3000/public/prestige/Silver2_rank_icon.webp',
        //   },
        //   createdAt: '2023-11-09T12:56:45.478Z',
        // },
      ],
      balance: '120',
    },
    {
      id: '2f69b036-330c-4079-97f9-70388513f589',
      username: null,
      prestigesBought: [
        {
          id: '56ac98f3-85fc-409f-bdff-6e6f6c65d6e4',
          prestige: {
            id: '6156c8e1-bba4-4e6a-9bc6-f9d35e5c9305',
            name: 'Bronze I',
            price: '1000000',
            moneyMult: '2',
            image:
              'http://localhost:3000/public/prestige/Bronze1_rank_icon.webp',
          },
          createdAt: '2023-11-09T12:56:25.565Z',
        },
        {
          id: 'db0e60d0-f3f3-44a4-83ba-a89842ba915b',
          prestige: {
            id: 'b424b240-96f6-4324-bbd8-96095e79dd72',
            name: 'Bronze II',
            price: '16000000',
            moneyMult: '4',
            image:
              'http://localhost:3000/public/prestige/Bronze2_rank_icon.webp',
          },
          createdAt: '2023-11-09T12:56:43.745Z',
        },
        {
          id: '1c38ecc5-5726-4a42-9bd3-8221fd430f97',
          prestige: {
            id: '6de51a40-ef67-4668-9fc8-56a1d9f4b945',
            name: 'Bronze III',
            price: '260000000',
            moneyMult: '8',
            image:
              'http://localhost:3000/public/prestige/Bronze3_rank_icon.webp',
          },
          createdAt: '2023-11-09T12:56:44.881Z',
        },
        {
          id: 'e01ef771-8210-4fa4-b0d8-c79658deb628',
          prestige: {
            id: '0ff1b26f-34df-4f50-852a-2c7ee78ee509',
            name: 'Silver I',
            price: '4099999999.9999995',
            moneyMult: '16',
            image:
              'http://localhost:3000/public/prestige/Silver1_rank_icon.webp',
          },
          createdAt: '2023-11-09T12:56:45.172Z',
        },
        {
          id: 'cc783066-84a6-418a-b78a-ff1b26eee3a6',
          prestige: {
            id: '900859f6-aa91-4437-8596-9493ec561c2f',
            name: 'Silver II',
            price: '66000000000',
            moneyMult: '32',
            image:
              'http://localhost:3000/public/prestige/Silver2_rank_icon.webp',
          },
          createdAt: '2023-11-09T12:56:45.478Z',
        },
      ],
      balance: '12',
    },
  ];
  // order fakeUsersScores by prestigeBought.length and then if have the same prestige lenght by balance in current prestige
  const sortedFakeUsersScores = fakeUsersScores.sort((a, b) => {
    const aPrestigeBoughtLength = a.prestigesBought.length;
    const bPrestigeBoughtLength = b.prestigesBought.length;
    if (aPrestigeBoughtLength > bPrestigeBoughtLength) {
      return -1;
    }
    if (aPrestigeBoughtLength < bPrestigeBoughtLength) {
      return 1;
    }
    if (aPrestigeBoughtLength === bPrestigeBoughtLength) {
      const aBalance = getUserBalance(a);
      const bBalance = getUserBalance(b);
      if (aBalance > bBalance) {
        return -1;
      }
      if (aBalance < bBalance) {
        return 1;
      }
      return 0;
    }
    return 0;
  });

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  return (
    <section
      className="flex flex-col mt-auto ml-5 mr-5 mb-auto h-[65vh] relative  w-full rounded-xl pt-3 px-3 pb-10"
      style={{
        backgroundImage: `url(${gradient})`,
        backgroundSize: 'cover',
      }}
    >
      <h1 className="text-white text-center p-3 text-3xl">Classement</h1>
      <ul
        className={cn(
          'flex flex-col gap-1.5 overflow-auto touch-pan-y relative items-center rounded-xl pt-1 pb-1',
        )}
      >
        {sortedFakeUsersScores.map((user, index) => {
          const order = 1000 - user.prestigesBought.length;
          const lastPrestigeImg = user.prestigesBought.at(-1)?.prestige.image;
          // const balance = getUserBalance(user);
          return (
            <li
              key={index}
              className={`flex flex-row gap-2 p-2 cursor-pointer relative transition-all w-full items-center rounded-lg border-[#C6F0FF] border-2`}
              style={{
                order: order,
              }}
            >
              <p className="text-white text-1xl">
                {index + 1}. {user.username ? user.username : 'Anonymous'}
              </p>
              {lastPrestigeImg && (
                <img
                  width="30"
                  src={lastPrestigeImg}
                  className="text-white ml-2"
                />
              )}

              <p className="flex text-white ml-auto text-1xl gap-2 align-center h-fit">
                <span className="h-fit">{user.balance}</span>{' '}
                <img width="25" src={CreditLogo} alt="credit" />
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
