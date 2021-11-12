import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types/common';

import type {
  CreateUser,
  CreateUserResp,
  BaseUser,
  User,
  UserCard,
  SearchUserRequest,
  SearchUserResponse,
} from './types';

export async function getUsers() {
  return (await service.get<readonly Readonly<BaseUser>[]>('/users/list')).data;
}

export async function searchUsers(params: Readonly<SearchUserRequest>) {
  return (await service.post<SearchUserResponse>('/users/search', params)).data;
}

export async function getUser(userId: UUIDString) {
  return (await service.get<Readonly<User>>(`/users/${userId}`)).data;
}

export async function getUserCards(userId: UUIDString) {
  return (await service.get<readonly Readonly<UserCard>[]>('/users/cards', { headers: { userId } })).data;
}

export async function saveUser(params: Readonly<CreateUser>) {
  return (
    await service.post<Readonly<CreateUserResp>>('/users', {
      ...params,
      // TODO
      address: {},
      phone: '+79999999999',
      generatePassword: true,
    })
  ).data;
}
