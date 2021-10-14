import { useNavigate } from 'solid-app-router';

export function navigateOnError(to: string, tryFunc: Function) {
  const navigate = useNavigate();

  try {
    tryFunc();
  } catch (error: unknown) {
    navigate(to);
  }
}
