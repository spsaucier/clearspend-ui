import { service } from 'app/utils/service';
import type {
  ResetPasswordRequest,
  ForgotPasswordRequest,
  UserLoginResponse,
  FirstTwoFactorValidateRequest,
  FirstTwoFactorSendRequest,
  TwoFactorLoginRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  TwoFactorStartLoggedInResponse,
} from 'generated/capital';

export async function login(username: string, password: string) {
  return (await service.post<UserLoginResponse>('/authentication/login', { username, password })).data;
}

export async function loginWith2fa(params: TwoFactorLoginRequest) {
  const forgotResponse = await service.post<TwoFactorLoginRequest>('/authentication/two-factor/login', params);
  return forgotResponse.data;
}

export async function logout() {
  await service.post('/authentication/logout');
}

export async function send2faEnrollmentCode(params: FirstTwoFactorSendRequest) {
  const forgotResponse = await service.post<FirstTwoFactorSendRequest>('/authentication/two-factor/first/send', params);
  return forgotResponse.data;
}

export async function complete2faEnrollment(params: FirstTwoFactorValidateRequest) {
  const forgotResponse = await service.post<FirstTwoFactorValidateRequest>(
    '/authentication/two-factor/first/validate',
    params,
  );
  return forgotResponse.data;
}

export async function forgotPassword({ email }: ForgotPasswordRequest) {
  const forgotResponse = await service.post<ForgotPasswordRequest>('/authentication/forgot-password', { email });
  return forgotResponse.data;
}

export async function resetPassword(params: ResetPasswordRequest) {
  const resetResponse = await service.post<ResetPasswordRequest>('/authentication/reset-password', params);
  return resetResponse.data;
}

export async function changePassword(params: Readonly<ChangePasswordRequest>) {
  return service.post<ChangePasswordResponse | TwoFactorStartLoggedInResponse>(
    '/authentication/change-password',
    params,
  );
}

export async function changePasswordById(changePasswordId: string, params: Readonly<ChangePasswordRequest>) {
  return (
    await service.post<Readonly<ChangePasswordResponse>>(`/authentication/change-password/${changePasswordId}`, params)
  ).data;
}
