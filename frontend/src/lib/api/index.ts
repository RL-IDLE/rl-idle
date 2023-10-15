import { env } from '../../env';
import { IRouterApi } from '../../types/api';
import {
  api as backendApi,
  IRoute,
  NestedRoute,
} from '../../../../backend/src/types/api';

export const api = {
  fetch: async (
    input: string,
    method?: RequestInit['method'] | undefined,
    body?: unknown,
  ) => {
    const join = (a: string, b: string) => {
      if (a.endsWith('/') && b.startsWith('/')) {
        return a + b.slice(1);
      } else if (!a.endsWith('/') && !b.startsWith('/')) {
        return a + '/' + b;
      } else {
        return a + b;
      }
    };
    const result = await fetch(join(env.VITE_API_URL, input), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    const json = await result.json();
    return json;
  },
};

// export const router: IRouterApi = {
//   user: {
//     load() {
//       return api.fetch('/user/load', 'POST');
//     },
//   },
// };

const isRoute = (value: NestedRoute | IRoute): value is IRoute => {
  return 'method' in value;
};
const isSubRoute = (value: NestedRoute | IRoute): value is NestedRoute => {
  return !isRoute(value);
};

type IRouteFunction = (body: IRoute['body']) => Promise<IRoute['response']>;
type IRouteGroup = {
  [name: string]: IRouteFunction | IRouteGroup | undefined;
};
const parseApiRoute = <T extends NestedRoute | IRoute, K extends IRouteGroup>(
  key: string | undefined,
  subRoute: T,
  result: K,
) => {
  if (isRoute(subRoute) && key) {
    const route = subRoute;
    (result as unknown as IRouteFunction) = (body: typeof route.body) =>
      api.fetch(route.url, route.method, body);
  } else if (isSubRoute(subRoute)) {
    for (const [key, value] of Object.entries(subRoute)) {
      (result as IRouteGroup)[key] = parseApiRoute(
        key,
        value as NestedRoute | IRoute,
        ((result as IRouteGroup)[key] ?? {}) as IRouteGroup,
      );
    }
  }
  return result;
};

const parseApiRoutes = <T extends NestedRoute>(api: T) => {
  const result = {} as IRouterApi;
  return parseApiRoute(undefined, api, result);
};

export const router: IRouterApi = parseApiRoutes(backendApi);
