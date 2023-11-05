import { useGameStore } from '@/contexts/game.store';
import { useUserStore } from '@/contexts/user.store';
import { env } from '@/env';
import styles from './home.module.scss';
import { decimalToHumanReadable } from '@/lib/bignumber';
import { getUserMoneyPerClick } from '@/lib/game';
import { MouseEvent, TouchEvent, useEffect, useState } from 'react';
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
      url: item.item.url,
      kind: item.item.kind,
    };
  });
  itemsTab.sort((a, b) => {
    if (a.moneyPerSecond.gt(b.moneyPerSecond)) return -1;
    if (a.moneyPerSecond.lt(b.moneyPerSecond)) return 1;
    return 0;
  });
  const firstCar = itemsTab.find((item) => item.kind === 'car');
  const firstBoost = itemsTab.find((item) => item.kind === 'boost');

  const [audio, setAudio] = useState<{
    audio: HTMLAudioElement;
    url: string;
  }>();

  useEffect(() => {
    const url =
      firstBoost?.url ??
      env.VITE_API_URL + '/public/boosts/SFX_Boost_2d_Smoke_0001.ogg';
    if (audio?.url === url) return;
    const newAudio = new Audio(url);
    newAudio.volume = 0.3;
    setAudio({ audio: newAudio, url });
    return () => {
      newAudio.remove();
    };
  }, [firstBoost, audio]);

  const handleClick = (
    e: TouchEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    click();
    if (audio) {
      audio.audio.currentTime = 0;
      audio.audio.play();
    }

    const xAlea = Math.floor(Math.random() * 25);
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - xAlea;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - 30;
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
        onPointerDown={(e) => handleClick(e)}
        className="active:scale-[0.97] no-highlight"
      >
        <img
          src={
            itemsTab.length > 0
              ? firstCar?.url
              : env.VITE_API_URL + '/public/cars/endo--blue.png'
          }
          alt="rocket battle car image"
        />
      </button>
      <Parameters />
    </section>
  );
}
