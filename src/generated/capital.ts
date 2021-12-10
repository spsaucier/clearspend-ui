/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type { UUIDString } from "app/types/common";

export interface ControllerError {
  message?: string;
}

export interface Address {
  streetLine1?: string;
  streetLine2?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  country?:
    | 'UNSPECIFIED'
    | 'ABW'
    | 'AFG'
    | 'AGO'
    | 'AIA'
    | 'ALA'
    | 'ALB'
    | 'AND'
    | 'ARE'
    | 'ARG'
    | 'ARM'
    | 'ASM'
    | 'ATA'
    | 'ATF'
    | 'ATG'
    | 'AUS'
    | 'AUT'
    | 'AZE'
    | 'BDI'
    | 'BEL'
    | 'BEN'
    | 'BES'
    | 'BFA'
    | 'BGD'
    | 'BGR'
    | 'BHR'
    | 'BHS'
    | 'BIH'
    | 'BLM'
    | 'BLR'
    | 'BLZ'
    | 'BMU'
    | 'BOL'
    | 'BRA'
    | 'BRB'
    | 'BRN'
    | 'BTN'
    | 'BVT'
    | 'BWA'
    | 'CAF'
    | 'CAN'
    | 'CCK'
    | 'CHE'
    | 'CHL'
    | 'CHN'
    | 'CIV'
    | 'CMR'
    | 'COD'
    | 'COG'
    | 'COK'
    | 'COL'
    | 'COM'
    | 'CPV'
    | 'CRI'
    | 'CUB'
    | 'CUW'
    | 'CXR'
    | 'CYM'
    | 'CYP'
    | 'CZE'
    | 'DEU'
    | 'DJI'
    | 'DMA'
    | 'DNK'
    | 'DOM'
    | 'DZA'
    | 'ECU'
    | 'EGY'
    | 'ERI'
    | 'ESH'
    | 'ESP'
    | 'EST'
    | 'ETH'
    | 'FIN'
    | 'FJI'
    | 'FLK'
    | 'FRA'
    | 'FRO'
    | 'FSM'
    | 'GAB'
    | 'GBR'
    | 'GEO'
    | 'GGY'
    | 'GHA'
    | 'GIB'
    | 'GIN'
    | 'GLP'
    | 'GMB'
    | 'GNB'
    | 'GNQ'
    | 'GRC'
    | 'GRD'
    | 'GRL'
    | 'GTM'
    | 'GUF'
    | 'GUM'
    | 'GUY'
    | 'HKG'
    | 'HMD'
    | 'HND'
    | 'HRV'
    | 'HTI'
    | 'HUN'
    | 'IDN'
    | 'IMN'
    | 'IND'
    | 'IOT'
    | 'IRL'
    | 'IRN'
    | 'IRQ'
    | 'ISL'
    | 'ISR'
    | 'ITA'
    | 'JAM'
    | 'JEY'
    | 'JOR'
    | 'JPN'
    | 'KAZ'
    | 'KEN'
    | 'KGZ'
    | 'KHM'
    | 'KIR'
    | 'KNA'
    | 'KOR'
    | 'KWT'
    | 'LAO'
    | 'LBN'
    | 'LBR'
    | 'LBY'
    | 'LCA'
    | 'LIE'
    | 'LKA'
    | 'LSO'
    | 'LTU'
    | 'LUX'
    | 'LVA'
    | 'MAC'
    | 'MAF'
    | 'MAR'
    | 'MCO'
    | 'MDA'
    | 'MDG'
    | 'MDV'
    | 'MEX'
    | 'MHL'
    | 'MKD'
    | 'MLI'
    | 'MLT'
    | 'MMR'
    | 'MNE'
    | 'MNG'
    | 'MNP'
    | 'MOZ'
    | 'MRT'
    | 'MSR'
    | 'MTQ'
    | 'MUS'
    | 'MWI'
    | 'MYS'
    | 'MYT'
    | 'NAM'
    | 'NCL'
    | 'NER'
    | 'NFK'
    | 'NGA'
    | 'NIC'
    | 'NIU'
    | 'NLD'
    | 'NOR'
    | 'NPL'
    | 'NRU'
    | 'NZL'
    | 'OMN'
    | 'PAK'
    | 'PAN'
    | 'PCN'
    | 'PER'
    | 'PHL'
    | 'PLW'
    | 'PNG'
    | 'POL'
    | 'PRI'
    | 'PRK'
    | 'PRT'
    | 'PRY'
    | 'PSE'
    | 'PYF'
    | 'QAT'
    | 'REU'
    | 'ROU'
    | 'RUS'
    | 'RWA'
    | 'SAU'
    | 'SDN'
    | 'SEN'
    | 'SGP'
    | 'SGS'
    | 'SHN'
    | 'SJM'
    | 'SLB'
    | 'SLE'
    | 'SLV'
    | 'SMR'
    | 'SOM'
    | 'SPM'
    | 'SRB'
    | 'SSD'
    | 'STP'
    | 'SUR'
    | 'SVK'
    | 'SVN'
    | 'SWE'
    | 'SWZ'
    | 'SXM'
    | 'SYC'
    | 'SYR'
    | 'TCA'
    | 'TCD'
    | 'TGO'
    | 'THA'
    | 'TJK'
    | 'TKL'
    | 'TKM'
    | 'TLS'
    | 'TON'
    | 'TTO'
    | 'TUN'
    | 'TUR'
    | 'TUV'
    | 'TWN'
    | 'TZA'
    | 'UGA'
    | 'UKR'
    | 'UMI'
    | 'URY'
    | 'USA'
    | 'UZB'
    | 'VAT'
    | 'VCT'
    | 'VEN'
    | 'VGB'
    | 'VIR'
    | 'VNM'
    | 'VUT'
    | 'WLF'
    | 'WSM'
    | 'YEM'
    | 'ZAF'
    | 'ZMB'
    | 'ZWE';
}

