export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get the time between to dates
 * @param firstDate First date
 * @param secondDate Second date
 * @returns The time between the two dates
 * @example
 * getTimeBetween(new Date("2020-01-01"), new Date("2020-01-02")) // 1 day
 */
export const getTimeBetween = (
  firstDate: Date,
  secondDate: Date,
  options?: {
    markAsNowSince?: number;
  },
) => {
  // Time difference in milliseconds
  const timeDiff = Math.abs(firstDate.getTime() - secondDate.getTime()); // in milliseconds

  // Check for the markAsNowSince
  const markAsNowSince = options?.markAsNowSince ?? 1000 * 60;
  if (timeDiff < markAsNowSince) {
    return 'maintenant';
  }

  // Define time intervals in milliseconds
  const intervals = {
    year: 365.25 * 24 * 60 * 60 * 1000,
    month: 30.44 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
  };
  // Calculate the number of intervals elapsed
  const elapsed = {
    year: Math.floor(timeDiff / intervals.year),
    month: Math.floor(timeDiff / intervals.month),
    day: Math.floor(timeDiff / intervals.day),
    hour: Math.floor(timeDiff / intervals.hour),
    minute: Math.floor(timeDiff / intervals.minute),
    second: Math.floor(timeDiff / intervals.second),
  };
  // Determine the appropriate time interval to display
  let timeUnit: string;
  let timeValue: number;
  let precisionUnit: string | null = null;
  let precisionValue: number | null = null;
  if (elapsed.year > 0) {
    timeUnit = elapsed.year > 1 ? 'years' : 'year';
    timeValue = elapsed.year;
    const monthDiff = Math.floor(
      (timeDiff - elapsed.year * intervals.year) / intervals.month,
    );
    if (monthDiff > 0) {
      precisionUnit = monthDiff > 1 ? 'months' : 'month';
      precisionValue = monthDiff;
    }
  } else if (elapsed.month > 0) {
    timeUnit = elapsed.month > 1 ? 'months' : 'month';
    timeValue = elapsed.month;
    const dayDiff = Math.floor(
      (timeDiff - elapsed.month * intervals.month) / intervals.day,
    );
    if (dayDiff > 0) {
      precisionUnit = dayDiff > 1 ? 'days' : 'day';
      precisionValue = dayDiff;
    }
  } else if (elapsed.day > 0) {
    timeUnit = elapsed.day > 1 ? 'days' : 'day';
    timeValue = elapsed.day;
    const hourDiff = Math.floor(
      (timeDiff - elapsed.day * intervals.day) / intervals.hour,
    );
    if (hourDiff > 0) {
      precisionUnit = hourDiff > 1 ? 'hours' : 'hour';
      precisionValue = hourDiff;
    }
  } else if (elapsed.hour > 0) {
    timeUnit = elapsed.hour > 1 ? 'hours' : 'hour';
    timeValue = elapsed.hour;
    const minuteDiff = Math.floor(
      (timeDiff - elapsed.hour * intervals.hour) / intervals.minute,
    );
    if (minuteDiff > 0) {
      precisionUnit = minuteDiff > 1 ? 'minutes' : 'minute';
      precisionValue = minuteDiff;
    }
  } else if (elapsed.minute > 0) {
    timeUnit = elapsed.minute > 1 ? 'minutes' : 'minute';
    timeValue = elapsed.minute;
    const secondDiff = Math.floor(
      (timeDiff - elapsed.minute * intervals.minute) / intervals.second,
    );
    if (secondDiff > 0) {
      precisionUnit = secondDiff > 1 ? 'seconds' : 'second';
      precisionValue = secondDiff;
    }
  } else {
    timeUnit = elapsed.second > 1 ? 'seconds' : 'second';
    timeValue = elapsed.second;
  }
  // Construct and return the time elapsed string
  return `${timeValue} ${timeUnit} ${
    precisionValue ? `${precisionValue} ${precisionUnit}` : ''
  }`;
};

/**
 * Get the depth of an object
 * @param object The object
 * @param maxDepth The max depth
 * @param curDepth The current depth
 * @returns The object with the depth
 * @example
 * objectDepth({ a: { b: { c: 1 }, d: "foo" } }, 2) // { a: { d: "foo" } }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const objectDepth = <T>(object: T, maxDepth = 1, curDepth = 1): T => {
  if (typeof object !== 'object' || !object) return object as T;
  const newObject = {} as T;
  for (const key in object) {
    if (!object.hasOwnProperty(key)) continue;
    if (typeof object[key] === 'object') {
      if (curDepth < maxDepth) {
        newObject[key] = objectDepth(object[key], maxDepth, curDepth + 1);
      } else continue;
    } else {
      newObject[key] = object[key];
    }
  }
  return newObject;
};
