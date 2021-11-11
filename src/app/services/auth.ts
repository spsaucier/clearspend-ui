import { service } from 'app/utils/service';

export async function login(username: string, password: string) {
  return (await service.post('/authentication/login', { username, password })).data;
}

export async function logout() {
  await service.post('/authentication/logout');
}
