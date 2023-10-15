import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { IUser } from '../types/user';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';

interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,
        setUser: (user) => {
          set({ user });
        },
      })),
      {
        name: 'user',
      },
    ),
  ),
);
