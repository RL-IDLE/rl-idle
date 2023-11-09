import { cn } from '@/lib/utils';
import { IPrestige } from '@/types/prestige';
import PassPrestigeAnimationPortal from './PassPrestigeAnimationPortal';
import { useEffect, useState } from 'react';
import { env } from '@/env';
import { decimalToHumanReadable } from '@/lib/bignumber';
import Decimal from 'break_infinity.js';
import unrankedIcon from '@/assets/Unranked_icon.webp';

export default function PassPrestigeAnimation({
  passPrestigeAnimation,
  setPassPrestigeAnimation,
}: {
  passPrestigeAnimation: {
    old: IPrestige | null;
    new: IPrestige | null;
  } | null;
  setPassPrestigeAnimation: (
    value: {
      old: IPrestige | null;
      new: IPrestige | null;
    } | null,
  ) => void;
}) {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  useEffect(() => {
    const newAudio = new Audio(
      env.VITE_API_URL + '/public/prestige/pass-prestige.ogg',
    );
    newAudio.volume = 0.5;
    setAudio(newAudio);
    return () => {
      newAudio.remove();
    };
  }, []);

  const [closable, setClosable] = useState(false);

  const playAudio = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  useEffect(() => {
    if (passPrestigeAnimation) {
      const timeout = setTimeout(() => {
        playAudio();
        setClosable(true);
      }, 730);
      return () => {
        clearTimeout(timeout);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passPrestigeAnimation]);

  return (
    passPrestigeAnimation && (
      <PassPrestigeAnimationPortal>
        <div
          className={cn(
            'absolute left-0 top-0 w-screen h-screen overflow-hidden z-50 animate-fadeIn bg-black/80 backdrop-blur-sm flex justify-center items-center text-white',
          )}
          onClick={() => {
            if (closable) setPassPrestigeAnimation(null);
          }}
        >
          <div
            className="absolute left-0 top-0 w-screen h-screen opacity-40 -z-[1]"
            style={{
              background:
                'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(31,51,88,0.7707457983193278) 89%, rgba(38,71,131,1) 98%)',
            }}
          ></div>
          <p className="absolute bottom-3 text-xl text-white/70">
            Touch to close
          </p>

          <div className="flex flex-col items-center justify-center gap-3 animate-prestigeOut">
            <div className="flex flex-col items-center justify-center">
              <img
                src={passPrestigeAnimation.old?.image ?? unrankedIcon}
                alt="old prestige"
                className="w-40 h-40"
              />
              <p className="text-2xl font-bold -mt-3">
                {passPrestigeAnimation.old?.name ?? 'Unranked'}
              </p>
            </div>
            <p className="text-4xl font-bold">{`x${decimalToHumanReadable(
              passPrestigeAnimation.old?.moneyMult || Decimal.fromString('1'),
              true,
            )}`}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 absolute m-auto animate-prestigeIn opacity-0">
            <div className="flex flex-col items-center justify-center">
              <img
                src={passPrestigeAnimation.new?.image}
                alt="old prestige"
                className="w-40 h-40"
              />
              <p className="text-2xl font-bold -mt-3">
                {passPrestigeAnimation.new?.name}
              </p>
            </div>
            <p className="text-4xl font-bold">{`x${decimalToHumanReadable(
              passPrestigeAnimation.new?.moneyMult || Decimal.fromString('1'),
              true,
            )}`}</p>
          </div>
        </div>
      </PassPrestigeAnimationPortal>
    )
  );
}
