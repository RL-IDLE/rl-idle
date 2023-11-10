export const maxPassiveIncomeInterval = 1000 * 60 * 60 * 4; //? 4 hours
export const maxDiffTimeUserSpec = 1000 * 5; //? 5 seconds
export const priceToEmerald = (price: number) => {
  const priceToEmeraldMap = new Map<number, number>([
    [99, 80],
    [499, 500],
    [999, 1100],
    [1999, 2500],
    [4999, 6500],
    [9999, 14000],
  ]);

  if (priceToEmeraldMap.has(price)) {
    return priceToEmeraldMap.get(price) as number;
  } else {
    throw `Price not found (${price})`;
  }
};
export const fullBoostMultiplier = 10;
export const passiveIncomeMultiplier = 0.1;
export const maxClickPerSecond = 30;
export const timewarpBoost = [
  {
    id: '0',
    name: '12h',
    timeAcceleration: 43200,
    price: 250,
  },
  {
    id: '1',
    name: '24h',
    timeAcceleration: 86400,
    price: 450,
  },
  {
    id: '2',
    name: '3d',
    timeAcceleration: 259200,
    price: 860,
  },
];
export const upgradeBoost = [
  {
    id: '3',
    name: 'AFK Time',
    afkTime: 2,
    price: 2500,
  },
  {
    id: '4',
    name: 'Click x2',
    durationTime: 3600,
    price: 75,
  },
  {
    id: '5',
    name: 'Click x3',
    durationTime: 900,
    price: 150,
  },
  {
    id: '6',
    name: 'Click x3',
    durationTime: 2700,
    price: 400,
  },
];
