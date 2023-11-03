import { useGameStore } from '@/contexts/game.store';
import { useUserStore } from '@/contexts/user.store';
import { env } from '@/env';
import styles from './home.module.scss';
import { decimalToHumanReadable } from '@/lib/bignumber';
import clickSound from '@/assets/audio/click.ogg';
import { getUserMoneyPerClick } from '@/lib/game';
import { useEffect, useState } from 'react';
import Parameters from './Parameters';

export default function Home() {
  const click = useGameStore((state) => state.actions.click);
  const itemsBought = useUserStore((state) => state.user?.itemsBought);
  const moneyPerClick = useUserStore((state) => state.user?.moneyPerClick);
  const prestigesBought = useUserStore((state) => state.user?.prestigesBought);

  const itemsTab = (itemsBought ?? []).map((item) => {
    return {
      id: item.item.id,
      moneyPerSecond: item.item.moneyPerSecond,
      image: item.item.image,
    };
  });
  itemsTab.sort((a, b) => {
    if (a.moneyPerSecond.gt(b.moneyPerSecond)) return -1;
    if (a.moneyPerSecond.lt(b.moneyPerSecond)) return 1;
    return 0;
  });

  const [audio, setAudio] = useState<HTMLAudioElement>();

  useEffect(() => {
    const newAudio = new Audio(clickSound);
    setAudio(newAudio);
    return () => {
      newAudio.remove();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    click();
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }

    const xAlea = Math.floor(Math.random() * 25);
    const x = e.clientX - xAlea;
    const y = e.clientY - 30;
    const mouse = document.createElement('div');
    mouse.classList.add(styles.mouse);
    mouse.innerHTML =
      '+' +
      decimalToHumanReadable(
        getUserMoneyPerClick(
          moneyPerClick && prestigesBought
            ? {
                moneyPerClick,
                prestigesBought,
              }
            : null,
        ),
      );
    mouse.style.top = y + 'px';
    mouse.style.left = x + 'px';
    mouse.style.whiteSpace = 'nowrap';
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
          src={
            itemsTab.length > 0
              ? itemsTab[0].image
              : env.VITE_API_URL + '/public/cars/endo--blue.png'
          }
          alt="rocket battle car image"
        />
      </button>
      <Parameters />
    </section>
  );
}
