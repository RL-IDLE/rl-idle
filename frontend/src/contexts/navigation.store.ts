import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { IPages } from '@/lib/navigation';

interface NavigationState {
  page: IPages;
  setPage: (page: IPages) => void;
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    persist(
      immer((set) => ({
        page: 'home',
        setPage: (page) => {
          set({ page });
        },
      })),
      {
        name: 'navigation',
      },
    ),
  ),
);
