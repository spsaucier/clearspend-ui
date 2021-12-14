import { service } from 'app/utils/service';
import type {
  CreateUserRequest,
  CreateUserResponse,
  PagedDataUserPageData,
  SearchUserRequest,
  User,
  UserData,
} from 'generated/capital';

export async function getUsers() {
  return (await service.get<readonly Readonly<UserData>[]>('/users/list')).data;
}

export async function searchUsers(params: Readonly<SearchUserRequest>) {
  return (await service.post<PagedDataUserPageData>('/users/search', params)).data;
}

export async function getUser(userId: string) {
  return (await service.get<Readonly<User>>(`/users/${userId}`)).data;
}

function extendUserParams(params: Readonly<CreateUserRequest>, pass = true) {
  return {
    address: {},
    generatePassword: pass,
    ...params,
  };
}

// TODO: save and edit should return User modal

export async function saveUser(params: Readonly<CreateUserRequest>) {
  return (await service.post<Readonly<CreateUserResponse>>('/users', extendUserParams(params))).data;
}

export async function editUser(userId: string, params: Readonly<CreateUserRequest>) {
  return (await service.patch(`/users/${userId}`, extendUserParams(params, false))).data;
}
