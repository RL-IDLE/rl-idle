import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { useUserStore } from './user.store';
import { useItemsStore } from './items.store';
import { usePrestigeStore } from './prestiges.store';

interface GameState {
  actions: {
    click: () => void;
    buyItem: (id: string) => void;
    buyPrestige: (id: string) => void;
    loadUser: () => Promise<void>;
    loadShop: () => Promise<void>;
    loadPrestige: () => Promise<void>;
    reset: () => Promise<void>;
    give: (amount: string) => Promise<void>;
    remove: (amount: string) => Promise<void>;
    givePrestige: () => Promise<void>;
    removePrestige: () => Promise<void>;
    giveItem: (itemId: string) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
  };
}

export const useGameStore = create<GameState>()(
  devtools(
    immer(() => ({
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
          await loadUser();
        },
        loadShop: async () => {
          const { loadItems } = useItemsStore.getState();
          await loadItems();
        },
        loadPrestige: async () => {
          const { loadPrestige } = usePrestigeStore.getState();
          await loadPrestige();
        },

        /** TEST COMMANDS */
        reset: async () => {
          const { reset } = useUserStore.getState();
          await reset();
        },
        give: async (amount: string) => {
          const { give } = useUserStore.getState();
          await give(amount);
        },
        remove: async (amount: string) => {
          const { remove } = useUserStore.getState();
          await remove(amount);
        },
        givePrestige: async () => {
          const { givePrestige } = useUserStore.getState();
          await givePrestige();
        },
        removePrestige: async () => {
          const { removePrestige } = useUserStore.getState();
          await removePrestige();
        },
        giveItem: async (itemId: string) => {
          const { giveItem } = useUserStore.getState();
          await giveItem(itemId);
        },
        removeItem: async (itemId: string) => {
          const { removeItem } = useUserStore.getState();
          await removeItem(itemId);
        },
      },
    })),
  ),
);