export interface CreateUserRequest {
  /**
   * The first name of the person
   * @example John
   */
  firstName: string;

  /**
   * The last name of the person
   * @example Wick
   */
  lastName: string;
  address?: Address;

  /**
   * Email address of the person
   * @pattern ^[^@]+@[^@.]+\.[^@]+$
   * @example johnw@hightable.com
   */
  email: string;

  /**
   * Phone number in e.164 format
   * @pattern ^\+[1-9][0-9]{9,14}$
   * @example +1234567890
   */
  phone?: string;

  /** Flag to indicate whether a password should be created for the user */
  generatePassword?: boolean;
}

export interface CreateUserResponse {
  userId: TypedIdUserId;

  /** Flag to indicate whether a password should be created for the user */
  password?: string;

  /** Error message for any records that failed. Will be null if successful */
  errorMessage?: string;
}

export type TypedIdUserId = UUIDString;

export interface OrderBy {
  /** @pattern [a-zA-Z0-9_\-]* */
  item?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PageRequest {
  /** @format int32 */
  pageNumber: number;

  /** @format int32 */
  pageSize: number;
  orderBy?: OrderBy[];
}

export interface SearchUserRequest {
  allocations?: TypedIdAllocationId[];
  hasVirtualCard?: boolean;
  hasPhysicalCard?: boolean;
  withoutCard?: boolean;
  searchText?: string;
  pageRequest?: PageRequest;
}

export type TypedIdAllocationId = UUIDString;

export interface CardInfo {
  cardId?: TypedIdCardId;
  lastFour?: string;
  allocationName?: string;
  ownerFirstName?: string;
  ownerLastName?: string;
}

export interface PagedDataUserPageData {
  /** @format int32 */
  pageNumber?: number;

  /** @format int32 */
  pageSize?: number;

  /** @format int64 */
  totalElements?: number;
  content?: UserPageData[];
}

export type TypedIdCardId = UUIDString;

export interface UserData {
  userId?: TypedIdUserId;
  type?: 'EMPLOYEE' | 'BUSINESS_OWNER';
  firstName?: string;
  lastName?: string;
}

export interface UserPageData {
  userData?: UserData;
  email?: string;
  cardInfoList?: CardInfo[];
}

export type TypedIdAccountActivityId = UUIDString;

export type TypedIdReceiptId = UUIDString;

export interface CreateProgramRequest {
  fundingType?: 'POOLED' | 'INDIVIDUAL';
  cardType?: 'PLASTIC' | 'VIRTUAL';
  i2c_program_ref?: string;
  bin?: string;
  name?: string;
}

export interface CreateProgramResponse {
  programId: TypedIdProgramId;
}

export type TypedIdProgramId = UUIDString;

export interface Amount {
  /** @example USD */
  currency: 'UNSPECIFIED' | 'USD';

