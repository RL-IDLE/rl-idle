import { create } from 'zustand';
import type {} from '@redux-devtools/extension'; // required for devtools typing
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { IUser } from '@/types/user';
import { logger } from '@/lib/logger';
import { router } from '@/lib/api';
import Decimal from 'break_infinity.js';
import { socket } from '@/lib/socket';
import { IWsEvent } from '../../../backend/src/types/api';
import { useItemsStore } from './items.store';
import { getPriceForClickItem, getPriceOfItem } from '@/lib/game';

type IUserOrNull = IUser | null;
interface UserState {
  user: IUserOrNull;
  click: () => void;
  buyItem: (id: string) => void;
  loadUser: () => Promise<string | undefined>;
  reset: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set, get) => ({
        user: null,
        click() {
          set((state) => {
            const user = state.user;
            if (!user) return;
            logger.debug('click');
            user.moneyFromClick = user.moneyFromClick.add(user.moneyPerClick);
            const eventBody: IWsEvent['click']['body'] = {
              type: 'click',
              userId: user.id,
            };
            socket.emit('events', eventBody);
          });
        },
        buyItem(id) {
          set((state) => {
            if (!state.user) {
              throw 'User not found';
            }
            const user = state.user;
            const items = useItemsStore.getState().items;
            const item = items.find((item) => item.id === id);
            if (!item) {
              throw 'Item not found';
            }
            logger.debug('buyItem');
            if (item.name === 'Click') {
              //? Update user moneyPerClick
              const userMoneyPerClick = user.moneyPerClick;
              const newUserMoneyPerClick = userMoneyPerClick.times(
                item.moneyPerClickMult,
              );
              user.moneyPerClick = newUserMoneyPerClick;
            }
            //* Mutate
            const itemsLevels: {
              [id: string]: Decimal | undefined;
            } = user.itemsBought.reduce<{
              [id: string]: Decimal;
            }>(
              (prev, cur) => {
                if (prev[cur.item.id] as Decimal | undefined) {
                  prev[cur.item.id] = prev[cur.item.id].add(
                    Decimal.fromString('1'),
                  );
                } else {
                  prev[cur.item.id] = Decimal.fromString('1');
                }
                return prev;
              },
              {} as {
                [id: string]: Decimal;
              },
            );
            const price =
              item.name === 'Click'
                ? getPriceForClickItem(
                    item.price,
                    itemsLevels[item.id] || Decimal.fromString('0'),
                  )
                : getPriceOfItem(
                    item.price,
                    itemsLevels[item.id] || Decimal.fromString('0'),
                  );
            user.moneyUsed = user.moneyUsed.add(price);
            user.itemsBought = [
              ...user.itemsBought,
              {
                id: Math.random().toString(),
                item: {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  moneyPerSecond: item.moneyPerSecond,
                  moneyPerClickMult: item.moneyPerClickMult,
                  image: item.image,
                },
                createdAt: new Date(),
              },
            ];
            const eventBody: IWsEvent['buyItem']['body'] = {
              type: 'buyItem',
              userId: user.id,
              itemId: item.id,
            };
            socket.emit('events', eventBody);
          });
        },
        async loadUser() {
          const id = localStorage.getItem('userId');
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
          //? Set the user
          set({
            user: {
              id: user.id,
              moneyFromClick: Decimal.fromString(user.moneyFromClick),
              moneyPerClick: Decimal.fromString(user.moneyPerClick),
              moneyUsed: Decimal.fromString(user.moneyUsed),
              itemsBought: user.itemsBought.map((itemBought) => ({
                id: itemBought.id,
                item: {
                  id: itemBought.item.id,
                  name: itemBought.item.name,
                  price: Decimal.fromString(itemBought.item.price),
                  moneyPerSecond: Decimal.fromString(
                    itemBought.item.moneyPerSecond,
                  ),
                  moneyPerClickMult: Decimal.fromString(
                    itemBought.item.moneyPerClickMult,
                  ),
                  image: itemBought.item.image,
                },
                createdAt: new Date(itemBought.createdAt),
              })),
            },
          });
          return user.id;
        },
        async reset() {
          const id = get().user?.id;
          if (!id) {
            logger.error('User not found');
            return;
          }
          const user = await router.user.reset({ id });
          //? Set the user
          set({
            user: {
              id: user.id,
              moneyFromClick: Decimal.fromString(user.moneyFromClick),
              moneyPerClick: Decimal.fromString(user.moneyPerClick),
              moneyUsed: Decimal.fromString(user.moneyUsed),
              itemsBought: user.itemsBought.map((itemBought) => ({
                id: itemBought.id,
                item: {
                  id: itemBought.item.id,
                  name: itemBought.item.name,
                  price: Decimal.fromString(itemBought.item.price),
                  moneyPerSecond: Decimal.fromString(
                    itemBought.item.moneyPerSecond,
                  ),
                  moneyPerClickMult: Decimal.fromString(
                    itemBought.item.moneyPerClickMult,
                  ),
                  image: itemBought.item.image,
                },
                createdAt: new Date(itemBought.createdAt),
              })),
            },
          });
          return;
        },
      })),
      {
        name: 'user',
        version: 1.12,
        merge: (_, persisted) => {
          return {
            ...persisted,
            user: persisted.user
              ? {
                  ...persisted.user,
                  moneyFromClick: Decimal.fromString(
                    persisted.user.moneyFromClick as unknown as string,
                  ),
                  moneyPerClick: Decimal.fromString(
                    persisted.user.moneyPerClick as unknown as string,
                  ),
                  moneyUsed: Decimal.fromString(
                    persisted.user.moneyUsed as unknown as string,
                  ),
                  itemsBought: persisted.user.itemsBought.map((itemBought) => ({
                    id: itemBought.id,
                    item: {
                      id: itemBought.item.id,
                      name: itemBought.item.name,
                      price: Decimal.fromString(
                        itemBought.item.price as unknown as string,
                      ),
                      moneyPerSecond: Decimal.fromString(
                        itemBought.item.moneyPerSecond as unknown as string,
                      ),
                      moneyPerClickMult: Decimal.fromString(
                        itemBought.item.moneyPerClickMult as unknown as string,
                      ),
                      image: itemBought.item.image,
                    },
                    createdAt: new Date(itemBought.createdAt),
                  })),
                }
              : null,
          };
        },
      },
    ),
  ),
);
