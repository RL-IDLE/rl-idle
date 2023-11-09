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
import { usePrestigeStore } from './prestiges.store';
import {
  getPriceForClickItem,
  getPriceOfItem,
  getUserMoneyPerClick,
} from '@/lib/game';
import {
  clickRefreshInterval,
  clickWsRefreshInterval,
  fullBoostMultiplier,
  fullBoostNumberOfClicks,
} from '@/lib/constant';
import { useClickStore } from './click.store';

let lastClick: Date | null = null;
let clickBuffer: Decimal = Decimal.fromString('0');
let clickBufferTimeout: NodeJS.Timeout | null = null;
let lastWs: Date | null = null;
let wsBuffer: Decimal = Decimal.fromString('0');
let wsBufferTimeout: NodeJS.Timeout | null = null;

interface UserState {
  user: IUser | null;

  click: () => void;
  buyItem: (id: string) => void;
  buyPrestige: (id: string) => void;
  loadUser: () => Promise<string | undefined>;
  addTokenBonus: (id: string, amount: Decimal) => Promise<void>;
  addEmeraldBonus: (id: string, amount: Decimal) => Promise<void>;

  /** TEST COMMANDS */
  reset: () => Promise<void>;
  give: (amount: string) => Promise<void>;
  remove: (amount: string) => Promise<void>;
  givePrestige: () => Promise<void>;
  removePrestige: () => Promise<void>;
  giveItem: (itemId: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      immer((set, get) => ({
        user: null,
        click() {
          useClickStore.getState().addClick({ date: new Date() });
          const getLast5SecondsClicks =
            useClickStore.getState().getLast5SecondsClicks;
          const isFullBoost = useClickStore.getState().isFullBoost;
          if (clickBufferTimeout) {
            clearTimeout(clickBufferTimeout);
          }
          //? If lastClick is too recent (less than 0.1s), return
          const timeDiff = lastClick ? Date.now() - lastClick.getTime() : null;
          const perSecond = getLast5SecondsClicks() / 5;
          let realPercentage = perSecond / fullBoostNumberOfClicks;
          if (realPercentage > 1) realPercentage = 1;
          const multiplicator = isFullBoost
            ? fullBoostMultiplier
            : Math.floor(1 + realPercentage * 4);
          clickBuffer = clickBuffer.add(
            Decimal.fromString('1').times(multiplicator),
          );
          clickBufferTimeout = setTimeout(
            () => {
              //? Update lastClick
              set((state) => {
                lastClick = new Date();
                const user = state.user;
                if (!user) return;
                logger.debug('click');
                user.moneyFromClick = user.moneyFromClick.add(
                  getUserMoneyPerClick(user, false).times(clickBuffer),
                );
                if (wsBufferTimeout) {
                  clearTimeout(wsBufferTimeout);
                }
                const wsTimeDiff = lastWs
                  ? Date.now() - lastWs.getTime()
                  : null;
                const userId = user.id;
                wsBuffer = wsBuffer.add(clickBuffer);
                wsBufferTimeout = setTimeout(
                  () => {
                    lastWs = new Date();
                    //? Send event to server
                    const eventBody: IWsEvent['click']['body'] = {
                      type: 'click',
                      userId: userId,
                      times: wsBuffer.toString(),
                    };
                    wsBuffer = Decimal.fromString('0');
                    socket.emit('events', eventBody);
                  },
                  wsTimeDiff ? clickWsRefreshInterval - wsTimeDiff : 0,
                );
                clickBuffer = Decimal.fromString('0');
              });
            },
            timeDiff ? clickRefreshInterval - timeDiff : 0,
          );
        },
        buyItem(id) {
          set((state) => {
            const user = state.user;
            if (!user) {
              logger.error('User not found');
              return;
            }
            const items = useItemsStore.getState().items;
            const item = items.find((item) => item.id === id);
            if (!item) {
              logger.error('Item not found');
              return;
            }
            logger.debug('buyItem');
            //* Mutate
            if (item.name === 'Click') {
              //? Update user moneyPerClick
              const userMoneyPerClick = user.moneyPerClick;
              const newUserMoneyPerClick = userMoneyPerClick.times(
                item.moneyPerClickMult,
              );
              user.moneyPerClick = newUserMoneyPerClick;
            }
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
            const now = new Date();
            user.itemsBought.push({
              id: Math.random().toString(),
              item: {
                id: item.id,
                name: item.name,
                price: item.price,
                moneyPerSecond: item.moneyPerSecond,
                moneyPerClickMult: item.moneyPerClickMult,
                url: item.url,
                kind: item.kind,
              },
              createdAt: now,
            });
            const eventBody: IWsEvent['buyItem']['body'] = {
              type: 'buyItem',
              userId: user.id,
              itemId: item.id,
              createdAt: now.toISOString(),
            };
            socket.emit('events', eventBody);
          });
        },
        buyPrestige(id) {
          set((state) => {
            const user = state.user;
            if (!user) {
              logger.error('User not found');
              return;
            }
            const prestiges = usePrestigeStore.getState().prestiges;
            const prestige = prestiges.find((item) => item.id === id);
            if (!prestige) {
              logger.error('Prestige not found');
              return;
            }
            logger.debug('buyPrestige !');
            //* Mutate
            user.moneyUsed = user.moneyUsed.add(prestige.price);
            user.prestigesBought.push({
              id: Math.random().toString(),
              prestige: {
                id: prestige.id,
                name: prestige.name,
                price: prestige.price,
                moneyMult: prestige.moneyMult,
                image: prestige.image,
              },
              createdAt: new Date(),
            });
            user.moneyFromClick = Decimal.fromString('0');
            user.moneyPerClick = Decimal.fromString('1');
            user.moneyUsed = Decimal.fromString('0');
            user.itemsBought = [];
            const eventBody: IWsEvent['buyPrestige']['body'] = {
              type: 'buyPrestige',
              userId: user.id,
              prestigeId: prestige.id,
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
          //? Save lastSeen in local storage
          localStorage.setItem(
            'lastBalanceTime',
            new Date(user.lastSeen).getTime().toString(),
          );
          //? Set the user
          set({
            user: {
              id: user.id,
              username: user.username,
              moneyFromClick: Decimal.fromString(user.moneyFromClick),
              moneyPerClick: Decimal.fromString(user.moneyPerClick),
              moneyUsed: Decimal.fromString(user.moneyUsed),
              emeralds: Decimal.fromString(user.emeralds),
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
                  url: itemBought.item.url,
                  kind: itemBought.item.kind,
                },
                createdAt: new Date(itemBought.createdAt),
              })),
              prestigesBought: user.prestigesBought.map((prestigeBought) => ({
                id: prestigeBought.id,
                prestige: {
                  id: prestigeBought.prestige.id,
                  name: prestigeBought.prestige.name,
                  price: Decimal.fromString(prestigeBought.prestige.price),
                  moneyMult: Decimal.fromString(
                    prestigeBought.prestige.moneyMult,
                  ),
                  image: prestigeBought.prestige.image,
                },
                createdAt: new Date(prestigeBought.createdAt),
              })),
              latestBalance: Decimal.fromString(user.latestBalance),
            },
          });
          return user.id;
        },
        async addTokenBonus(id: string, amount: Decimal) {
          set((state) => {
            const user = state.user;
            if (!user) {
              logger.error('User not found');
              return;
            }
            user.moneyFromClick = user.moneyFromClick.add(amount);

            const eventBody: IWsEvent['addTokenBonus']['body'] = {
              userId: user.id,
              id,
              type: 'addTokenBonus',
            };
            socket.emit('events', eventBody);
          });
        },
        async addEmeraldBonus(id: string, amount: Decimal) {
          set((state) => {
            const user = state.user;
            if (!user) {
              logger.error('User not found');
              return;
            }
            user.emeralds = user.emeralds.add(amount);

            const eventBody: IWsEvent['addEmeraldBonus']['body'] = {
              userId: user.id,
              id,
              type: 'addEmeraldBonus',
            };
            socket.emit('events', eventBody);
          });
        },
        async reset() {
          const oldUser = get().user;
          const id = oldUser?.id;
          if (!id) {
            logger.error('User not found');
            return;
          }
          const user = await router.user.reset({ id });
          //? Set the user
          set({
            user: {
              id: user.id,
              username: user.username,
              moneyFromClick: Decimal.fromString(user.moneyFromClick),
              moneyPerClick: Decimal.fromString(user.moneyPerClick),
              moneyUsed: Decimal.fromString(user.moneyUsed),
              emeralds: Decimal.fromString(user.emeralds),
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
                  url: itemBought.item.url,
                  kind: itemBought.item.kind,
                },
                createdAt: new Date(itemBought.createdAt),
              })),
              prestigesBought: user.prestigesBought.map((prestigeBought) => ({
                id: prestigeBought.id,
                prestige: {
                  id: prestigeBought.prestige.id,
                  name: prestigeBought.prestige.name,
                  price: Decimal.fromString(prestigeBought.prestige.price),
                  moneyMult: Decimal.fromString(
                    prestigeBought.prestige.moneyMult,
                  ),
                  image: prestigeBought.prestige.image,
                },
                createdAt: new Date(prestigeBought.createdAt),
              })),
              latestBalance: Decimal.fromString(user.latestBalance),
            },
          });
          return;
        },
        async give(amount) {
          const oldUser = get().user;
          const id = oldUser?.id;
          if (!id) {
            logger.error('User not found');
            return;
          }
          const user = await router.user.give({ id, amount });
          //? Set the user
          set({
            user: {
              ...oldUser,
              moneyFromClick: Decimal.fromString(user.moneyFromClick),
            },
          });
        },
        async remove(amount) {
          const oldUser = get().user;
          const id = oldUser?.id;
          if (!id) {
            logger.error('User not found');
            return;
          }
          const user = await router.user.remove({ id, amount });
          //? Set the user
          set({
            user: {
              ...oldUser,
              moneyUsed: Decimal.fromString(user.moneyUsed),
            },
          });
        },
        async givePrestige() {
          const oldUser = get().user;
          const id = oldUser?.id;
          if (!id) {
            logger.error('User not found');
            return;
          }
          const user = await router.user.givePrestige({ id });
          user.moneyFromClick = '0';
          user.moneyPerClick = '1';
          user.moneyUsed = '0';
          //? Set the user
          set({
            user: {
              ...oldUser,
              moneyFromClick: Decimal.fromString(user.moneyFromClick),
              moneyPerClick: Decimal.fromString(user.moneyPerClick),
              moneyUsed: Decimal.fromString(user.moneyUsed),
              itemsBought: [],
              prestigesBought: user.prestigesBought.map((prestigeBought) => ({
                id: prestigeBought.id,
                prestige: {
                  id: prestigeBought.prestige.id,
                  name: prestigeBought.prestige.name,
                  price: Decimal.fromString(prestigeBought.prestige.price),
                  moneyMult: Decimal.fromString(
                    prestigeBought.prestige.moneyMult,
                  ),
                  image: prestigeBought.prestige.image,
                },
                createdAt: new Date(prestigeBought.createdAt),
              })),
            },
          });
        },
        async removePrestige() {
          const oldUser = get().user;
          const id = oldUser?.id;
          if (!id) {
            logger.error('User not found');
            return;
          }
          const user = await router.user.removePrestige({ id });
          //? Set the user
          set({
            user: {
              ...oldUser,
              prestigesBought: user.prestigesBought.map((prestigeBought) => ({
                id: prestigeBought.id,
                prestige: {
                  id: prestigeBought.prestige.id,
                  name: prestigeBought.prestige.name,
                  price: Decimal.fromString(prestigeBought.prestige.price),
                  moneyMult: Decimal.fromString(
                    prestigeBought.prestige.moneyMult,
                  ),
                  image: prestigeBought.prestige.image,
                },
                createdAt: new Date(prestigeBought.createdAt),
              })),
            },
          });
        },
        async giveItem(itemId) {
          const oldUser = get().user;
          const id = oldUser?.id;
          if (!id) {
            logger.error('User not found');
            return;
          }
          const user = await router.user.giveItem({ id, itemId });
          //? Set the user
          set({
            user: {
              ...oldUser,
              moneyPerClick: Decimal.fromString(user.moneyPerClick),
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
                  url: itemBought.item.url,
                  kind: itemBought.item.kind,
                },
                createdAt: new Date(itemBought.createdAt),
              })),
            },
          });
        },
        async removeItem(itemId) {
          const oldUser = get().user;
          const id = oldUser?.id;
          if (!id) {
            logger.error('User not found');
            return;
          }
          const user = await router.user.removeItem({ id, itemId });
          //? Set the user
          set({
            user: {
              ...oldUser,
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
                  url: itemBought.item.url,
                  kind: itemBought.item.kind,
                },
                createdAt: new Date(itemBought.createdAt),
              })),
            },
          });
        },
        async updateUser(user: IUser) {
          const oldUser = get().user;
          const id = oldUser?.id;
          if (!id) {
            logger.error('User not found');
            return;
          }
          //? Set the user
          set({ user });
        },
        signIn(user: IUser) {
          //? Set the user
          set({ user });
        },
      })),
      {
        name: 'user',
        version: 8,
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
                      url: itemBought.item.url,
                      kind: itemBought.item.kind,
                    },
                    createdAt: new Date(itemBought.createdAt),
                  })),
                  prestigesBought: persisted.user.prestigesBought.map(
                    (prestigeBought) => ({
                      id: prestigeBought.id,
                      prestige: {
                        id: prestigeBought.prestige.id,
                        name: prestigeBought.prestige.name,
                        price: Decimal.fromString(
                          prestigeBought.prestige.price as unknown as string,
                        ),
                        moneyMult: Decimal.fromString(
                          prestigeBought.prestige
                            .moneyMult as unknown as string,
                        ),
                        image: prestigeBought.prestige.image,
                      },
                      createdAt: new Date(prestigeBought.createdAt),
                    }),
                  ),
                }
              : null,
          };
        },
      },
    ),
  ),
);
