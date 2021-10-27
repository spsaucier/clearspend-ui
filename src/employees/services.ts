import { service } from 'app/utils/service';
import { readBusinessID } from 'onboarding/storage';

import type { CreateUser, CreateUserResp, User } from './types';

export async function getUsers() {
  return (await service.get<readonly Readonly<User>[]>('/users/list', { headers: { businessId: readBusinessID() } }))
    .data;
}

export async function saveUser(params: Readonly<CreateUser>) {
  return (
    await service.post<Readonly<CreateUserResp>>(
      '/users',
      {
        ...params,
        // TODO
        address: {},
        phone: '+79999999999',
        generatePassword: true,
      },
      { headers: { businessId: readBusinessID() } },
    )
  ).data;
}
