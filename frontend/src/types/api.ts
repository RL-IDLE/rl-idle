import { IApi, IRoute } from '../../../backend/src/types/api';

type ISubRoute = {
  [K: string]: ISubRoute | IRoute;
};

type TransformApi<T extends ISubRoute> = {
  [K in keyof T]: T[K] extends ISubRoute
    ? TransformApi<T[K]>
    : (body: T[K]['body']) => Promise<T[K]['response']>;
};

export type IRouterApi = TransformApi<IApi>;
