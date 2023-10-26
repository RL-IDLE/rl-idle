import { useGameStore } from '@/contexts/game.store';
import { usePrestigeStore } from '@/contexts/prestiges.store';
import { useUserStore } from '@/contexts/user.store';
import { decimalToHumanReadable } from '@/lib/bignumber';
import homeBgLarge from '../../../assets/home-bg-large.webp';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';
import { useBalance } from '@/contexts/BalanceContext';

export default function Prestige() {
  const prestiges = usePrestigeStore((state) => state.prestiges);
  const buyPrestige = useGameStore((state) => state.actions.buyPrestige);
  const prestigesBought = useUserStore((state) => state.user?.prestigesBought);
  const { balance } = useBalance();

  const pSorted = prestiges.sort((a, b) => {
    if (a.moneyMult.greaterThan(b.moneyMult)) return 1;
    if (a.moneyMult.lessThan(b.moneyMult)) return -1;
    return 0;
  });

  const pbSorted =
    prestigesBought?.sort((a, b) => {
      if (a.prestige.moneyMult.greaterThan(b.prestige.moneyMult)) return 1;
      if (a.prestige.moneyMult.lessThan(b.prestige.moneyMult)) return -1;
      return 0;
    }) || null;

  const currentPrestige = pbSorted?.[0] || null;
  const currentPrestigeIndex = pSorted.findIndex(
    (prestige) => prestige.id === currentPrestige?.prestige.id,
  );
  const nextPrestige =
    currentPrestigeIndex === pSorted.length - 1
      ? null
      : pSorted[currentPrestigeIndex + 1];

  return (
    <section className="flex flex-col h-full mt-32 pb-28">
      <img
        src={homeBgLarge}
        alt="background"
        className={cn(
          'absolute left-0 top-0 h-screen object-cover visible min-w-[500vw] -z-[1]',
        )}
      />
      {currentPrestige && (
        <div>
          <h2>Current prestige</h2>
          <p>name: {currentPrestige.prestige.name}</p>
          <p>
            moneyMult:{' '}
            {decimalToHumanReadable(currentPrestige.prestige.moneyMult)}
          </p>
          <p>price: {decimalToHumanReadable(currentPrestige.prestige.price)}</p>
        </div>
      )}
      {nextPrestige && (
        <div>
          <h2>Next prestige</h2>
          <p>name: {nextPrestige.name}</p>
          <p>moneyMult: {decimalToHumanReadable(nextPrestige.moneyMult)}</p>
          <p>price: {decimalToHumanReadable(nextPrestige.price)}</p>
          <Button
            onClick={() => {
              buyPrestige(nextPrestige.id);
            }}
            disabled={balance.lt(nextPrestige.price)}
          >
            Buy
          </Button>
        </div>
      )}
    </section>
  );
}