  /** @example 100 */
  amount: number;
}

export interface NetworkMessageRequest {
  cardId?: TypedIdCardId;
  networkMessageType?:
    | 'PRE_AUTH_TRANSACTION'
    | 'PRE_AUTH_TRANSACTION_ADVICE'
    | 'FINANCIAL_TRANSACTION'
    | 'FINANCIAL_TRANSACTION_ADVICE'
    | 'REVERSAL_TRANSACTION'
    | 'REVERSAL_TRANSACTION_ADVICE'
    | 'SERVICE_FEE_TRANSACTION';
  amount?: Amount;
}

export interface NetworkMessageResponse {
  networkMessageId?: TypedIdNetworkMessageId;
}

export type TypedIdNetworkMessageId = UUIDString;

export interface KycPassRequest {
  to?: string;
  firstName?: string;
}

export interface KycFailRequest {
  to?: string;
  firstName?: string;
  reasons?: string[];
}

export type TypedIdBusinessId = UUIDString;

export interface CreateBusinessOwnerRequest {
  businessId?: TypedIdBusinessId;
  businessOwnerId?: TypedIdBusinessOwnerId;
  username?: string;
  password?: string;
}

export type TypedIdBusinessOwnerId = UUIDString;

export type TypedIdBusinessBankAccountId = UUIDString;

export interface TransactBankAccountRequest {
  bankAccountTransactType?: 'DEPOSIT' | 'WITHDRAW';
  amount?: Amount;

  /**
   * Indicate if transaction is requested during the onboarding process
   * @example false
   */
  isOnboarding?: boolean;
}

export interface CreateAdjustmentResponse {
  adjustmentId?: TypedIdAdjustmentId;
}

export type TypedIdAdjustmentId = UUIDString;

export interface CreateReceiptResponse {
  receiptId?: TypedIdReceiptId;
}

export interface HealthCheckRequest {
  Header?: I2CHeader;
  HealthCheckId?: string;
}

export interface I2CHeader {
  Id?: string;
  UserId?: string;
  Password?: string;

  /** @format date-time */
  MessageCreation?: string;
}

export interface HealthCheckResponse {
  ResponseCode?: string;
  HealthCheckId?: string;
}

export interface CardAcceptor {
  AcquirerId?: string;
  MerchantCode?: string;
  NameAndLocation?: string;
  MerchantCity?: string;
  MerchantState?: string;
  MerchantZipCode?: string;

  /** @format int32 */
  MCC?: number;
  DeviceId?: string;
  DeviceType?: string;

