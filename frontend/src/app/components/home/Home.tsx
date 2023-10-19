import { useGameStore } from '@/contexts/game.store';
import { useUserStore } from '@/contexts/user.store';
import { env } from '@/env';
import Balance from '../balance';
import styles from './home.module.scss';

export default function Home() {
  const click = useGameStore((state) => state.actions.click);
  const user = useUserStore((state) => state.user);

  const handleClick = (e: any) => {
    click();

    let xAlea = Math.floor(Math.random() * 25);
    let x = e.clientX - xAlea;
    let y = e.clientY - 30;
    let mouse = document.createElement('div');
    mouse.classList.add(styles.mouse);
    mouse.innerHTML = "+" + user?.moneyPerClick;
    mouse.style.top = y + 'px';
    mouse.style.left = x + 'px';
    document.body.appendChild(mouse);
    setTimeout(() => {
      mouse.remove();
    }, 1000);

  };

  return (
    <section>
      <Balance />
      <button
        onClick={e => handleClick(e)}
        className='active:scale-[0.99]'
      >
        <img
          src={env.VITE_API_URL + '/public/cars/animus-gp--blue.png'}
          alt="animus-gp--blue"
        />
      </button>
    </section>
  );
}
