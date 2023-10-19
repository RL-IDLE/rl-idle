import { useGameStore } from '@/contexts/game.store';
import { env } from '@/env';
import Balance from '../balance';

export default function Home() {
  const click = useGameStore((state) => state.actions.click);

  const handleClick = () => {
    click();
  };

  return (
    <section>
      <Balance />
      <button onClick={handleClick}>
        <img
          src={env.VITE_API_URL + '/public/cars/animus-gp--blue.png'}
          alt="animus-gp--blue"
        />
      </button>
    </section>
  );
}
