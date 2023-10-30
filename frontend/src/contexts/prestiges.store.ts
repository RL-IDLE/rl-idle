import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { router } from '@/lib/api';
import Decimal from 'break_infinity.js';
import { IPrestige } from '@/types/prestige';

interface PrestigeState {
  prestiges: IPrestige[];
  setPrestiges: (prestiges: IPrestige[]) => void;
  loadPrestige: () => Promise<void>;
}

export const usePrestigeStore = create<PrestigeState>()(
  devtools(
    persist(
      immer((set) => ({
        prestiges: [],
        setPrestiges: (prestiges) => {
          set({ prestiges });
        },
        loadPrestige: async () => {
          const prestiges = await router.prestiges.findAll(undefined);
          const prestigesMapped = prestiges.map((prestige) => ({
            id: prestige.id,
            name: prestige.name,
            price: Decimal.fromString(prestige.price),
            moneyMult: Decimal.fromString(prestige.moneyMult),
            image: prestige.image,
          }));
          set({ prestiges: prestigesMapped });
        },
      })),
      {
        name: 'prestiges',
        version: 1,
        merge: (_, persisted) => {
          return {
            ...persisted,
            prestiges: persisted.prestiges.map((prestige) => ({
              ...prestige,
              price: Decimal.fromString(prestige.price as unknown as string),
              moneyMult: Decimal.fromString(
                prestige.moneyMult as unknown as string,
              ),
            })),
          };
        },
      },
    ),
  ),
);
