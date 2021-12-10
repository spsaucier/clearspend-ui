import { service } from 'app/utils/service';
import type { UUIDString } from 'app/types/common';
import type { Card, IssueCardRequest, PagedDataSearchCardData, SearchCardRequest } from 'generated/capital';


export async function getCard(cardId: Card['cardId']) {
  return (await service.get<Readonly<Card>>(`/cards/${cardId}`)).data;
}

export async function saveCard(params: Readonly<IssueCardRequest>) {
  return (await service.post('/cards', params)).data;
}

export async function searchCards(params: Readonly<SearchCardRequest>) {
  return (await service.post<Readonly<PagedDataSearchCardData>>('/cards/search', params)).data;
}

export async function blockCard(cardId: UUIDString) {
  return (await service.patch(`/users/cards/${cardId}/block`, { status: 'BLOCKED' })).data;
}

export async function unblockCard(cardId: UUIDString) {
  return (await service.patch(`/users/cards/${cardId}/unblock`, { status: 'OPEN' })).data;
}
