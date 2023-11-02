import { useGameStore } from '@/contexts/game.store';
import { useItemsStore } from '@/contexts/items.store';
import { useUserStore } from '@/contexts/user.store';
import clickSound from '@/assets/audio/buy-item.wav';
import { useBalance } from '@/contexts/balance/BalanceUtils';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function GemmesShop() {
  const buyItem = useGameStore((state) => state.actions.buyItem);
  const user = useUserStore((state) => state.user);
  const { balance } = useBalance();
  const items = useItemsStore((state) => state.items);
  const [audio] = useState(new Audio(clickSound));
  const [isCredits, setIsCredit] = useState(true);
  const gemmesPack = [
    {
      id: 1,
      name: 'Petite poignée de gemmes',
      quantity: 80,
      price: 0.99,
    },
    {
      id: 2,
      name: 'Poignée de gemmes',
      quantity: 500,
      price: 4.99,
    },
    {
      id: 3,
      name: 'Tas de gemmes',
      quantity: 1100,
      price: 9.99,
    },
    {
      id: 4,
      name: 'Sac de gemmes',
      quantity: 2500,
      price: 19.99,
    },
    {
      id: 5,
      name: 'Caisse de gemmes',
      quantity: 6500,
      price: 49.99,
    },
    {
      id: 6,
      name: 'Caisse de gemmes',
      quantity: 14000,
      price: 99.99,
    },
  ];

  //   const handleBuy = (id: string) => {
  //     buyGemmes(id);
  //     audio.currentTime = 0;
  //     audio.play();
  //   };

  //   const handleChangeCategory = (state: boolean) => {
  //     setIsCredit(state);
  //   };

  return (
    <ul className="flex flex-col gap-2 overflow-auto touch-pan-y items-center rounded-xl pt-3 pb-3">
      {gemmesPack.map((item) => (
        <li
          key={item.id}
          className={cn(
            'flex flex-row gap-2 border p-2 cursor-pointer relative',
          )}
          onClick={() => {
            console.log('click');
          }}
        >
          <div className="flex flex-col gap-2">
            <p className="text-white">{item.name}</p>

            <p className="price text-white flex flex-row gap-1">{item.price}</p>
            <p>{item.quantity}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