  /** @format date-time */
  LocalDateTime?: string;
  merchantName?: string;
  merchantCountry?:
    | 'UNSPECIFIED'
    | 'ABW'
    | 'AFG'
    | 'AGO'
    | 'AIA'
    | 'ALA'
    | 'ALB'
    | 'AND'
    | 'ARE'
    | 'ARG'
    | 'ARM'
    | 'ASM'
    | 'ATA'
    | 'ATF'
    | 'ATG'
    | 'AUS'
    | 'AUT'
    | 'AZE'
    | 'BDI'
    | 'BEL'
    | 'BEN'
    | 'BES'
    | 'BFA'
    | 'BGD'
    | 'BGR'
    | 'BHR'
    | 'BHS'
    | 'BIH'
    | 'BLM'
    | 'BLR'
    | 'BLZ'
    | 'BMU'
    | 'BOL'
    | 'BRA'
    | 'BRB'
    | 'BRN'
    | 'BTN'
    | 'BVT'
    | 'BWA'
    | 'CAF'
    | 'CAN'
    | 'CCK'
    | 'CHE'
    | 'CHL'
    | 'CHN'
    | 'CIV'
    | 'CMR'
    | 'COD'
    | 'COG'
    | 'COK'
    | 'COL'
    | 'COM'
    | 'CPV'
    | 'CRI'
    | 'CUB'
    | 'CUW'
    | 'CXR'
    | 'CYM'
    | 'CYP'
    | 'CZE'
    | 'DEU'
    | 'DJI'
    | 'DMA'
    | 'DNK'
    | 'DOM'
    | 'DZA'
    | 'ECU'
    | 'EGY'
    | 'ERI'
    | 'ESH'
    | 'ESP'
    | 'EST'
    | 'ETH'
    | 'FIN'
    | 'FJI'
    | 'FLK'
    | 'FRA'
    | 'FRO'
    | 'FSM'
    | 'GAB'
    | 'GBR'
    | 'GEO'
    | 'GGY'
    | 'GHA'
    | 'GIB'
    | 'GIN'
    | 'GLP'
    | 'GMB'
    | 'GNB'
    | 'GNQ'
    | 'GRC'
    | 'GRD'
    | 'GRL'
    | 'GTM'
    | 'GUF'
    | 'GUM'
    | 'GUY'
    | 'HKG'
    | 'HMD'
    | 'HND'
    | 'HRV'
    | 'HTI'
    | 'HUN'
    | 'IDN'
    | 'IMN'
    | 'IND'
    | 'IOT'
    | 'IRL'
    | 'IRN'
    | 'IRQ'
    | 'ISL'
    | 'ISR'
    | 'ITA'
    | 'JAM'
    | 'JEY'
    | 'JOR'
    | 'JPN'
    | 'KAZ'
    | 'KEN'
    | 'KGZ'
    | 'KHM'
    | 'KIR'
    | 'KNA'
    | 'KOR'
    | 'KWT'
    | 'LAO'
    | 'LBN'
    | 'LBR'
    | 'LBY'
    | 'LCA'
    | 'LIE'
    | 'LKA'
    | 'LSO'
    | 'LTU'
    | 'LUX'
    | 'LVA'
    | 'MAC'
    | 'MAF'
    | 'MAR'
    | 'MCO'
    | 'MDA'
    | 'MDG'
    | 'MDV'
    | 'MEX'
    | 'MHL'
    | 'MKD'
    | 'MLI'
    | 'MLT'
    | 'MMR'
    | 'MNE'
    | 'MNG'
    | 'MNP'
    | 'MOZ'
    | 'MRT'
    | 'MSR'
    | 'MTQ'
    | 'MUS'
    | 'MWI'
    | 'MYS'
    | 'MYT'
    | 'NAM'
    | 'NCL'
    | 'NER'
    | 'NFK'
    | 'NGA'
    | 'NIC'
    | 'NIU'
    | 'NLD'
    | 'NOR'
    | 'NPL'
    | 'NRU'
    | 'NZL'
    | 'OMN'
    | 'PAK'
    | 'PAN'
    | 'PCN'
    | 'PER'
    | 'PHL'
    | 'PLW'
    | 'PNG'
    | 'POL'
    | 'PRI'
    | 'PRK'
    | 'PRT'
    | 'PRY'
    | 'PSE'
    | 'PYF'
    | 'QAT'
    | 'REU'
    | 'ROU'
    | 'RUS'
    | 'RWA'
    | 'SAU'
    | 'SDN'
    | 'SEN'
    | 'SGP'
    | 'SGS'
    | 'SHN'
    | 'SJM'
    | 'SLB'
    | 'SLE'
    | 'SLV'
    | 'SMR'
    | 'SOM'
    | 'SPM'
    | 'SRB'
    | 'SSD'
    | 'STP'
    | 'SUR'
    | 'SVK'
    | 'SVN'
    | 'SWE'
    | 'SWZ'
    | 'SXM'
    | 'SYC'
    | 'SYR'
    | 'TCA'
    | 'TCD'
    | 'TGO'
    | 'THA'
    | 'TJK'
    | 'TKL'
    | 'TKM'
    | 'TLS'
    | 'TON'
    | 'TTO'
    | 'TUN'
    | 'TUR'
    | 'TUV'
    | 'TWN'
    | 'TZA'
    | 'UGA'
    | 'UKR'
    | 'UMI'
    | 'URY'
    | 'USA'
    | 'UZB'
    | 'VAT'
    | 'VCT'
    | 'VEN'
    | 'VGB'
    | 'VIR'
    | 'VNM'
    | 'VUT'
    | 'WLF'
    | 'WSM'
    | 'YEM'
    | 'ZAF'
    | 'ZMB'
    | 'ZWE';
}

export interface EventNotificationAdvanceRequest {
  Header?: I2CHeader;
  Transaction?: I2CTransaction;
  Card?: I2CCard;
}

export interface I2CCard {
  CardNo?: string;
  encryptedCardNumber?: NullableEncryptedString;
  CardProgramID?: string;
  CardReferenceID?: string;
  PrimaryCardNo?: string;
  PrimaryCardReferenceID?: string;
  CustomerId?: string;
  MemberId?: string;
  AvailableBalance?: string;
  LedgerBalance?: string;
  CardStatus?: string;
  FirstName?: string;
  LastName?: string;
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  State?: string;
  PostalCode?: string;
  CountryCode?: string;
  CellNo?: string;
  Email?: string;
  SourceCardReferenceNo?: string;
  SourceCardNo?: string;
}

export interface I2CTransaction {
  NotificationEventId?: string;
  TransactionId?: string;
  MessageType?: string;

