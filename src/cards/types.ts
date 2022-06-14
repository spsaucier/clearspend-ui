import type {
  SearchCardRequest,
  Card,
  Amount,
  CurrencyLimit,
  CreateAllocationRequest,
  CardDetailsResponse,
  UpdateCardSpendControlsRequest,
  IssueCardRequest,
  Address,
} from 'generated/capital';

export enum CardType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
}

export type CardFiltersFields = keyof Omit<SearchCardRequest, 'pageRequest' | 'searchText'>;

export type PaymentType = ValuesOf<CreateAllocationRequest['disabledPaymentTypes']>;

export interface LegacyCardDetailsResponse {
  card: Card;
  ledgerBalance?: Amount;
  availableBalance?: Amount;
  allocationName?: string;
  limits?: CurrencyLimit[];
  disabledMccGroups?: (
    | 'CHILD_CARE'
    | 'DIGITAL_GOODS'
    | 'EDUCATION'
    | 'ENTERTAINMENT'
    | 'FOOD_BEVERAGE'
    | 'GAMBLING'
    | 'GOVERNMENT'
    | 'HEALTH'
    | 'MEMBERSHIPS'
    | 'MONEY_TRANSFER'
    | 'SERVICES'
    | 'SHOPPING'
    | 'TRAVEL'
    | 'UTILITIES'
    | 'OTHER'
  )[];
  disabledPaymentTypes?: ('POS' | 'ONLINE' | 'MANUAL_ENTRY')[];
  disableForeign?: boolean;
  allowedAllocationIds?: string[];
}

export interface LegacyUpdateCardRequest {
  limits?: CurrencyLimit[];
  disabledMccGroups?: (
    | 'CHILD_CARE'
    | 'DIGITAL_GOODS'
    | 'EDUCATION'
    | 'ENTERTAINMENT'
    | 'FOOD_BEVERAGE'
    | 'GAMBLING'
    | 'GOVERNMENT'
    | 'HEALTH'
    | 'MEMBERSHIPS'
    | 'MONEY_TRANSFER'
    | 'SERVICES'
    | 'SHOPPING'
    | 'TRAVEL'
    | 'UTILITIES'
    | 'OTHER'
  )[];
  disabledPaymentTypes?: ('POS' | 'ONLINE' | 'MANUAL_ENTRY')[];
  disableForeign?: boolean;
}

export interface LegacyIssueCardRequest {
  cardType: 'PHYSICAL' | 'VIRTUAL' | 'ADD_TO_PHYSICAL';
  cardId?: string;

  /**
   * @format uuid
   * @example 28104ecb-1343-4cc1-b6f2-e6cc88e9a80f
   */
  allocationId: string;

