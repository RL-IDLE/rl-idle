import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { env } from '@/env';

export default function BoostAnimation({
  close,
  children,
}: {
  close: () => void;
  children: React.ReactNode;
}) {
  const playSound = (audio: HTMLAudioElement) => {
    audio.currentTime = 0;
    audio.play();
  };

  useEffect(() => {
    const audio = new Audio(
      env.VITE_API_URL + '/public/emeralds/after-pay.ogg',
    );
    audio.volume = 0.5;

    const tId = setTimeout(() => {
      playSound(audio);
    }, 730);

    return () => {
      audio.remove();
      clearTimeout(tId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 z-50 w-full h-full bg-black/80 flex items-center justify-center',
      )}
      onClick={() => close()}
    >
      <div className="rounded-xl p-5 flex flex-col items-center rounded-t-2xl overflow-hidden text-white">
        <div className="flex flex-col animate-prestigeIn items-center opacity-0">
          {children}
        </div>
        <p className="absolute bottom-3 text-xl text-white/70">
          Touch to close
        </p>
      </div>
    </div>
  );
}