  /** @format date */
  Date?: string;
  Time?: {
    offset?: {
      totalSeconds?: number;
      id?: string;
      rules?: {
        fixedOffset?: boolean;
        transitions?: {
          duration?: {
            seconds?: number;
            nano?: number;
            negative?: boolean;
            zero?: boolean;
            units?: {
              dateBased?: boolean;
              timeBased?: boolean;
              durationEstimated?: boolean;
            }[];
          };
          gap?: boolean;
          dateTimeBefore?: string;
          dateTimeAfter?: string;
          overlap?: boolean;
          instant?: string;
        }[];
        transitionRules?: {
          month?:
            | 'JANUARY'
            | 'FEBRUARY'
            | 'MARCH'
            | 'APRIL'
            | 'MAY'
            | 'JUNE'
            | 'JULY'
            | 'AUGUST'
            | 'SEPTEMBER'
            | 'OCTOBER'
            | 'NOVEMBER'
            | 'DECEMBER';
          timeDefinition?: 'UTC' | 'WALL' | 'STANDARD';
          dayOfWeek?: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
          dayOfMonthIndicator?: number;
          localTime?: LocalTime;
          midnightEndOfDay?: boolean;
        }[];
      };
    };
    hour?: number;
    minute?: number;
    second?: number;
    nano?: number;
  };
  CardAcceptor?: CardAcceptor;
  TransactionType?: string;
  Service?: string;
  RequestedAmount?: string;
  RequestedAmountCurrency?: string;
  TransactionAmount?: string;
  TransactionCurrency?: string;
  TransactionResponseCode?: string;
  InterchangeFee?: string;
  PANEntryMode?: string;
  AuthorizationCode?: string;
  ARN?: string;
  RetrievalReferenceNo?: string;
  SystemTraceAuditNo?: string;
  NetworkId?: string;
  OriginalTransId?: string;
  TransferID?: string;
  BankAccountNumber?: string;
  TransactionDescription?: string;
  ExternalTransReference?: string;
  ExternalUserReference?: string;
  ExternalLinkedCardRefID?: string;
  ExternalLinkedCardProfileSet1?: string;
  ExternalLinkedCardProfileSet2?: string;
  PanSequenceNo?: string;
  FraudParameter?: string;
}

export interface LocalTime {
  /** @format int32 */
  hour?: number;

  /** @format int32 */
  minute?: number;

  /** @format int32 */
  second?: number;

  /** @format int32 */
  nano?: number;
}

export interface NullableEncryptedString {
  encrypted?: string;
}

export interface EventNotificationAdvanceResponse {
  ResponseCode?: string;
  NotificationEventId?: string;
}

export interface IssueCardRequest {
  programId: TypedIdProgramId;
  allocationId: TypedIdAllocationId;
  userId: TypedIdUserId;
  currency: 'UNSPECIFIED' | 'USD';
  cardType: ('PLASTIC' | 'VIRTUAL')[];
  isPersonal: boolean;
  dailySpend?: Amount;
  monthlySpend?: Amount;
}

export interface IssueCardResponse {
  cardId: TypedIdCardId;

  /** Error message for any records that failed. Will be null if successful */
  errorMessage?: string;
}

export interface SearchCardRequest {
  pageRequest: PageRequest;
  userId?: TypedIdUserId;
  allocationId?: TypedIdAllocationId;
  searchText?: string;
}

export interface ItemTypedIdAllocationId {
  id?: TypedIdAllocationId;
  name?: string;
}

export interface PagedDataSearchCardData {
  /** @format int32 */
  pageNumber?: number;

  /** @format int32 */
  pageSize?: number;

  /** @format int64 */
  totalElements?: number;
  content?: SearchCardData[];
}

export interface SearchCardData {
  cardId?: TypedIdCardId;
  cardNumber?: string;
  user?: UserData;
  allocation?: ItemTypedIdAllocationId;
  balance?: Amount;
  cardStatus?: 'OPEN' | 'BLOCKED' | 'RETIRED';
  cardType?: 'PLASTIC' | 'VIRTUAL';
}

export interface SearchBusinessAllocationRequest {
  name: string;
}

export interface Account {
  accountId: TypedIdAccountId;
  businessId: TypedIdBusinessId;
  ledgerAccountId: TypedIdLedgerAccountId;
  type: 'ALLOCATION' | 'CARD';

