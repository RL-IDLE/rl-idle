import Boost from '@/app/components/icons/Boost';
import Home from '@/app/components/icons/Home';
import Ranking from '@/app/components/icons/Ranking';
import Reset from '@/app/components/icons/Reset';
import Shop from '@/app/components/icons/Shop';

export const pages = [
  {
    name: 'prestige',
    disabled: false,
    label: <Reset />,
  },
  {
    name: 'shop',
    disabled: false,
    label: <Shop />,
  },
  {
    name: 'home',
    disabled: false,
    label: <Home />,
  },
  {
    name: 'boost',
    disabled: true,
    label: <Boost />,
  },
  {
    name: 'ranking',
    disabled: true,
    label: <Ranking />,
  },
] as const;
export type IPages = (typeof pages)[number]['name'];
