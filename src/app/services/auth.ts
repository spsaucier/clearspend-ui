import { service } from 'app/utils/service';

export async function login(username: string, password: string) {
  await service.post('/authentication/login', { username, password });
}

export async function logout() {
  await service.post('/authentication/logout');
}