  /** @format uuid */
  ownerId: string;
  ledgerBalance: Amount;
}

export interface Allocation {
  allocationId: TypedIdAllocationId;
  name: string;
  ownerId: TypedIdUserId;
  account: Account;
  parentAllocationId?: TypedIdAllocationId;
  childrenAllocationIds?: TypedIdAllocationId[];
}

export type TypedIdAccountId = UUIDString;

export type TypedIdLedgerAccountId = UUIDString;

export interface CreateBusinessProspectRequest {
  /**
   * Email address of the prospect
   * @pattern ^[^@]+@[^@.]+\.[^@]+$
   * @example johnw@hightable.com
   */
  email: string;

  /**
   * The first name of the person
   * @example John
   */
  firstName: string;

  /**
   * The last name of the person
   * @example Wick
   */
  lastName: string;
}

export interface CreateBusinessProspectResponse {
  businessProspectId?: TypedIdBusinessProspectId;
  businessProspectStatus?: 'NEW' | 'EMAIL_VERIFIED' | 'MOBILE_VERIFIED' | 'COMPLETED';
}

export type TypedIdBusinessProspectId = UUIDString;

export interface ValidateBusinessProspectIdentifierRequest {
  /**
   * Type of Identifier to validate
   * @example EMAIL
   */
  identifierType?: 'EMAIL' | 'PHONE';

  /**
   * OTP received via email/phone
   * @example 67890
   */
  otp?: string;
}

export interface SetBusinessProspectPhoneRequest {
  /**
   * Phone number in e.164 format
   * @pattern ^\+[1-9][0-9]{9,14}$
   * @example +1234567890
   */
  phone?: string;
}

export interface SetBusinessProspectPasswordRequest {
  /** @example excommunicado */
  password?: string;
}

export interface ConvertBusinessProspectRequest {
  legalName?: string;
  businessType?: 'UNSPECIFIED' | 'LLC' | 'LLP' | 'S_CORP' | 'C_CORP' | 'B_CORP' | 'SOLE_PROPRIETORSHIP' | '_501_C_3';

  /** @pattern ^[1-9][0-9]{8}$ */
  employerIdentificationNumber?: string;

  /**
   * Phone number in e.164 format
   * @pattern ^\+[1-9][0-9]{9,14}$
   * @example +1234567890
   */
  businessPhone?: string;
  address?: Address;
}

export interface Business {
  businessId?: TypedIdBusinessId;
  legalName?: string;
  businessType?: 'UNSPECIFIED' | 'LLC' | 'LLP' | 'S_CORP' | 'C_CORP' | 'B_CORP' | 'SOLE_PROPRIETORSHIP' | '_501_C_3';
  employerIdentificationNumber?: string;

  /**
   * Phone number in e.164 format
   * @example +1234567890
   */
  businessPhone?: string;
  address?: Address;
  onboardingStep?: 'BUSINESS_OWNERS' | 'SOFT_FAIL' | 'REVIEW' | 'LINK_ACCOUNT' | 'TRANSFER_MONEY' | 'COMPLETE';
  knowYourBusinessStatus?: 'PENDING' | 'REVIEW' | 'FAIL' | 'PASS';
  status?: 'ONBOARDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
}

export interface ConvertBusinessProspectResponse {
  business?: Business;
  businessOwnerId?: TypedIdBusinessOwnerId;
}

export interface CreateOrUpdateBusinessOwnerRequest {
  /**
   * The first name of the person
   * @example John
   */
  firstName: string;

  /**
   * The last name of the person
   * @example Wick
   */
  lastName: string;

  /**
   * The date of birth of the person
   * @format date
   * @example 1990-01-01
   */
  dateOfBirth: string;

  /**
   * The tax identification number of the person
   * @example 091827364
   */
  taxIdentificationNumber: string;

  /**
   * Email address of the person
   * @pattern ^[^@]+@[^@.]+\.[^@]+$
   * @example johnw@hightable.com
   */
  email: string;
  address?: Address;

  /**
   * Phone address of the person
   * @pattern ^\+[1-9][0-9]{9,14}$
   * @example +12345679
   */
  phone?: string;

  /**
   * Indication if business owner is updated during the onboarding process
   * @example false
   */
  isOnboarding?: boolean;
}

export interface CreateBusinessOwnerResponse {
  businessOwnerId: TypedIdBusinessOwnerId;

