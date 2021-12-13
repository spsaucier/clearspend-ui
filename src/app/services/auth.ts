import { service } from 'app/utils/service';
import type { User } from 'generated/capital';

export async function login(username: string, password: string): Promise<User> {
  const loginResponse = await service.post('/authentication/login', { username, password });
  return loginResponse.data as User;
}

export async function logout() {
  await service.post('/authentication/logout');
}
