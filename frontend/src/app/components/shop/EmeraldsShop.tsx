import { cn } from '@/lib/utils';
import EmeraldsLogo from '@/assets/Esports_Tokens_icon.webp';
import { env } from '@/env';
import Button from '../ui/Button';
import { useUserStore } from '@/contexts/user.store';

const emeraldsPack = [
  {
    id: 1,
    name: 'Some emeralds',
    quantity: 80,
    price: 0.99,
    link:
      env.VITE_ENV === 'production'
        ? 'https://buy.stripe.com/test_6oE9AVbYyavC5xe146'
        : env.VITE_ENV === 'stagging'
        ? 'https://buy.stripe.com/test_14kdRb6Ee7jq9NubIJ'
        : 'https://buy.stripe.com/test_fZeeVfd2C0V2aRyfYY',
  },
  {
    id: 2,
    name: 'Pouch of emeralds',
    quantity: 500,
    price: 4.99,
    link:
      env.VITE_ENV === 'production'
        ? 'https://buy.stripe.com/test_5kA7sN4w66fmf7OeUY'
        : env.VITE_ENV === 'stagging'
        ? 'https://buy.stripe.com/test_4gwcN78MmavC0cUcMP'
        : 'https://buy.stripe.com/test_5kA5kFbYy5bi8Jq005',
  },
  {
    id: 3,
    name: 'Pile of emeralds',
    quantity: 1100,
    price: 9.99,
    link:
      env.VITE_ENV === 'production'
        ? 'https://buy.stripe.com/test_00g9AV0fQdHOcZGfZ5'
        : env.VITE_ENV === 'stagging'
        ? 'https://buy.stripe.com/test_aEU4gB2nY8nuf7OeV0'
        : 'https://buy.stripe.com/test_aEU8wR8MmeLS5xeeV2',
  },
  {
    id: 4,
    name: 'Bag of emeralds',
    quantity: 2500,
    price: 19.99,
    link:
      env.VITE_ENV === 'production'
        ? 'https://buy.stripe.com/test_eVa8wR4w66fm9NucMW'
        : env.VITE_ENV === 'stagging'
        ? 'https://buy.stripe.com/test_28o28t0fQgU0f7O5kt'
        : 'https://buy.stripe.com/test_7sI9AVbYyfPWe3K6oz',
  },
  {
    id: 5,
    name: 'Box of emeralds',
    quantity: 6500,
    price: 49.99,
    link:
      env.VITE_ENV === 'production'
        ? 'https://buy.stripe.com/test_8wM3cxaUu1Z66Bi28l'
        : env.VITE_ENV === 'stagging'
        ? 'https://buy.stripe.com/test_8wM8wR8MmcDKcZG14g'
        : 'https://buy.stripe.com/test_5kA9AV8Mm8nu9Nu4gu',
  },
  {
    id: 6,
    name: 'Cart of emeralds',
    quantity: 14000,
    price: 99.99,
    link:
      env.VITE_ENV === 'production'
        ? 'https://buy.stripe.com/test_6oE28taUu0V28JqaEU'
        : env.VITE_ENV === 'stagging'
        ? 'https://buy.stripe.com/test_14k14p8Mm5bi8Jq7sH'
        : 'https://buy.stripe.com/test_bIYeVf2nY1Z61gYfZf',
  },
];

export default function Shop() {
  const emeraldsBalance = useUserStore((state) => state.user?.emeralds);
  return (
    <>
      <div className="flex flex-row justify-between items-center gap-2 p-1 px-2 border mx-3 mt-2 mb-2 rounded-lg">
        <p className="text-white">Balance:</p>
        <div className="flex flex-row justify-center items-center gap-1">
          <p className="price text-white flex flex-row text-base gap-1">
            {emeraldsBalance?.toString() ?? '0'}
          </p>
          <img
            width="20"
            height="20"
            src={EmeraldsLogo}
            alt="credit"
            className="object-contain"
          />
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-3 overflow-auto touch-pan-y items-center rounded-xl p-3 ">
        {emeraldsPack.map((item) => (
          <li key={item.id} className="w-full h-full active:scale-[0.98]">
            <Button noStyle className="w-full h-full">
              <a
                href={item.link}
                rel="noreferrer"
                className={cn(
                  'gap-2 border p-2 rounded-lg cursor-pointer relative transition-all w-full h-full flex flex-col justify-between items-center',
                  {
                    'opacity-50': !item.link,
                  },
                )}
              >
                <p className="text-white self-center text-md text-center">
                  {item.name}
                </p>
                <div className="flex flex-col justify-center items-center">
                  <img
                    width="60"
                    height="60"
                    src={EmeraldsLogo}
                    alt="credit"
                    className="object-contain"
                  />
                  <p className="price text-white flex flex-row text-xl gap-1">
                    {item.quantity}
                  </p>
                </div>
                <p className="price text-white gap-1 align-bottom self-center text-2xl">{`${item.price}€`}</p>
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}