  /** Error message for any records that failed. Will be null if successful */
  errorMessage?: string;
}

export interface CreateBinRequest {
  bin?: string;
  name?: string;
}

export interface CreateBinResponse {
  binId: TypedIdBinId;
}

export type TypedIdBinId = UUIDString;

export interface ResetPasswordRequest {
  changePasswordId?: string;
  newPassword?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface User {
  userId?: TypedIdUserId;
  businessId?: TypedIdBusinessId;
  type?: 'EMPLOYEE' | 'BUSINESS_OWNER';
  firstName?: string;
  lastName?: string;
  address?: Address;
  email?: string;
  phone?: string;
}

export interface ForgotPasswordRequest {
  email?: string;
}

export interface CreateAllocationRequest {
  /**
   * name of the department/ allocation
   * @example advertisement
   */
  name: string;
  parentAllocationId: TypedIdAllocationId;
  ownerId: TypedIdUserId;
  amount: Amount;
}

export interface CreateAllocationResponse {
  allocationId: TypedIdAllocationId;
}

export interface AllocationFundCardRequest {
  allocationAccountId: TypedIdAccountId;
  cardId: TypedIdCardId;

  /** @example DEPOSIT */
  reallocationType: 'ALLOCATION_TO_CARD' | 'CARD_TO_ALLOCATION';
  amount: Amount;
}

export interface AllocationFundCardResponse {
  businessAdjustmentId?: TypedIdAdjustmentId;
  businessLedgerBalance?: Amount;
  allocationAdjustmentId?: TypedIdAdjustmentId;
  allocationLedgerBalance?: Amount;
}

export interface AccountActivityRequest {
  pageRequest: PageRequest;
  allocationId?: TypedIdAllocationId;
  userId?: TypedIdUserId;
  cardId?: TypedIdCardId;
  searchText?: string;
  type?:
    | 'BANK_LINK'
    | 'BANK_DEPOSIT'
    | 'BANK_DEPOSIT_RETURN'
    | 'BANK_WITHDRAWAL'
    | 'BANK_WITHDRAWAL_RETURN'
    | 'BANK_UNLINK'
    | 'REALLOCATE'
    | 'NETWORK_PRE_AUTH'
    | 'NETWORK_FINANCIAL_AUTH'
    | 'NETWORK_REVERSAL'
    | 'NETWORK_SERVICE_FEE';

  /** @format date-time */
  from?: string;

  /** @format date-time */
  to?: string;
}

export interface AccountActivityResponse {
  accountActivityId?: TypedIdAccountActivityId;

  /** @format date-time */
  activityTime?: string;
  accountName?: string;
  card?: CardInfo;
  merchant?: Merchant;
  type?:
    | 'BANK_LINK'
    | 'BANK_DEPOSIT'
    | 'BANK_DEPOSIT_RETURN'
    | 'BANK_WITHDRAWAL'
    | 'BANK_WITHDRAWAL_RETURN'
    | 'BANK_UNLINK'
    | 'REALLOCATE'
    | 'NETWORK_PRE_AUTH'
    | 'NETWORK_FINANCIAL_AUTH'
    | 'NETWORK_REVERSAL'
    | 'NETWORK_SERVICE_FEE';
  status?: 'PENDING' | 'DECLINED' | 'APPROVED' | 'PROCESSED';
  amount?: Amount;
  receipt?: ReceiptDetails;
}

export interface Merchant {
  name?: string;
  type?: 'UTILITIES' | 'GROCERIES' | 'RESTAURANTS' | 'OTHERS';
  merchantNumber?: string;

  /** @format int32 */
  merchantCategoryCode?: number;
  merchantLogoUrl?: string;
  merchantLatitude?: number;
  merchantLongitude?: number;
}

export interface PagedDataAccountActivityResponse {
  /** @format int32 */
  pageNumber?: number;

  /** @format int32 */
  pageSize?: number;

  /** @format int64 */
  totalElements?: number;
  content?: AccountActivityResponse[];
}

export interface ReceiptDetails {
  receiptId?: TypedIdReceiptId;
}

export interface UpdateUserRequest {
  /**
   * The first name of the person
   * @example John
   */
  firstName: string;

  /**
   * The last name of the person
   * @example Wick
   */
  lastName: string;
  address?: Address;

  /**
   * Email address of the person
   * @pattern ^[^@]+@[^@.]+\.[^@]+$
   * @example johnw@hightable.com
   */
  email: string;

  /**
   * Phone number in e.164 format
   * @pattern ^\+[1-9][0-9]{9,14}$
   * @example +1234567890
   */
  phone?: string;

  /** Flag to indicate whether a password should be created for the user */
  generatePassword?: boolean;
}

export interface UpdateUserResponse {
  userId: TypedIdUserId;

