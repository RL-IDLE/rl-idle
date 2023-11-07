import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { IItem } from '@/types/item';
import { router } from '@/lib/api';
import Decimal from 'break_infinity.js';

interface ItemsState {
  items: IItem[];
  setItems: (items: IItem[]) => void;
  loadItems: () => Promise<void>;
}

export const useItemsStore = create<ItemsState>()(
  devtools(
    persist(
      immer((set) => ({
        items: [],
        setItems: (items) => {
          set({ items });
        },
        loadItems: async () => {
          const items = await router.items.findAll(undefined);
          const itemsMapped = items.map((item) => ({
            id: item.id,
            name: item.name,
            price: Decimal.fromString(item.price),
            moneyPerSecond: Decimal.fromString(item.moneyPerSecond),
            moneyPerClickMult: Decimal.fromString(item.moneyPerClickMult),
            image: item.image,
          }));
          set({ items: itemsMapped });
        },
      })),
      {
        name: 'items',
        version: 1.1,
        merge: (_, persisted) => {
          return {
            ...persisted,
            items: persisted.items.map((item) => ({
              ...item,
              price: Decimal.fromString(item.price as unknown as string),
              moneyPerSecond: Decimal.fromString(
                item.moneyPerSecond as unknown as string,
              ),
              moneyPerClickMult: Decimal.fromString(
                item.moneyPerClickMult as unknown as string,
              ),
            })),
          };
        },
      },
    ),
  ),
);
