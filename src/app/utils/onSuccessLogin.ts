import type { Navigator } from 'solid-app-router';

import type { UserLoginResponse } from 'generated/capital';
import { getBusiness } from 'app/services/businesses';
import { BusinessStatus } from 'app/types/businesses';

interface OnSuccessProps {
  user: Readonly<UserLoginResponse>;
  navigate: Navigator;
  overridePath?: string;
  already2fa?: boolean;
}

export async function onSuccessLogin({ user, navigate, overridePath, already2fa }: OnSuccessProps) {
  if (user.userId) {
    if (overridePath) {
      location.assign(overridePath);
    } else {
      navigate(
        user.phone !== '+11111111111' &&
          !already2fa &&
          !user.twoFactorId &&
          (await getBusiness())?.status === BusinessStatus.ACTIVE
          ? '/enable-2fa'
          : '/',
      );
    }
  } else if ('twoFactorId' in user && user.twoFactorId) {
    navigate('/login-2fa', { state: { twoFactorId: user.twoFactorId, overridePath } });
  }
}
