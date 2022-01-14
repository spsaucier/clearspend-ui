import { onMount, onCleanup } from 'solid-js';

const UPDATE_TIMEOUT = 100;

export function useResize(element: () => HTMLElement, callback: () => void) {
  onMount(() => {
    let timeout: number;
    let { width, height } = element().getBoundingClientRect();

    const observer = new ResizeObserver((entries) => {
      if (!entries.length) return;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const rect = entries[0]!.contentRect;

        if (rect.width !== width || rect.height !== height) {
          width = rect.width;
          height = rect.height;
          callback();
        }
      }, UPDATE_TIMEOUT);
    });

    observer.observe(element());

    onCleanup(() => {
      clearTimeout(timeout);
      observer.unobserve(element());
    });
  });
}
