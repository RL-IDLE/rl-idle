import { cn } from '@/lib/utils';
import GemmesLogo from '@/assets/Esports_Tokens_icon.webp';

export default function GemmesShop() {
  const gemmesPack = [
    {
      id: 1,
      name: 'Some emeralds',
      quantity: 80,
      price: 0.99,
    },
    {
      id: 2,
      name: 'Handful of emeralds',
      quantity: 500,
      price: 4.99,
    },
    {
      id: 3,
      name: 'Pile of emeralds',
      quantity: 1100,
      price: 9.99,
    },
    {
      id: 4,
      name: 'Bag of emeralds',
      quantity: 2500,
      price: 19.99,
    },
    {
      id: 5,
      name: 'Box of emeralds',
      quantity: 6500,
      price: 49.99,
    },
    {
      id: 6,
      name: 'Cart of emeralds',
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
    <ul className="grid grid-cols-3 gap-3 overflow-auto touch-pan-y items-center rounded-xl p-3 ">
      {gemmesPack.map((item) => (
        <li
          key={item.id}
          className={cn(
            'gap-2 border p-2 cursor-pointer relative transition-all active:scale-[0.98] w-full h-full flex flex-col justify-between items-center',
          )}
          onClick={() => {
            console.log('click');
          }}
        >
          <p className="text-white self-center text-lg text-center">
            {item.name}
          </p>
          <div className="flex flex-col justify-center items-center">
            <img
              width="60"
              height="60"
              src={GemmesLogo}
              alt="credit"
              className="object-contain"
            />
            <p className="price text-white flex flex-row text-xl gap-1">
              {item.quantity}
            </p>
          </div>
          <p className="price text-white gap-1 align-bottom self-center text-2xl">{`${item.price}€`}</p>
        </li>
      ))}
    </ul>
  );
}
