import { useGameStore } from '@/contexts/game.store';
import { env } from '@/env';
import Balance from '../balance';
import styles from './home.module.scss';

export default function Home() {
  const click = useGameStore((state) => state.actions.click);

  const handleClick = (e: any) => {
    click();
    e.target.classList.add(styles.active);
    setTimeout(() => {
      e.target.classList.remove(styles.active);
    }, 1000);
    //ajouter +1 sur le position de la souris
    let xAlea = Math.floor(Math.random() * 25);
    let x = e.clientX - xAlea;
    let y = e.clientY - 30;
    let mouse = document.createElement('div');
    mouse.classList.add(styles.mouse);
    mouse.innerHTML = '+1';
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
      >
        <img
          src={env.VITE_API_URL + '/public/cars/animus-gp--blue.png'}
          alt="animus-gp--blue"
        />
      </button>
    </section>
  );
}
