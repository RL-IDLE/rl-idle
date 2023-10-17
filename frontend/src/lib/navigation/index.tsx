export const pages = [
  {
    name: 'prestige',
    disabled: true,
    label: 'Prestige',
  },
  {
    name: 'shop',
    disabled: false,
    label: 'Shop',
  },
  {
    name: 'home',
    disabled: false,
    label: 'Home',
  },
  {
    name: 'boost',
    disabled: true,
    label: 'Boost',
  },
  {
    name: 'ranking',
    disabled: true,
    label: 'Ranks',
  },
] as const;
export type IPages = (typeof pages)[number]['name'];
