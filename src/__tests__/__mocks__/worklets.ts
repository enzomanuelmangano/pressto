export const scheduleOnRN = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  ...args: Args
) => fn(...args);
