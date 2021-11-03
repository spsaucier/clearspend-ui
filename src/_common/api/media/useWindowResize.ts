import { onMount, onCleanup } from 'solid-js';

const UPDATE_TIMEOUT = 100;

export function useWindowResize(callback: () => void) {
  onMount(() => {
    let timeout: number;

    function onResize() {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(), UPDATE_TIMEOUT);
    }

    window.addEventListener('resize', onResize);

    onCleanup(() => {
      clearTimeout(timeout);
      window.removeEventListener('resize', onResize);
    });
  });
}
