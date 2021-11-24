import { service } from 'app/utils/service';

import type { Card, IssueCard, SearchCardRequest, SearchCardResponse } from './types';

export async function getCard(cardId: Card['cardId']) {
  return (await service.get<Readonly<Card>>(`/cards/${cardId}`)).data;
}

export async function saveCard(params: Readonly<IssueCard>) {
  return (await service.post('/cards', params)).data;
}

export async function searchCards(params: Readonly<SearchCardRequest>) {
  return (await service.post<Readonly<SearchCardResponse>>('/cards/search', params)).data;
}
