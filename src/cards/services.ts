import { RespType, service } from 'app/utils/service';
import type {
  BusinessStatementRequest,
  Card,
  CardAllocationSpendControls,
  CardDetailsResponse,
  CardStatementRequest,
  CreateAllocationResponse,
  IssueCardRequest,
  IssueCardResponse,
  PagedDataSearchCardData,
  RevealCardRequest,
  RevealCardResponse,
  SearchCardRequest,
  UpdateCardSpendControlsRequest,
} from 'generated/capital';

export async function getCard(cardId: Card['cardId']): Promise<Readonly<Required<CardDetailsResponse>>> {
  return (await service.get<Readonly<Required<CardDetailsResponse>>>(`/cards/${cardId}`)).data;
}

export async function saveCard(params: Readonly<IssueCardRequest>) {
  return (await service.post<readonly Readonly<IssueCardResponse>[]>('/cards', params)).data;
}

export async function updateCard(
  cardId: string,
  params: Readonly<UpdateCardSpendControlsRequest>,
): Promise<Readonly<Required<CardDetailsResponse>>> {
  return (await service.patch<Readonly<Required<CardDetailsResponse>>>(`/cards/${cardId}/controls`, params)).data;
}

export async function linkAllocationToCard(
  cardId: string,
  allocationId: string,
): Promise<Readonly<Required<CardDetailsResponse>>> {
  return (await service.patch<Readonly<Required<CardDetailsResponse>>>(`/users/cards/${cardId}/link/${allocationId}`))
    .data;
}

export async function addAllocationsToCard(
  cardId: string,
  params: Readonly<CardAllocationSpendControls[]>,
): Promise<Readonly<Required<CardDetailsResponse>>> {
  return (await service.post<Readonly<Required<CardDetailsResponse>>>(`/cards/${cardId}/allocations`, params)).data;
}

export async function removeAllocationsFromCard(
  cardId: string,
  params: Readonly<CreateAllocationResponse[]>,
): Promise<Readonly<Required<CardDetailsResponse>>> {
  return (await service.remove<Readonly<Required<CardDetailsResponse>>>(`/cards/${cardId}/allocations`, params)).data;
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
  return (await service.post<Blob>('/statements/card', params, { respType: RespType.blob })).data;
}

export async function getBusinessStatement(params: Required<BusinessStatementRequest>) {
  return (await service.post<Blob>('/statements/business', params, { respType: RespType.blob })).data;
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
