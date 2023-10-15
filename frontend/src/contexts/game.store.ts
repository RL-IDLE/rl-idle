import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { router } from '../lib/api';
import Decimal from 'break_infinity.js';
import { logger } from '../lib/logger';
import { useUserStore } from './user.store';

interface GameState {
  id: string | null;
  actions: {
    click: () => void;
    loadUser: () => Promise<void>;
  };
}

export const useGameStore = create<GameState>()(
  devtools(
    immer((set, get) => ({
      id: localStorage.getItem('userId'),
      user: null,
      actions: {
        click: () => {
          set(() => {
            const { user, setUser } = useUserStore.getState();
            if (!user) return;
            logger.debug('click', user);
            user.money = user.money.add(user.moneyPerClick);
            setUser(user);
          });
        },
        loadUser: async () => {
          const id = get().id;
          //? Load the user
          const user = await router.user.load({
            id: id ?? undefined,
          });
          //? Save the user id to local storage if it's not already set
          if (!id) {
            localStorage.setItem('userId', user.id);
            set({ id: user.id });
          }
          //? Set the user
          const { setUser } = useUserStore.getState();
          setUser({
            id: user.id,
            money: Decimal.fromString(user.money),
            moneyPerClick: Decimal.fromString(user.moneyPerClick),
          });
        },
      },
    })),
  ),
);
