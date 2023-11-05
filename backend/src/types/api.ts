import { z } from 'zod';
import { unknown } from '.';
import { IHttpMethod } from './http';
import {
  IConfirmPayment,
  IGive,
  IGiveItem,
  IGivePrestige,
  ILoadUser,
  IRemove,
  IRemoveItem,
  IRemovePrestige,
  IReset,
  IUser,
} from './user';
import {
  buyItemSchema,
  buyPrestigeSchema,
  clickSchema,
  livelinessProbeSchema,
} from './events';
import { IItem } from './item';
import { IPrestige } from './prestige';

export type IRoute = {
  method: IHttpMethod;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any;
};

export type NestedRoute = {
  [K: string]: NestedRoute | IRoute;
};

const IApiType = <T extends NestedRoute>(api: T) => api;
export const api = IApiType({
  user: {
    load: {
      method: 'POST',
      url: '/users/load',
      body: unknown as ILoadUser,
      response: unknown as IUser,
    },
    reset: {
      method: 'POST',
      url: '/users/reset',
      body: unknown as IReset,
      response: unknown as IUser,
    },
    give: {
      method: 'POST',
      url: '/users/give',
      body: unknown as IGive,
      response: unknown as IUser,
    },
    remove: {
      method: 'POST',
      url: '/users/remove',
      body: unknown as IRemove,
      response: unknown as IUser,
    },
    givePrestige: {
      method: 'POST',
      url: '/users/give-prestige',
      body: unknown as IGivePrestige,
      response: unknown as IUser,
    },
    removePrestige: {
      method: 'POST',
      url: '/users/remove-prestige',
      body: unknown as IRemovePrestige,
      response: unknown as IUser,
    },
    giveItem: {
      method: 'POST',
      url: '/users/give-item',
      body: unknown as IGiveItem,
      response: unknown as IUser,
    },
    removeItem: {
      method: 'POST',
      url: '/users/remove-item',
      body: unknown as IRemoveItem,
      response: unknown as IUser,
    },
    updateUser: {
      method: 'PUT',
      url: '/users/update-user',
      body: unknown as IUser,
      response: unknown as IUser,
    },
    signIn: {
      method: 'POST',
      url: '/users/sign-in',
      body: unknown as IUser,
      response: unknown as IUser,
    },
    confirmPayment: {
      method: 'POST',
      url: '/users/confirm-payment',
      body: unknown as IConfirmPayment,
      response: unknown as { emeralds: number },
    },
  },
  items: {
    findAll: {
      method: 'GET',
      url: '/items',
      body: undefined,
      response: unknown as IItem[],
    },
  },
  prestiges: {
    findAll: {
      method: 'GET',
      url: '/prestiges',
      body: undefined,
      response: unknown as IPrestige[],
    },
  },
});
export type IApi = typeof api;

export type IWsEvent = {
  click: {
    body: z.infer<typeof clickSchema>;
  };
  buyItem: {
    body: z.infer<typeof buyItemSchema>;
  };
  buyPrestige: {
    body: z.infer<typeof buyPrestigeSchema>;
  };
  livelinessProbe: {
    body: z.infer<typeof livelinessProbeSchema>;
  };
};
