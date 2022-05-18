const DEFAULT_INTERVAL = 500;
const DEFAULT_MAX_TIMES = 10;

interface Options {
  interval?: number;
  maxTimes?: number;
}

export async function until<T extends unknown>(
  action: () => Promise<T>,
  condition: () => boolean,
  options?: Readonly<Options>,
): Promise<T> {
  let counter = 0;

  return new Promise<T>((resolve, reject) => {
    function call() {
      if (++counter > (options?.maxTimes || DEFAULT_MAX_TIMES)) {
        reject(new Error('The maximum number of attempts was reached'));
        return;
      }

      action()
        .then((data) => {
          if (condition()) {
            resolve(data);
            return;
          }
          setTimeout(call, options?.interval ?? DEFAULT_INTERVAL);
        })
        .catch((error: unknown) => reject(error));
    }

    call();
  });
}
