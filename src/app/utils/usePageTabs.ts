import { createSignal, batch } from 'solid-js';
import { useSearchParams } from 'solid-app-router';

type Params<T extends string> = { tab?: T };

export function usePageTabs<T extends string>(initTab: T) {
  const [searchParams, setSearchParams] = useSearchParams<Params<T>>();
  const [tab, setTab] = createSignal<T>(searchParams.tab || initTab);

  const onChangeTab = (value: T, skipParams = false): void => {
    batch(() => {
      if (!skipParams) setSearchParams({ tab: value });
      setTab(() => value);
    });
  };

  return [tab, onChangeTab] as const;
}
