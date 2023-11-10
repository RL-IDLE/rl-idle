import { useGameStore } from '@/contexts/game.store';
import { usePrestigeStore } from '@/contexts/prestiges.store';
import { useUserStore } from '@/contexts/user.store';
import { decimalToHumanReadable } from '@/lib/bignumber';
// import homeBgLarge from '../../../assets/home-bg-large.webp';
import homeBgLarge from '../../../assets/home-bg-large.webp';
import unrankedIcon from '../../../assets/Unranked_icon.webp';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';
import { useBalance } from '@/contexts/balance/BalanceUtils';
import ArrowPrestige from '../icons/ArrowPrestige';
import { useState } from 'react';
import gradient from '@/assets/gradient.png';
import PassPrestigeAnimation from './PassPrestigeAnimation';

export default function Prestige() {
  const prestiges = usePrestigeStore((state) => state.prestiges);
  const _buyPrestige = useGameStore((state) => state.actions.buyPrestige);
  const prestigesBought = useUserStore((state) => state.user?.prestigesBought);
  const { balance } = useBalance();

  const [passPrestigeAnimation, setPassPrestigeAnimation] = useState<{
    old: NonNullable<typeof prestigesBought>[number]['prestige'] | null;
    new: NonNullable<typeof prestigesBought>[number]['prestige'] | null;
  } | null>(null);

  const pSorted = prestiges.sort((a, b) => {
    return a.moneyMult.cmp(b.moneyMult);
  });

  const pbSorted = prestigesBought
    ? [...prestigesBought].sort((a, b) => {
        return a.prestige.moneyMult.cmp(b.prestige.moneyMult);
      })
    : null;

  const currentPrestige = pbSorted?.[pbSorted.length - 1] || null;
  const currentPrestigeIndex = pSorted.findIndex(
    (prestige) => prestige.id === currentPrestige?.prestige.id,
  );
  const nextPrestige =
    currentPrestigeIndex === pSorted.length - 1
      ? null
      : pSorted[currentPrestigeIndex + 1];

  const buyPrestige = (id: string) => {
    setPassPrestigeAnimation({
      old: currentPrestige?.prestige || null,
      new: nextPrestige,
    });
    _buyPrestige(id);
  };

  return (
    <section className="flex flex-col items-center h-full justify-center">
      <img
        src={homeBgLarge}
        alt="background"
        className={cn(
          'absolute left-0 top-0 h-screen object-cover visible min-w-[500vw] -z-[1]',
        )}
      />
      <div
        className={cn(
          'justify-between rounded-xl overflow-hidden text-white m-10 w-[calc(100%-40px)] flex flex-col items-center ',
        )}
        style={{
          backgroundImage: `url(${gradient})`,
          backgroundSize: 'cover',
        }}
      >
        <h2 className="text-4xl text-center relative text-white flex flex-col p-5">
          Prestige !
        </h2>
        <div className="flex text-sm">
          {currentPrestige ? (
            <div className="flex flex-col items-center justify-center font-bold">
              <img
                width="150"
                height="75"
                src={currentPrestige.prestige.image}
                alt="credit"
              />
              {currentPrestige.prestige.name}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img width="150" height="75" src={unrankedIcon} alt="unranked" />
              Unranked
            </div>
          )}
          {nextPrestige && (
            <>
              <ArrowPrestige className={'w-[40px] self-center'} />
              <div className="flex flex-col items-center justify-center font-bold">
                <img
                  width="150"
                  height="75"
                  src={nextPrestige.image}
                  alt="credit"
                />
                {nextPrestige.name}
              </div>
            </>
          )}
        </div>
        <h3 className="text-center text-xl self-center relative text-white flex flex-col mt-5">
          {nextPrestige ? 'Next Prestige Boost !' : 'Max Prestige Boost !'}
        </h3>
        <div className="flex items-center content-center justify-center font-bold mb-5">
          {currentPrestige ? (
            <p className="text-xl">
              {`x${decimalToHumanReadable(
                currentPrestige.prestige.moneyMult,
                true,
              )}`}
            </p>
          ) : (
            <p className="text-xl">x1</p>
          )}
          {nextPrestige && (
            <>
              <ArrowPrestige className={'w-[100px] self-center px-5'} />
              <p className="text-xl">{`x${decimalToHumanReadable(
                nextPrestige.moneyMult,
                true,
              )}`}</p>
            </>
          )}
        </div>
        {nextPrestige && (
          <div className="flex justify-center p-5 pt-0">
            <Button
              onClick={() => {
                buyPrestige(nextPrestige.id);
              }}
              disabled={balance.lt(nextPrestige.price)}
            >
              <p className="text-3xl">
                {decimalToHumanReadable(nextPrestige.price, true)} Buy
              </p>
            </Button>
          </div>
        )}
      </div>
      <PassPrestigeAnimation
        passPrestigeAnimation={passPrestigeAnimation}
        setPassPrestigeAnimation={setPassPrestigeAnimation}
      />
    </section>
  );
}
