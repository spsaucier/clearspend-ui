import { lazy as solidLazy, Component, ErrorBoundary } from 'solid-js';

import { Fault } from '../components/Fault';

import { reload } from './reload';

const ERRORS = ['ChunkLoadError', 'CSS_CHUNK_LOAD_FAILED'] as const;

interface ChunkError extends Error {
  code?: string;
}

function isMatched(error: ChunkError) {
  return (item: string): boolean => item === error.name || item === error.code;
}

export function lazy<T extends {}>(loader: () => Promise<{ default: Component<T> }>) {
  const Comp = solidLazy(loader);

  const onReload = () => Promise.resolve(reload());

  function Wrapper(props: T) {
    return (
      <ErrorBoundary
        fallback={(error: ChunkError) => <Fault onReload={ERRORS.some(isMatched(error)) ? onReload : undefined} />}
      >
        <Comp {...props} />
      </ErrorBoundary>
    );
  }

  Wrapper.preload = Comp.preload;

  return Wrapper;
}
