import { useGameStore } from '../../contexts/game.store';
import { useUserStore } from '../../contexts/user.store';
import { env } from '../../env';

export default function Game() {
  const click = useGameStore((state) => state.actions.click);
  const money = useUserStore((state) => state.user?.money);

  const handleClick = () => {
    click();
  };

  return (
    <main>
      <h2>{money?.toString()}</h2>
      <button onClick={handleClick}>
        <img
          src={env.VITE_API_URL + '/public/cars/animus-gp--blue.png'}
          alt="animus-gp--blue"
        />
      </button>
    </main>
  );
}
