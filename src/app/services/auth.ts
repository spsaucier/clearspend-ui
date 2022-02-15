import { service } from 'app/utils/service';
import type {
  ResetPasswordRequest,
  ForgotPasswordRequest,
  User,
  UserRolesAndPermissionsRecord,
} from 'generated/capital';

export async function login(username: string, password: string): Promise<User> {
  const loginResponse = await service.post<User>('/authentication/login', { username, password });
  return loginResponse.data;
}

export async function logout() {
  await service.post('/authentication/logout');
}

export async function forgotPassword({ email }: ForgotPasswordRequest) {
  const forgotResponse = await service.post<ForgotPasswordRequest>('/authentication/forgot-password', { email });
  return forgotResponse.data;
}

export async function resetPassword(params: ResetPasswordRequest) {
  const resetResponse = await service.post<ResetPasswordRequest>('/authentication/reset-password', params);
  return resetResponse.data;
}

export async function getPermissions() {
  return (await service.get<Readonly<UserRolesAndPermissionsRecord | null>>(`/roles-and-permissions/`)).data;
}

export async function getPermissionsForBusiness(businessId: string) {
  return (
    await service.get<Readonly<UserRolesAndPermissionsRecord | null>>(`/roles-and-permissions/business/${businessId}`)
  ).data;
}

export async function getPermissionsForAllocation(allocationId: string) {
  return (
    await service.get<Readonly<UserRolesAndPermissionsRecord | null>>(
      `/roles-and-permissions/allocation/${allocationId}`,
    )
  ).data;
}