  /**
   * @format uuid
   * @example 38104ecb-1343-4cc1-b6f2-e6cc88e9a80f
   */
  userId: string;
  currency:
    | 'UNSPECIFIED'
    | 'AED'
    | 'AFN'
    | 'ALL'
    | 'AMD'
    | 'ANG'
    | 'AOA'
    | 'ARS'
    | 'AUD'
    | 'AWG'
    | 'AZN'
    | 'BAM'
    | 'BBD'
    | 'BDT'
    | 'BGN'
    | 'BHD'
    | 'BIF'
    | 'BMD'
    | 'BND'
    | 'BOB'
    | 'BRL'
    | 'BSD'
    | 'BTN'
    | 'BWP'
    | 'BYN'
    | 'BYR'
    | 'BZD'
    | 'CAD'
    | 'CDF'
    | 'CHF'
    | 'CLP'
    | 'CNY'
    | 'COP'
    | 'CRC'
    | 'CUC'
    | 'CUP'
    | 'CVE'
    | 'CZK'
    | 'DJF'
    | 'DKK'
    | 'DOP'
    | 'DZD'
    | 'EGP'
    | 'ERN'
    | 'ETB'
    | 'EUR'
    | 'FJD'
    | 'FKP'
    | 'GBP'
    | 'GEL'
    | 'GHS'
    | 'GIP'
    | 'GMD'
    | 'GNF'
    | 'GTQ'
    | 'GYD'
    | 'HKD'
    | 'HNL'
    | 'HRK'
    | 'HTG'
    | 'HUF'
    | 'IDR'
    | 'ILS'
    | 'INR'
    | 'IQD'
    | 'IRR'
    | 'ISK'
    | 'JMD'
    | 'JOD'
    | 'JPY'
    | 'KES'
    | 'KGS'
    | 'KHR'
    | 'KMF'
    | 'KPW'
    | 'KRW'
    | 'KWD'
    | 'KYD'
    | 'KZT'
    | 'LAK'
    | 'LBP'
    | 'LKR'
    | 'LRD'
    | 'LSL'
    | 'LTL'
    | 'LYD'
    | 'MAD'
    | 'MDL'
    | 'MGA'
    | 'MKD'
    | 'MMK'
    | 'MNT'
    | 'MOP'
    | 'MRO'
    | 'MRU'
    | 'MUR'
    | 'MVR'
    | 'MWK'
    | 'MXN'
    | 'MYR'
    | 'MZN'
    | 'NAD'
    | 'NGN'
    | 'NIO'
    | 'NOK'
    | 'NPR'
    | 'NZD'
    | 'OMR'
    | 'PAB'
    | 'PEN'
    | 'PGK'
    | 'PHP'
    | 'PKR'
    | 'PLN'
    | 'PYG'
    | 'QAR'
    | 'RON'
    | 'RSD'
    | 'RUB'
    | 'RUR'
    | 'RWF'
    | 'SAR'
    | 'SBD'
    | 'SCR'
    | 'SDG'
    | 'SEK'
    | 'SGD'
    | 'SHP'
    | 'SLL'
    | 'SOS'
    | 'SRD'
    | 'SSP'
    | 'STD'
    | 'STN'
    | 'SVC'
    | 'SYP'
    | 'SZL'
    | 'THB'
    | 'TJS'
    | 'TMT'
    | 'TND'
    | 'TOP'
    | 'TRY'
    | 'TTD'
    | 'TWD'
    | 'TZS'
    | 'UAH'
    | 'UGX'
    | 'USD'
    | 'UYU'
    | 'UZS'
    | 'VEF'
    | 'VES'
    | 'VND'
    | 'VUV'
    | 'WST'
    | 'XAF'
    | 'XCD'
    | 'XOF'
    | 'XPF'
    | 'YER'
    | 'ZAR'
    | 'ZMW'
    | 'ZWL';
  isPersonal: boolean;
  limits: CurrencyLimit[];
  disabledMccGroups: (
    | 'CHILD_CARE'
    | 'DIGITAL_GOODS'
    | 'EDUCATION'
    | 'ENTERTAINMENT'
    | 'FOOD_BEVERAGE'
    | 'GAMBLING'
    | 'GOVERNMENT'
    | 'HEALTH'
    | 'MEMBERSHIPS'
    | 'MONEY_TRANSFER'
    | 'SERVICES'
    | 'SHOPPING'
    | 'TRAVEL'
    | 'UTILITIES'
    | 'OTHER'
  )[];
  disabledPaymentTypes: ('POS' | 'ONLINE' | 'MANUAL_ENTRY')[];
  disableForeign: boolean;

  /** The Stripe reference for a previously cancelled card that this is replacing */
  replacementFor?: string;

  /** The reason this card is a replacement. Required if replacementFor is provided. If LOST or STOLEN, the card must have had a similar reason set in Stripe for its cancellation */
  replacementReason?: 'LOST' | 'STOLEN' | 'DAMAGED' | 'EXPIRED';

  /** @example DEBIT */
  binType?: 'DEBIT';

  /** @example DEBIT */
  fundingType?: 'POOLED' | 'INDIVIDUAL';
  shippingAddress?: Address;
}

export const legacyCardDetailsConversion = (
  data: Readonly<Required<CardDetailsResponse>>,
): Readonly<Required<LegacyCardDetailsResponse>> => ({
  card: data.card,
  ledgerBalance: data.ledgerBalance,
  availableBalance: data.availableBalance,
  allocationName: data.linkedAllocationName,
  limits: data.allocationSpendControls[0]?.limits ?? [],
  disabledMccGroups: data.allocationSpendControls[0]?.disabledMccGroups ?? [],
  disabledPaymentTypes: data.allocationSpendControls[0]?.disabledPaymentTypes ?? [],
  disableForeign: data.allocationSpendControls[0]?.disableForeign ?? false,
  allowedAllocationIds: data.allocationSpendControls.map((item) => item.allocationId),
});
export const legacyUpdateCardConversion = (
  data: Readonly<LegacyUpdateCardRequest>,
  allocationId: string,
): Readonly<UpdateCardSpendControlsRequest> => ({
  allocationSpendControls: [
    {
      allocationId,
      limits: data.limits,
      disabledMccGroups: data.disabledMccGroups,
      disabledPaymentTypes: data.disabledPaymentTypes,
      disableForeign: data.disableForeign,
    },
  ],
});
export const legacyIssueCardConversion = (data: Readonly<LegacyIssueCardRequest>): Readonly<IssueCardRequest> => ({
  binType: data.binType,
  fundingType: data.fundingType,
  cardType: [data.cardType as CardType],
  userId: data.userId,
  currency: data.currency,
  isPersonal: data.isPersonal,
  shippingAddress: data.shippingAddress,
  replacementFor: data.replacementFor,
  replacementReason: data.replacementReason,
  allocationSpendControls: [
    {
      allocationId: data.allocationId,
      limits: data.limits,
      disabledMccGroups: data.disabledMccGroups,
      disabledPaymentTypes: data.disabledPaymentTypes,
      disableForeign: data.disableForeign,
    },
  ],
});
