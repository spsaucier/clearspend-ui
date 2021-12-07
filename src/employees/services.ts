import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types/common';

import type { CreateUser, CreateUserResp, BaseUser, User, SearchUserRequest, SearchUserResponse } from './types';

export async function getUsers() {
  return (await service.get<readonly Readonly<BaseUser>[]>('/users/list')).data;
}

export async function searchUsers(params: Readonly<SearchUserRequest>) {
  return (await service.post<SearchUserResponse>('/users/search', params)).data;
}

export async function getUser(userId: UUIDString) {
  return (await service.get<Readonly<User>>(`/users/${userId}`)).data;
}

function extendUserParams(params: Readonly<CreateUser>, pass = true) {
  return {
    address: {},
    generatePassword: pass,
    ...params,
  };
}

// TODO: save and edit should return User modal

export async function saveUser(params: Readonly<CreateUser>) {
  return (await service.post<Readonly<CreateUserResp>>('/users', extendUserParams(params))).data;
}

export async function editUser(userId: UUIDString, params: Readonly<CreateUser>) {
  return (await service.patch(`/users/${userId}`, extendUserParams(params, false))).data;
}
