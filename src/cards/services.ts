import { service } from 'app/utils/service';
import type {
  Card,
  CardDetailsResponse,
  IssueCardRequest,
  PagedDataSearchCardData,
  RevealCardRequest,
  RevealCardResponse,
  SearchCardRequest,
  UpdateCardRequest,
} from 'generated/capital';

export async function getCard(cardId: Card['cardId']) {
  return (await service.get<Readonly<Required<CardDetailsResponse>>>(`/cards/${cardId}`)).data;
}

export async function saveCard(params: Readonly<IssueCardRequest>) {
  return (await service.post('/cards', params)).data;
}

export async function updateCard(cardId: string, params: Readonly<UpdateCardRequest>) {
  return (await service.patch<Readonly<CardDetailsResponse>>(`/cards/${cardId}`, params)).data;
}

export async function searchCards(params: Readonly<SearchCardRequest>) {
  return (await service.post<Readonly<PagedDataSearchCardData>>('/cards/search', params)).data;
}

export async function revealCardKey(params: Readonly<RevealCardRequest>) {
  return (await service.post<Readonly<RevealCardResponse>>(`/cards/reveal`, params)).data;
}

export async function blockCard(cardId: string) {
  return (
    await service.patch(`/users/cards/${cardId}/block`, { status: 'INACTIVE', statusReason: 'CARDHOLDER_REQUESTED' })
  ).data;
}

export async function unblockCard(cardId: string) {
  return (
    await service.patch(`/users/cards/${cardId}/unblock`, { status: 'ACTIVE', statusReason: 'CARDHOLDER_REQUESTED' })
  ).data;
}
