import type { Navigator } from 'solid-app-router';

import type { UserLoginResponse } from 'generated/capital';

export function onSuccessLogin(user: Readonly<UserLoginResponse>, navigate: Navigator) {
  if (user.userId) {
    navigate(user.phone !== '+11111111111' ? '/enable-2fa' : '/');
  } else if ('twoFactorId' in user && user.twoFactorId) {
    navigate('/login-2fa', { state: { twoFactorId: user.twoFactorId } });
  }
}
