import { useGameStore } from '@/contexts/game.store';
import { usePrestigeStore } from '@/contexts/prestiges.store';
import { useUserStore } from '@/contexts/user.store';
import { decimalToHumanReadable } from '@/lib/bignumber';
import homeBgLarge from '../../../assets/home-bg-large.webp';
import unrankedIcon from '../../../assets/Unranked_icon.webp';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';
import { useBalance } from '@/contexts/balance/BalanceUtils';
import ArrowPrestige from '../icons/ArrowPrestige';

export default function Prestige() {
  const prestiges = usePrestigeStore((state) => state.prestiges);
  const buyPrestige = useGameStore((state) => state.actions.buyPrestige);
  const prestigesBought = useUserStore((state) => state.user?.prestigesBought);
  const { balance } = useBalance();

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
          'justify-between rounded-t-2xl overflow-hidden border-2 border-[#245184] bg-gradient-to-t from-[#111429] to-[#1F3358] text-white m-10',
        )}
      >
        <h2 className="text-4xl text-center relative text-white flex flex-col p-5">
          Prestige !
        </h2>
        <div className="flex">
          {currentPrestige ? (
            <img
              width="150"
              height="75"
              src={currentPrestige.prestige.image}
              alt="credit"
            />
          ) : (
            <img width="150" height="75" src={unrankedIcon} alt="credit" />
          )}
          {nextPrestige && (
            <>
              <ArrowPrestige className={'w-[100px] self-center'} />
              <img
                width="150"
                height="75"
                src={nextPrestige.image}
                alt="credit"
              />
            </>
          )}
        </div>
        <h3 className="text-center text-xl self-center relative text-white flex flex-col mt-5">
          {nextPrestige ? 'Next Prestige Boost !' : 'Max Prestige Boost !'}
        </h3>
        <div className="flex items-center content-center justify-center">
          {currentPrestige ? (
            <p className="text-4xl">
              {decimalToHumanReadable(currentPrestige.prestige.moneyMult)}
            </p>
          ) : (
            <p className="text-4xl">x1</p>
          )}
          {nextPrestige && (
            <>
              <ArrowPrestige className={'w-[100px] self-center px-5'} />
              <p className="text-4xl">{`x${decimalToHumanReadable(
                nextPrestige.moneyMult,
              )}`}</p>
            </>
          )}
        </div>
        {nextPrestige && (
          <div className="flex justify-center p-5">
            <Button
              onClick={() => {
                buyPrestige(nextPrestige.id);
              }}
              disabled={balance.lt(nextPrestige.price)}
            >
              <p className="text-3xl">
                {decimalToHumanReadable(nextPrestige.price)} Buy
              </p>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
