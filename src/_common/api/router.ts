import { useNavigate, useLocation } from 'solid-app-router';
import type { NavigateOptions } from 'solid-app-router';

interface State {
  prev: string;
}

export function useNav<S extends {}>() {
  const navigate = useNavigate();
  const location = useLocation();

  return (to: string, options?: Partial<NavigateOptions<S>>): void => {
    navigate(to, {
      ...options,
      state: {
        ...(options?.state as S),
        prev: location.pathname,
      },
    });
  };
}

export function useLoc<S extends {}>() {
  return useLocation<S & State>();
}
