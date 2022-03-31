import { lazy as solidLazy, ErrorBoundary, Show, createMemo, type Component } from 'solid-js';

import { Fault } from '../components/Fault';

import { reload } from './reload';

const RELOAD_LIMIT_MS = 3000;
const CHUNK_ERRORS = ['ChunkLoadError', 'CSS_CHUNK_LOAD_FAILED'] as const;

interface ReloadState {
  lastReload: number | null;
}

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
        fallback={(error: ChunkError) => {
          // eslint-disable-next-line no-console
          console.log({ error });

          const state = history.state as Partial<ReloadState> | null;
          const isChunkError = createMemo(() => CHUNK_ERRORS.some(isMatched(error)));
          const canReload = createMemo(() => !state?.lastReload || Date.now() - state.lastReload > RELOAD_LIMIT_MS);

          if (isChunkError() && canReload()) {
            history.replaceState({ ...state, lastReload: Date.now() }, '', `${location.pathname}${location.search}`);
            reload();
          }

          return (
            <Show when={!isChunkError() || !canReload()} fallback={null}>
              <Fault onReload={onReload} />;
            </Show>
          );
        }}
      >
        <Comp {...props} />
      </ErrorBoundary>
    );
  }

  Wrapper.preload = Comp.preload;

  return Wrapper;
}
