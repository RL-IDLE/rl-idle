import { cn } from '@/lib/utils';
import EmeraldsLogo from '@/assets/Esports_Tokens_icon.webp';
import TimeWarpIcon from '@/assets/Icon_ScoreTime.png';
import UpgradeIcon from '@/assets/Icon_ScoreSpeed.png';
import gradient from '@/assets/gradient.png';
import {
  timewarpBoost,
  upgradeBoost,
} from '../../../../../backend/src/lib/constant';
import { useUserStore } from '@/contexts/user.store';
import { useState } from 'react';
import BoostAnimation from './BoostAnimation';
import Decimal from 'break_infinity.js';

export default function Boost() {
  const maxPassiveIncomeInterval =
    useUserStore((state) => state.user?.maxPassiveIncomeInterval) ?? 0;
  const buyBoost = useUserStore((state) => state.buyBoost);
  const emeralds =
    useUserStore((state) => state.user?.emeralds) ?? Decimal.fromString('0');

  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [boughtItem, setBoughItem] = useState<null | {
    name: string;
    image: string;
  }>(null);

  return (
    <section className="flex flex-col h-full pt-32 pb-28">
      <div
        className={cn(
          'justify-between rounded-xl overflow-hidden self-center text-white w-[calc(100%-40px)] flex flex-col items-center ',
        )}
        style={{
          backgroundImage: `url(${gradient})`,
          backgroundSize: 'cover',
        }}
      >
        <h2 className="text-4xl text-center relative text-white p-5">
          Boosts !
        </h2>
        <div className="flex flex-col overflow-y-scroll">
          <div
            className={cn(
              'bg-gradient-to-t border-2 border-white from-[#111429] from-0% to-[#1f3358] to-100% self-center flex flex-col mx-2 w-[calc(100%-20px)] touch-pan-y mb-1 rounded-xl',
            )}
          >
            <p className="text-white p-1 rounded-l text-center self-center">
              Timewarp
            </p>
          </div>
          <ul className="grid grid-cols-3 gap-3 max-h-full max-w-full h-fit w-full touch-pan-y rounded-xl p-3 ">
            {timewarpBoost.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'gap-3 border p-2 rounded-xl cursor-pointer relative transition-all active:scale-[0.98] w-full h-full flex flex-col items-center',
                  {
                    // 'opacity-50 pointer-events-none': emeralds.lt(item.price),
                    'opacity-50 pointer-events-none': true, //? Disable
                  },
                )}
                onClick={() => {
                  buyBoost(item);
                  setShowAnimation(true);
                  setBoughItem({
                    name: 'Warped ' + item.name,
                    image: TimeWarpIcon,
                  });
                }}
              >
                <div className="flex items-center justify-center">
                  <img
                    width="40"
                    height="40"
                    src={TimeWarpIcon}
                    alt="credit"
                    className="object-container"
                  />
                  <p className="text-white self-center text-xl text-center">
                    {item.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <img
                    width="20"
                    height="20"
                    src={EmeraldsLogo}
                    alt="credit"
                    className="object-contain"
                  />
                  <p className="price text-white gap-1 align-bottom p-1 self-center text-base">{`${item.price}`}</p>
                </div>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              'bg-gradient-to-t border-2 m-2 border-white from-[#111429] from-0% to-[#1f3358] to-100% self-center flex flex-col touch-pan-y w-[calc(100%-20px)] mb-1 mt-5 rounded-xl',
            )}
          >
            <p className="text-white p-1 rounded-xl text-center self-center">
              Upgrade
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 max-h-full max-w-full h-fit w-full touch-pan-y rounded-xl p-3 ">
            {upgradeBoost.map((item) => (
              <li
                key={item.id}
                className={cn(
                  'gap-3 border p-2 rounded-xl cursor-pointer relative transition-all active:scale-[0.98] w-full h-full flex flex-col justify-between items-center',
                  {
                    // 'opacity-50 pointer-events-none': emeralds.lt(item.price),
                    'opacity-50 pointer-events-none':
                      item.id !== '3' || emeralds.lt(item.price), //? Disable
                  },
                )}
                onClick={() => {
                  buyBoost(item);
                  setShowAnimation(true);
                  if (item.id === '3') {
                    setBoughItem({
                      name: 'Increase passive income',
                      image: UpgradeIcon,
                    });
                  } else {
                    setBoughItem({
                      name: 'Increase click power',
                      image: UpgradeIcon,
                    });
                  }
                }}
              >
                <div className="flex flex-col justify-center items-center">
                  <img
                    width="40"
                    height="40"
                    src={UpgradeIcon}
                    alt="credit"
                    className="object-contain"
                  />
                  <p className="text-white self-center text-l text-center">
                    {item.name}
                  </p>
                  <p className="text-white self-center text-l text-center">
                    {item.durationTime
                      ? item.durationTime / 60 + 'min'
                      : '+' + item.afkTime?.toString() + 'h' + ' '}
                    {item.id === '3' && (
                      <span className="text-white/70 ml-2">
                        (cur {maxPassiveIncomeInterval / (60 * 60 * 1000) + 'h'}
                        )
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center">
                  <img
                    width="20"
                    height="20"
                    src={EmeraldsLogo}
                    alt="credit"
                    className="object-contain"
                  />
                  <p className="price text-white gap-1 align-bottom p-1 self-center text-base">{`${item.price}`}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showAnimation && (
        <BoostAnimation close={() => setShowAnimation(false)}>
          {boughtItem && (
            <>
              <img
                src={boughtItem.image}
                alt="prize"
                className="w-10/12 max-w-[400px] object-contain"
              />
              <div className="flex flex-col gap-3 font-bold">
                {boughtItem.name}
              </div>
            </>
          )}
        </BoostAnimation>
      )}
    </section>
  );
}
