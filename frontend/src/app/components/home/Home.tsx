import { useGameStore } from '@/contexts/game.store';
import { useUserStore } from '@/contexts/user.store';
import { env } from '@/env';
import styles from './home.module.scss';
import { decimalToHumanReadable } from '@/lib/bignumber';
import clickSound from '@/assets/audio/click.ogg';
import { getUserMoneyPerClick } from '@/lib/game';
import { useState } from 'react';

export default function Home() {
  const click = useGameStore((state) => state.actions.click);
  const user = useUserStore((state) => state.user);
  const [audio] = useState(new Audio(clickSound));

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    click();
    audio.currentTime = 0;
    audio.play();

    const xAlea = Math.floor(Math.random() * 25);
    const x = e.clientX - xAlea;
    const y = e.clientY - 30;
    const mouse = document.createElement('div');
    mouse.classList.add(styles.mouse);
    mouse.innerHTML = '+' + decimalToHumanReadable(getUserMoneyPerClick(user));
    mouse.style.top = y + 'px';
    mouse.style.left = x + 'px';
    document.body.appendChild(mouse);
    setTimeout(() => {
      mouse.remove();
    }, 1000);
  };

  return (
    <section className={styles.home}>
      <button
        onClick={(e) => handleClick(e)}
        className="active:scale-[0.97] no-highlight"
      >
        <img
          src={env.VITE_API_URL + '/public/cars/animus-gp--blue.png'}
          alt="animus-gp--blue"
        />
      </button>
    </section>
  );
}
