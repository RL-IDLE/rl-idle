import { socket } from '@/lib/socket';
import { useEffect } from 'react';
// import emeraldImage from "@/assets/Esports_Tokens_icon.webp"
import tokenImage from '@/assets/credits_icon.webp';
import { useUserStore } from '@/contexts/user.store';
import { getMoneyFromInvestmentsPerSeconds } from '@/lib/game';
import { decimalToHumanReadable } from '@/lib/bignumber';

export default function RandomBoost() {
  const addTokenBonus = useUserStore((state) => state.addTokenBonus);

  const handleMoneyBonus = (data: string) => {
    const json: {
      id: string;
      xPos: number;
    } = JSON.parse(data);

    const user = useUserStore.getState().user;
    if (!user) return;
    const moneyPerSecond = getMoneyFromInvestmentsPerSeconds(user);
    const moneyPerClick = user.moneyPerClick;

    //? Append to DOM
    const bonusElement = document.createElement('button');
    bonusElement.style.background = 'url(' + tokenImage + ')';
    bonusElement.style.backgroundSize = 'cover';
    bonusElement.style.transition = 'all linear 5s';
    bonusElement.style.width = 'max-content';
    bonusElement.style.minWidth = '55px';
    bonusElement.style.height = '55px';
    bonusElement.style.position = 'fixed';
    bonusElement.style.left = json.xPos * 100 + '%';
    bonusElement.style.top = '-55px';
    bonusElement.style.color = 'white';
    // bonusElement.style.animation = '20s linear slideBottom forwards';
    let i = 0;
    const it = setInterval(() => {
      bonusElement.style.top = `calc(-55px + ${i * 50}vh)`;
      i++;
    }, 5000);
    bonusElement.style.zIndex = '99999';
    document.body.appendChild(bonusElement);
    setTimeout(() => {
      try {
        clearInterval(it);
        bonusElement.remove();
      } catch (_) {
        //
      }
    }, 35000);

    const handleClick = () => {
      const value = moneyPerSecond.add(moneyPerClick.mul('5')).mul('20');
      addTokenBonus(json.id, value);
      bonusElement.style.animation = '.3s linear popOff forwards';
      bonusElement.innerHTML = '+' + decimalToHumanReadable(value);
      bonusElement.style.background = '';
      //? Remove clickhandle
      bonusElement.style.pointerEvents = 'none';
      clearInterval(it);
    };
    bonusElement.onpointerdown = handleClick;
  };

  useEffect(() => {
    socket.on('bonus:money', handleMoneyBonus);

    return () => {
      socket.off('bonus:money', handleMoneyBonus);
    };
  }, []);

  return <></>;
}
