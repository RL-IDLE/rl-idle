import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { router } from '../lib/api';
import Decimal from 'break_infinity.js';
import { logger } from '../lib/logger';
import { useUserStore } from './user.store';
import { socket } from '../lib/socket';
import { IWsEvent } from '../../../backend/src/types/api';

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
            const eventBody: IWsEvent['click']['body'] = {
              type: 'click',
              userId: user.id,
            };
            socket.emit('events', eventBody);
          });
        },
        loadUser: async () => {
          const id = get().id;
          //? Load the user
          const user = await router.user
            .load({
              id: id ?? undefined,
            })
            .catch(async (err) => {
              if (
                'message' in err.json &&
                err.json.message === 'User not found'
              ) {
                return await router.user.load({}).catch(() => null);
              }
              logger.error(err);
              return null;
            });
          if (!user) return;
          //? Save the user id to local storage if it's not already set
          localStorage.setItem('userId', user.id);
          set({ id: user.id });
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
