// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compose<T>(...funcs: ((arg: T) => any)[]) {
  return (arg: T) => {
    for (const func of funcs) {
      func(arg);
    }
  };
}
