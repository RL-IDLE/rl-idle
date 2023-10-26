import { z } from 'zod';
import { unknown } from '.';
import { IHttpMethod } from './http';
import { ILoadUser, IUser } from './user';
import { buyItemSchema, buyPrestigeSchema, clickSchema } from './events';
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
      body: unknown as { id: string },
      response: unknown as IUser,
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
};
