import { RespType, service } from 'app/utils/service';
import type {
  Card,
  CardDetailsResponse,
  CardStatementRequest,
  IssueCardResponse,
  PagedDataSearchCardData,
  RevealCardRequest,
  RevealCardResponse,
  SearchCardRequest,
} from 'generated/capital';

import type { LegacyCardDetailsResponse, LegacyIssueCardRequest, LegacyUpdateCardRequest } from './types';
import { legacyCardDetailsConversion, legacyIssueCardConversion, legacyUpdateCardConversion } from './types';

export async function getCard(cardId: Card['cardId']): Promise<Readonly<Required<LegacyCardDetailsResponse>>> {
  const data = (await service.get<Readonly<Required<CardDetailsResponse>>>(`/cards/${cardId}`)).data;
  return legacyCardDetailsConversion(data);
}

export async function saveCard(params: Readonly<LegacyIssueCardRequest>) {
  const convertedParams = legacyIssueCardConversion(params);
  return (await service.post<readonly Readonly<IssueCardResponse>[]>('/cards', convertedParams)).data;
}

export async function updateCard(
  cardId: string,
  allocationId: string,
  params: Readonly<LegacyUpdateCardRequest>,
): Promise<Readonly<Required<LegacyCardDetailsResponse>>> {
  const convertedParams = legacyUpdateCardConversion(params, allocationId);
  const data = (
    await service.patch<Readonly<Required<CardDetailsResponse>>>(`/cards/${cardId}/controls`, convertedParams)
  ).data;
  return legacyCardDetailsConversion(data);
}

export async function searchCards(params: Readonly<SearchCardRequest>) {
  return (await service.post<Readonly<PagedDataSearchCardData>>('/cards/search', params)).data;
}

export async function exportCards(params: Readonly<SearchCardRequest>) {
  return (await service.post<Blob>('/cards/export-csv', params, { respType: RespType.blob })).data;
}

export async function revealCardKey(params: Readonly<RevealCardRequest>) {
  return (await service.post<Readonly<RevealCardResponse>>(`/cards/reveal`, params)).data;
}

export async function cancelCard(cardId: string) {
  return (
    await service.patch<Readonly<Card>>(`/users/cards/${cardId}/cancel`, { statusReason: 'CARDHOLDER_REQUESTED' })
  ).data;
}

export async function getCardStatement(params: Required<CardStatementRequest>) {
  return (await service.post<Blob>('/card-statement', params, { respType: RespType.blob })).data;
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

export async function activateCard(cardId: string, lastFour: string) {
  return (
    await service.patch<Card>(`/users/cards/${cardId}/activate`, { lastFour, statusReason: 'CARDHOLDER_REQUESTED' })
  ).data;
}
