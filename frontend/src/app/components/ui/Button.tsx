import { env } from '@/env';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  noStyle?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className,
  noStyle,
  ...rest
}: ButtonProps) {
  const [audio, setAudio] = useState<HTMLAudioElement>();

  useEffect(() => {
    const newAudio = new Audio(
      env.VITE_API_URL + '/public/ui/SFX_UI_MainMenu_0003.ogg',
    );
    setAudio(newAudio);
    return () => {
      newAudio.remove();
    };
  }, []);

  return (
    <button
      className={
        !noStyle
          ? cn(
              'px-4 py-2 rounded-lg bg-background text-white transition-all duration-200',
              'hover:bg-gradient-light',
              'disabled:bg-background/70 disabled:cursor-not-allowed',
              className,
            )
          : className
      }
      {...rest}
      onClick={(e) => {
        if (audio) {
          audio.currentTime = 0;
          audio.play();
        }
        rest.onClick && rest.onClick(e);
      }}
    >
      {children}
    </button>
  );
}
