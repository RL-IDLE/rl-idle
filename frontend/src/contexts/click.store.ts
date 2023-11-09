import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

interface ClickState {
  clicks: {
    date: Date;
  }[];
  addClick: (click: { date: Date }) => void;
  getLast5SecondsClicks: () => number;
  isFullBoost: boolean;
  setFullBoost: (fullBoost: boolean) => void;
}
let timeout: NodeJS.Timeout;

export const useClickStore = create<ClickState>()(
  devtools(
    immer((set, get) => ({
      clicks: [],
      addClick: (click) => {
        clearTimeout(timeout);
        const clicks = get().clicks;
        //? Clear clicks older than 1 minute
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 60000);
        const clicksFiltered = clicks.filter(
          (click) => click.date >= oneMinuteAgo,
        );
        set({ clicks: [...clicksFiltered, click] });
        timeout = setTimeout(() => {
          const clicks = get().clicks;
          const now = new Date();
          const oneMinuteAgo = new Date(now.getTime() - 60000);
          const clicksFiltered = clicks.filter(
            (click) => click.date >= oneMinuteAgo,
          );
          set({ clicks: clicksFiltered });
        });
      },
      getLast5SecondsClicks: () => {
        const clicks = get().clicks;
        const now = new Date();
        const fiveSecondsAgo = new Date(now.getTime() - 5000);
        const clicksFiltered = clicks.filter(
          (click) => click.date >= fiveSecondsAgo,
        );
        return clicksFiltered.length;
      },
      isFullBoost: false,
      setFullBoost: (fullBoost) => {
        set({ isFullBoost: fullBoost });
      },
    })),
  ),
);