  /** Error message for any records that failed. Will be null if successful */
  errorMessage?: string;
}

export interface UpdateCardStatusRequest {
  /** @example BLOCKED */
  status?: 'OPEN' | 'BLOCKED' | 'RETIRED';

  /** @example CARDHOLDER_REQUESTED */
  statusReason?: 'NONE' | 'CARDHOLDER_REQUESTED';
}

export interface Card {
  cardId?: TypedIdCardId;
  bin?: string;
  programId?: TypedIdProgramId;
  allocationId?: TypedIdAllocationId;
  userId?: TypedIdUserId;
  accountId?: TypedIdAccountId;
  status?: 'OPEN' | 'BLOCKED' | 'RETIRED';
  statusReason?: 'NONE' | 'CARDHOLDER_REQUESTED';
  fundingType?: 'POOLED' | 'INDIVIDUAL';

  /** @format date-time */
  issueDate?: string;

  /** @format date */
  expirationDate?: string;
  activated?: boolean;

  /** @format date-time */
  activationDate?: string;
  cardLine3?: string;
  cardLine4?: string;
  type?: 'PLASTIC' | 'VIRTUAL';
  superseded?: boolean;
  cardNumber?: string;
  lastFour?: string;
  address?: Address;
}

export interface UpdateAccountActivityRequest {
  notes: string;
}

export interface Agent {
  email?: string;
  external_id?: string;
}

export interface AlloyWebHookResponse {
  request_token?: string;
  timestamp?: string;
  type?: string;
  description?: string;
  data?: Data;
}

export interface ChildEntity {
  entity_token?: string;
  evaluation_tokens?: string[];
}

export interface Data {
  service?: string;
  entity_token?: string;
  external_entity_id?: string;
  group_token?: string;
  external_group_id?: string;
  review_token?: string;
  application_token?: string;
  application_name?: string;
  outcome?: string;
  reason?: string;
  reasons?: string[];
  started?: string;
  timestamp?: string;
  completed?: string;
  reviewer?: string;
  agent?: Agent;
  notes?: object;
  child_entities?: ChildEntity[];
}

export interface UpdateAllocationRequest {
  /**
   * name of the department/ allocation
   * @example advertisement
   */
  name?: string;
  parentAllocationId?: TypedIdAllocationId;
  ownerId?: TypedIdUserId;
}

export interface AllocationDetails {
  allocation?: Allocation;
  owner?: UserData;
}

export interface CurrencyLimit {
  currency?: 'UNSPECIFIED' | 'USD';
  typeMap?: Record<string, Record<string, Limit>>;
}

export interface Limit {
  amount?: number;
  usedAmount?: number;
}

export interface UserCardResponse {
  card: Card;
  ledgerBalance: Amount;
  availableBalance: Amount;
  allocationName: string;
  limits?: CurrencyLimit[];
  limitsFromTransactionLimits?: Record<string, Record<string, Record<string, number>>>;
}

export interface Program {
  programId?: TypedIdProgramId;
  name?: string;
  bin?: string;
  fundingType?: 'POOLED' | 'INDIVIDUAL';
  cardType?: 'PLASTIC' | 'VIRTUAL';
}

export interface Bin {
  bin?: string;
  name?: string;

  /** @format int64 */
  version?: number;

  /** @format date-time */
  created?: string;

  /** @format date-time */
  updated?: string;
  id?: TypedIdBinId;
}

export interface CreateTestDataResponse {
  bins?: Bin[];
  programs?: Program[];
  businesses?: TestBusiness[];
}

export interface CreateUpdateUserRecord {
  user?: User;
  password?: string;
}

export interface TestBusiness {
  business?: Business;
  users?: User[];
  allocations?: Allocation[];
  cards?: Card[];
  createUserRecords?: CreateUpdateUserRecord[];
}

export interface GetBusinessesResponse {
  businesses?: Business[];
}

export interface KycDocuments {
  owner?: string;
  documents?: RequiredDocument[];
}

export interface ManualReviewResponse {
  kybRequiredDocuments?: RequiredDocument[];
  kycRequiredDocuments?: KycDocuments[];
}

export interface RequiredDocument {
  documentName?: string;
  type?: string;
  entityTokenId?: string;
}

export interface BankAccount {
  businessBankAccountId?: TypedIdBusinessBankAccountId;
  name?: string;
  routingNumber?: string;
  accountNumber?: string;
}

export interface LinkTokenResponse {
  linkToken?: string;
}
