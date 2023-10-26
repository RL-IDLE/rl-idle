import { useGameStore } from '@/contexts/game.store';
import { usePrestigeStore } from '@/contexts/prestiges.store';
import { useUserStore } from '@/contexts/user.store';

export default function Prestige() {
  const prestiges = usePrestigeStore((state) => state.prestiges);
  const buyPrestige = useGameStore((state) => state.actions.buyPrestige);
  const prestigesBought = useUserStore((state) => state.user?.prestigesBought);

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
    <section className="flex flex-col h-full">
      {currentPrestige && (
        <div>
          <h2>Current prestige</h2>
          <p>name: {currentPrestige.prestige.name}</p>
          <p>moneyMult: {currentPrestige.prestige.moneyMult.toString()}</p>
          <p>price: {currentPrestige.prestige.price}</p>
        </div>
      )}
      <div>
        <h2>Next Prestige</h2>
        <p>{nextPrestige?.image}</p>
        <p>next moneyMult : {nextPrestige?.moneyMult.toString()}</p>
        <p>price : {nextPrestige?.image}</p>
      </div>
    </section>
  );
}
