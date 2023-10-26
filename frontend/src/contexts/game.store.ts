import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { useUserStore } from './user.store';
import { useItemsStore } from './items.store';
import { usePrestigeStore } from './prestiges.store';

interface GameState {
  id: string | null;
  actions: {
    click: () => void;
    buyItem: (id: string) => void;
    buyPrestige: (id: string) => void;
    loadUser: () => Promise<void>;
    loadShop: () => Promise<void>;
    loadPrestige: () => Promise<void>;
  };
}

export const useGameStore = create<GameState>()(
  devtools(
    immer((set) => ({
      id: localStorage.getItem('userId'),
      user: null,
      actions: {
        click: () => {
          const { click } = useUserStore.getState();
          click();
        },
        buyItem: (id: string) => {
          const { buyItem } = useUserStore.getState();
          buyItem(id);
        },
        buyPrestige: (id: string) => {
          const { buyPrestige } = useUserStore.getState();
          buyPrestige(id);
        },
        loadUser: async () => {
          const { loadUser } = useUserStore.getState();
          const id = await loadUser();
          if (!id) return;
          set({ id });
        },
        loadShop: async () => {
          const { loadItems } = useItemsStore.getState();
          await loadItems();
        },
        loadPrestige: async () => {
          const { loadPrestige } = usePrestigeStore.getState();
          await loadPrestige();
        },
      },
    })),
  ),
);
