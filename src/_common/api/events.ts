const PREFIX = 'tw_';

function sub<T>(name: string, callback: (data: T) => void): () => void {
  const listener = (event: Event) => callback((event as CustomEvent<T>).detail);
  document.addEventListener(PREFIX + name, listener);
  return () => document.removeEventListener(PREFIX + name, listener);
}

function emit<T>(name: string, detail?: T): void {
  document.dispatchEvent(new CustomEvent(PREFIX + name, { detail }));
}

export const events = { sub, emit };
