import type { Navigator } from 'solid-app-router';

import type { UserLoginResponse } from 'generated/capital';
import { getBusiness } from 'app/services/businesses';
import { BusinessStatus } from 'app/types/businesses';

export async function onSuccessLogin(user: Readonly<UserLoginResponse>, navigate: Navigator, overridePath?: string) {
  if (user.userId) {
    if (overridePath) {
      navigate(overridePath);
    } else {
      navigate(
        user.phone !== '+11111111111' && !user.twoFactorId && (await getBusiness())?.status === BusinessStatus.ACTIVE
          ? '/enable-2fa'
          : '/',
      );
    }
  } else if ('twoFactorId' in user && user.twoFactorId) {
    navigate('/login-2fa', { state: { twoFactorId: user.twoFactorId, overridePath } });
  }
}
