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
