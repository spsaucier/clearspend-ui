import { createSignal, onMount, onCleanup } from 'solid-js';

const SECOND = 1000;

export function createTimer(timeoutInSeconds: number) {
  let interval: number;
  let targetTime: number;

  const [seconds, setTimeLeft] = createSignal<number>(timeoutInSeconds);

  const startInterval = () => {
    setTimeLeft(timeoutInSeconds);
    targetTime = Date.now() + timeoutInSeconds * SECOND;

    interval = setInterval(() => {
      const diff = Math.round((targetTime - Date.now()) / SECOND);
      setTimeLeft(Math.max(0, diff));
      if (diff <= 0) clearInterval(interval);
    }, SECOND);
  };

  onMount(() => {
    startInterval();
    onCleanup(() => clearInterval(interval));
  });

  return [seconds, startInterval] as const;
}
