import { service, RespType } from 'app/utils/service';
import type {
  CreateUserRequest,
  CreateUserResponse,
  PagedDataUserPageData,
  SearchUserRequest,
  User,
  UserData,
  UpdateUserRequest,
  CardDetailsResponse,
} from 'generated/capital';

export async function getUsers() {
  return (await service.get<readonly Readonly<UserData>[]>('/users/list')).data;
}

export async function searchUsers(params: Readonly<SearchUserRequest>) {
  return (await service.post<PagedDataUserPageData>('/users/search', params)).data;
}

export async function exportUsers(params: Readonly<SearchUserRequest>) {
  return (await service.post<Blob>('/users/export-csv', params, { respType: RespType.blob })).data;
}

export async function getUser(userId: string) {
  return (await service.get<Readonly<Required<User>>>(`/users/${userId}`)).data;
}

function extendUserParams(params: Readonly<CreateUserRequest>, pass = true) {
  return {
    address: {},
    generatePassword: pass,
    ...params,
  };
}

export async function saveUser(params: Readonly<CreateUserRequest>) {
  return (await service.post<Readonly<CreateUserResponse>>('/users', extendUserParams(params))).data;
}

export async function editUser(userId: string, params: Readonly<UpdateUserRequest>) {
  return (await service.patch(`/users/${userId}`, extendUserParams(params, false))).data;
}

export async function archiveUser(userId: string) {
  return (await service.patch<boolean>(`/users/${userId}/archive`)).data;
}

export async function getUserCards(): Promise<readonly Readonly<CardDetailsResponse>[]> {
  return (await service.get<readonly Readonly<Required<CardDetailsResponse>>[]>('/users/cards')).data;
}
