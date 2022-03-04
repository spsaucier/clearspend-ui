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

export interface LimitTypeMap {
  limitType?: 'ACH_DEPOSIT' | 'ACH_WITHDRAW' | 'PURCHASE' | 'ATM_WITHDRAW';
}

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
    | 'ANT'
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
  /** @format uuid */
  userId: string;

  /** Flag to indicate whether a password should be created for the user */
  password?: string;

  /** Error message for any records that failed. Will be null if successful */
  errorMessage?: string;
}

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
  allocations?: string[];
  hasVirtualCard?: boolean;
  hasPhysicalCard?: boolean;
  withoutCard?: boolean;
  searchText?: string;
  includeArchived?: boolean;
  pageRequest?: PageRequest;
}

export interface CardInfo {
  /** @format uuid */
  cardId?: string;
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

export interface UserData {
  /** @format uuid */
  userId?: string;
  type?: 'EMPLOYEE' | 'BUSINESS_OWNER';
  firstName?: string;
  lastName?: string;
}

export interface UserPageData {
  userData?: UserData;
  email?: string;
  archived?: boolean;
  cardInfoList?: CardInfo[];
}

export interface Amount {
  /** @example USD */
  currency: 'UNSPECIFIED' | 'USD';

  /** @example 100 */
  amount: number;
}

export interface NetworkMessageRequest {
  /** @format uuid */
  cardId?: string;
  networkMessageType?: 'AUTH_REQUEST' | 'AUTH_CREATED' | 'AUTH_UPDATED' | 'TRANSACTION_CREATED';
  amount?: Amount;

  /** @format uuid */
  priorNetworkMessageId?: string;
}

export interface NetworkMessageResponse {
  /** @format uuid */
  networkMessageId?: string;
}

export interface KycPassRequest {
  to?: string;
  firstName?: string;
}

export interface KycFailRequest {
  to?: string;
  firstName?: string;
  reasons?: string[];
}

export interface CreateBusinessOwnerRequest {
  /** @format uuid */
  businessId?: string;

  /** @format uuid */
  businessOwnerId?: string;
  username?: string;
  password?: string;
}

export interface TransactBankAccountRequest {
  bankAccountTransactType?: 'DEPOSIT' | 'WITHDRAW';
  amount?: Amount;
}

export interface CreateAdjustmentResponse {
  /** @format uuid */
  adjustmentId?: string;
}

export interface CreateReceiptResponse {
  /** @format uuid */
  receiptId?: string;
}

export interface CodatError {
  itemId?: string;
  message?: string;
}

export interface CodatSyncDirectCostResponse {
  status?: string;
  pushOperationKey?: string;
  validation?: CodatValidation;
}

export interface CodatValidation {
  errors?: CodatError[];
}

export interface SyncTransactionResponse {
  status?: string;
  codatResponse?: CodatSyncDirectCostResponse;
}

export interface SyncLogRequest {
  pageRequest: PageRequest;
}

export interface PagedDataSyncLogResponse {
  /** @format int32 */
  pageNumber?: number;

  /** @format int32 */
  pageSize?: number;

  /** @format int64 */
  totalElements?: number;
  content?: SyncLogResponse[];
}

export interface SyncLogResponse {
  /** @format date-time */
  startTime?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  transactionId?: string;
}

export interface CodatCreateBankAccountRequest {
  accountName?: string;
  accountNumber?: string;
  accountType?: string;
  currency?: string;
  institution?: string;
}

export interface CodatCreateBankAccountResponse {
  validation?: CodatValidation;
  pushOperationKey?: string;
  status?: string;
}

export interface CodatWebhookPushStatusChangedRequest {
  CompanyId?: string;
  Data?: CodatWebhookPushStatusData;
}

export interface CodatWebhookPushStatusData {
  dataType?: string;
  status?: string;
  pushOperationKey?: string;
}

export interface CodatWebhookConnectionChangedData {
  dataConnectionId?: string;
  newStatus?: string;
}

export interface CodatWebhookConnectionChangedRequest {
  CompanyId?: string;
  Data?: CodatWebhookConnectionChangedData;
}

export interface AddChartOfAccountsMappingRequest {
  accountRef?: string;

  /** @format int32 */
  categoryIconRef?: number;
}

export interface ChartOfAccountsMappingResponse {
  accountRef?: string;

  /** @format int32 */
  categoryIconRef?: number;
}

export interface GetChartOfAccountsMappingResponse {
  results?: ChartOfAccountsMappingResponse[];
}

export interface CurrencyLimit {
  currency: 'UNSPECIFIED' | 'USD';
  typeMap: LimitTypeMap;
}

export interface IssueCardRequest {
  cardType: ('PHYSICAL' | 'VIRTUAL')[];

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
  currency: 'UNSPECIFIED' | 'USD';
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

  /** @example DEBIT */
  binType?: 'DEBIT';

  /** @example DEBIT */
  fundingType?: 'POOLED' | 'INDIVIDUAL';
  shippingAddress?: Address;
}

export interface IssueCardResponse {
  /** @format uuid */
  cardId: string;

  /** Error message for any records that failed. Will be null if successful */
  errorMessage?: string;
}

export interface SearchCardRequest {
  pageRequest: PageRequest;

  /** @format uuid */
  userId?: string;

  /** @format uuid */
  allocationId?: string;
  searchText?: string;
}

export interface ItemTypedIdAllocationId {
  /** @format uuid */
  id?: string;
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
  /** @format uuid */
  cardId?: string;
  cardNumber?: string;
  user?: UserData;
  allocation?: ItemTypedIdAllocationId;
  balance?: Amount;
  cardStatus?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
  cardType?: 'PHYSICAL' | 'VIRTUAL';
  activated?: boolean;

  /** @format date-time */
  activationDate?: string;
}

export interface RevealCardRequest {
  /** @format uuid */
  cardId?: string;
  nonce?: string;
}

export interface RevealCardResponse {
  externalRef?: string;
  ephemeralKey?: string;
}

export interface EphemeralKeyRequest {
  /** @format uuid */
  cardId?: string;
  apiVersion?: string;
}

export interface CardStatementRequest {
  /** @format uuid */
  cardId?: string;

  /** @format date-time */
  startDate?: string;

  /** @format date-time */
  endDate?: string;
}

export interface UpdateAllocationBalanceRequest {
  amount: Amount;

  /** @example CSR credit */
  notes: string;
}

export interface UpdateAllocationBalanceResponse {
  /** @format uuid */
  adjustmentId?: string;
  ledgerBalance?: Amount;
}

export interface UpdateBusiness {
  legalName?: string;
  businessType?:
    | 'INDIVIDUAL'
    | 'SOLE_PROPRIETORSHIP'
    | 'SINGLE_MEMBER_LLC'
    | 'MULTI_MEMBER_LLC'
    | 'PRIVATE_PARTNERSHIP'
    | 'PUBLIC_PARTNERSHIP'
    | 'PRIVATE_CORPORATION'
    | 'PUBLIC_CORPORATION'
    | 'INCORPORATED_NON_PROFIT';
  employerIdentificationNumber?: string;

  /**
   * Phone number in e.164 format
   * @example +1234567890
   */
  businessPhone?: string;
  address?: Address;
  mcc?: string;
  description?: string;
  url?: string;
}

export interface BusinessReallocationRequest {
  /** @format uuid */
  allocationIdFrom?: string;

  /** @format uuid */
  allocationIdTo?: string;
  amount?: Amount;
}

export interface BusinessFundAllocationResponse {
  /** @format uuid */
  adjustmentIdFrom?: string;
  ledgerBalanceFrom?: Amount;

  /** @format uuid */
  adjustmentIdTo?: string;
  ledgerBalanceTo?: Amount;
}

export interface SearchBusinessAllocationRequest {
  name: string;
}

export interface Account {
  /** @format uuid */
  accountId: string;

  /** @format uuid */
  businessId: string;

  /** @format uuid */
  allocationId: string;

  /** @format uuid */
  ledgerAccountId: string;
  type: 'ALLOCATION' | 'CARD';

  /** @format uuid */
  cardId?: string;
  ledgerBalance: Amount;
}

export interface Allocation {
  /** @format uuid */
  allocationId: string;
  name: string;

  /** @format uuid */
  ownerId: string;
  account: Account;

  /** @format uuid */
  parentAllocationId?: string;
  childrenAllocationIds?: string[];
}

export interface UpdateBusinessAccountingStepRequest {
  accountingSetupStep?: 'ADD_CREDIT_CARD' | 'MAP_CATEGORIES' | 'COMPLETE';
}

export interface Business {
  /** @format uuid */
  businessId?: string;
  legalName?: string;
  businessType?:
    | 'INDIVIDUAL'
    | 'SOLE_PROPRIETORSHIP'
    | 'SINGLE_MEMBER_LLC'
    | 'MULTI_MEMBER_LLC'
    | 'PRIVATE_PARTNERSHIP'
    | 'PUBLIC_PARTNERSHIP'
    | 'PRIVATE_CORPORATION'
    | 'PUBLIC_CORPORATION'
    | 'INCORPORATED_NON_PROFIT';
  employerIdentificationNumber?: string;

  /**
   * Phone number in e.164 format
   * @example +1234567890
   */
  businessPhone?: string;
  address?: Address;
  onboardingStep?:
    | 'BUSINESS'
    | 'BUSINESS_OWNERS'
    | 'SOFT_FAIL'
    | 'REVIEW'
    | 'LINK_ACCOUNT'
    | 'TRANSFER_MONEY'
    | 'COMPLETE';
  knowYourBusinessStatus?: 'PENDING' | 'REVIEW' | 'FAIL' | 'PASS';
  status?: 'ONBOARDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  accountingSetupStep?: 'ADD_CREDIT_CARD' | 'MAP_CATEGORIES' | 'COMPLETE';
  mcc?: string;
  accountNumber?: string;
  routingNumber?: string;
  description?: string;
  url?: string;
}

export interface CreateOrUpdateBusinessProspectRequest {
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

  /**
   * The Business type
   * @example SINGLE_MEMBER_LLC
   */
  businessType?:
    | 'INDIVIDUAL'
    | 'SOLE_PROPRIETORSHIP'
    | 'SINGLE_MEMBER_LLC'
    | 'MULTI_MEMBER_LLC'
    | 'PRIVATE_PARTNERSHIP'
    | 'PUBLIC_PARTNERSHIP'
    | 'PRIVATE_CORPORATION'
    | 'PUBLIC_CORPORATION'
    | 'INCORPORATED_NON_PROFIT';

  /**
   * Relationship to business Owner
   * @example true
   */
  relationshipOwner?: boolean;

  /**
   * Relationship to business Executive
   * @example true
   */
  relationshipExecutive?: boolean;
}

export interface CreateBusinessProspectResponse {
  /** @format uuid */
  businessProspectId?: string;
  businessProspectStatus?: 'NEW' | 'EMAIL_VERIFIED' | 'MOBILE_VERIFIED' | 'COMPLETED';
}

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

export interface ValidateIdentifierResponse {
  /** @example true */
  'If email already exist on the system. User can login, reset password or use another email'?: boolean;
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
  legalName: string;

  /** @pattern ^[1-9][0-9]{8}$ */
  employerIdentificationNumber: string;

  /**
   * Phone number in e.164 format
   * @pattern ^\+[1-9][0-9]{9,14}$
   * @example +1234567890
   */
  businessPhone: string;
  address?: Address;
  mcc: string;

  /**
   * Description
   * @example Business small description
   */
  description: string;

  /**
   * Business url
   * @example https://fecebook.com/business
   */
  url?: string;
}

export interface ConvertBusinessProspectResponse {
  business?: Business;

  /** @format uuid */
  businessOwnerId?: string;
  errorMessages?: string[];
}

export interface CreateOrUpdateBusinessOwnerRequest {
  /** @format uuid */
  id?: string;

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
   * Relationship to business Owner
   * @example true
   */
  relationshipOwner?: boolean;

  /**
   * Relationship to business Executive
   * @example true
   */
  relationshipExecutive?: boolean;

  /**
   * Percentage Ownership from business
   * @example 25
   */
  percentageOwnership?: number;

  /**
   * Title on business
   * @example CEO
   */
  title?: string;

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

  /**
   * Phone address of the person
   * @pattern ^\+[1-9][0-9]{9,14}$
   * @example +12345679
   */
  phone?: string;
  address?: Address;

  /**
   * Indication if business owner is updated during the onboarding process
   * @example false
   */
  isOnboarding?: boolean;
}

export interface CreateBusinessOwnerResponse {
  /** @format uuid */
  businessOwnerId: string;

  /** Error message for any records that failed. Will be null if successful */
  errorMessages?: string[];
}

export interface DeviceInfo {
  description?: string;
  lastAccessedAddress?: string;

  /** @format date-time */
  lastAccessedInstant?: string;
  name?: string;
  type?: 'BROWSER' | 'DESKTOP' | 'LAPTOP' | 'MOBILE' | 'OTHER' | 'SERVER' | 'TABLET' | 'TV' | 'UNKNOWN';
}

export interface EventInfo {
  data?: Record<string, object>;
  deviceDescription?: string;
  deviceName?: string;
  deviceType?: string;
  ipAddress?: string;
  location?: Location;
  os?: string;
  userAgent?: string;
}

export interface Location {
  city?: string;
  country?: string;

  /** @format double */
  latitude?: number;

  /** @format double */
  longitude?: number;
  region?: string;
  zipcode?: string;
  displayString?: string;
}

export interface MetaData {
  device?: DeviceInfo;
  scopes?: string[];
}

export interface TwoFactorLoginRequest {
  eventInfo?: EventInfo;

  /** @format uuid */
  applicationId?: string;
  ipAddress?: string;
  metaData?: MetaData;
  newDevice?: boolean;
  noJWT?: boolean;
  code?: string;
  trustComputer?: boolean;
  twoFactorId?: string;

  /** @format uuid */
  userId?: string;
}

export interface RelationshipToBusiness {
  owner?: boolean;
  executive?: boolean;
  representative?: boolean;
  director?: boolean;
}

export interface User {
  /** @format uuid */
  userId?: string;

  /** @format uuid */
  businessId?: string;
  type?: 'EMPLOYEE' | 'BUSINESS_OWNER';
  firstName?: string;
  lastName?: string;
  address?: Address;
  email?: string;
  phone?: string;
  archived?: boolean;
  relationshipToBusiness?: RelationshipToBusiness;
}

export interface FirstTwoFactorValidateRequest {
  code?: string;
  method?: 'email' | 'sms' | 'authenticator';
  destination?: string;
}

export interface TwoFactorResponse {
  recoveryCodes?: string[];
}

export interface FirstTwoFactorSendRequest {
  destination?: string;
  method?: 'email' | 'sms' | 'authenticator';
}

export interface ResetPasswordRequest {
  changePasswordId?: string;
  newPassword?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email?: string;
}

export interface ChangePasswordRequest {
  username?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface CreateAllocationRequest {
  /**
   * name of the department/ allocation
   * @example advertisement
   */
  name: string;

  /**
   * @format uuid
   * @example 48104ecb-1343-4cc1-b6f2-e6cc88e9a80f
   */
  parentAllocationId: string;

  /** @format uuid */
  ownerId: string;
  amount: Amount;
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
}

export interface CreateAllocationResponse {
  /** @format uuid */
  allocationId: string;
}

export interface AllocationFundCardRequest {
  /**
   * @format uuid
   * @example 48104ecb-1343-4cc1-b6f2-e6cc88e9a80f
   */
  allocationAccountId: string;

  /**
   * @format uuid
   * @example 48104ecb-1343-4cc1-b6f2-e6cc88e9a80f
   */
  cardId: string;

  /** @example DEPOSIT */
  reallocationType: 'ALLOCATION_TO_CARD' | 'CARD_TO_ALLOCATION';
  amount: Amount;
}

export interface AllocationFundCardResponse {
  /** @format uuid */
  businessAdjustmentId?: string;
  businessLedgerBalance?: Amount;

  /** @format uuid */
  allocationAdjustmentId?: string;
  allocationLedgerBalance?: Amount;
}

export interface AccountActivityRequest {
  pageRequest: PageRequest;

  /** @format uuid */
  allocationId?: string;

  /** @format uuid */
  userId?: string;

  /** @format uuid */
  cardId?: string;
  searchText?: string;
  types?: (
    | 'BANK_DEPOSIT'
    | 'BANK_DEPOSIT_RETURN'
    | 'BANK_LINK'
    | 'BANK_UNLINK'
    | 'BANK_WITHDRAWAL'
    | 'BANK_WITHDRAWAL_RETURN'
    | 'MANUAL'
    | 'NETWORK_AUTHORIZATION'
    | 'NETWORK_CAPTURE'
    | 'REALLOCATE'
  )[];

  /** @format date-time */
  from?: string;

  /** @format date-time */
  to?: string;
}

export interface AccountActivityResponse {
  /** @format uuid */
  accountActivityId?: string;

  /** @format date-time */
  activityTime?: string;
  accountName?: string;
  card?: CardInfo;
  merchant?: Merchant;
  type?:
    | 'BANK_DEPOSIT'
    | 'BANK_DEPOSIT_RETURN'
    | 'BANK_LINK'
    | 'BANK_UNLINK'
    | 'BANK_WITHDRAWAL'
    | 'BANK_WITHDRAWAL_RETURN'
    | 'MANUAL'
    | 'NETWORK_AUTHORIZATION'
    | 'NETWORK_CAPTURE'
    | 'REALLOCATE';
  status?: 'PENDING' | 'DECLINED' | 'APPROVED' | 'CANCELED' | 'CREDIT' | 'PROCESSED';
  amount?: Amount;
  receipt?: ReceiptDetails;
  notes?: string;
  expenseDetails?: ExpenseDetails;
}

export interface ExpenseDetails {
  /** @format int32 */
  iconRef?: number;
  categoryName?: string;
}

export interface Merchant {
  name?: string;
  type?:
    | 'UNKNOWN'
    | 'AC_REFRIGERATION_REPAIR'
    | 'ACCOUNTING_BOOKKEEPING_SERVICES'
    | 'ADVERTISING_SERVICES'
    | 'AGRICULTURAL_COOPERATIVE'
    | 'AIRLINES_AIR_CARRIERS'
    | 'AIRPORTS_FLYING_FIELDS'
    | 'AMBULANCE_SERVICES'
    | 'AMUSEMENT_PARKS_CARNIVALS'
    | 'ANTIQUE_REPRODUCTIONS'
    | 'ANTIQUE_SHOPS'
    | 'AQUARIUMS'
    | 'ARCHITECTURAL_SURVEYING_SERVICES'
    | 'ART_DEALERS_AND_GALLERIES'
    | 'ARTISTS_SUPPLY_AND_CRAFT_SHOPS'
    | 'AUTO_BODY_REPAIR_SHOPS'
    | 'AUTO_PAINT_SHOPS'
    | 'AUTO_SERVICE_SHOPS'
    | 'AUTO_AND_HOME_SUPPLY_STORES'
    | 'AUTOMATED_CASH_DISBURSE'
    | 'AUTOMATED_FUEL_DISPENSERS'
    | 'AUTOMOBILE_ASSOCIATIONS'
    | 'AUTOMOTIVE_PARTS_AND_ACCESSORIES_STORES'
    | 'AUTOMOTIVE_TIRE_STORES'
    | 'BAIL_AND_BOND_PAYMENTS'
    | 'BAKERIES'
    | 'BANDS_ORCHESTRAS'
    | 'BARBER_AND_BEAUTY_SHOPS'
    | 'BETTING_CASINO_GAMBLING'
    | 'BICYCLE_SHOPS'
    | 'BILLIARD_POOL_ESTABLISHMENTS'
    | 'BOAT_DEALERS'
    | 'BOAT_RENTALS_AND_LEASES'
    | 'BOOK_STORES'
    | 'BOOKS_PERIODICALS_AND_NEWSPAPERS'
    | 'BOWLING_ALLEYS'
    | 'BUS_LINES'
    | 'BUSINESS_SECRETARIAL_SCHOOLS'
    | 'BUYING_SHOPPING_SERVICES'
    | 'CABLE_SATELLITE_AND_OTHER_PAY_TELEVISION_AND_RADIO'
    | 'CAMERA_AND_PHOTOGRAPHIC_SUPPLY_STORES'
    | 'CANDY_NUT_AND_CONFECTIONERY_STORES'
    | 'CAR_RENTAL_AGENCIES'
    | 'CAR_WASHES'
    | 'CAR_AND_TRUCK_DEALERS_NEW_USED'
    | 'CAR_AND_TRUCK_DEALERS_USED_ONLY'
    | 'CARPENTRY_SERVICES'
    | 'CARPET_UPHOLSTERY_CLEANING'
    | 'CATERERS'
    | 'CHARITABLE_AND_SOCIAL_SERVICE_ORGANIZATIONS_FUNDRAISING'
    | 'CHEMICALS_AND_ALLIED_PRODUCTS'
    | 'CHILD_CARE_SERVICES'
    | 'CHILDRENS_AND_INFANTS_WEAR_STORES'
    | 'CHIROPODISTS_PODIATRISTS'
    | 'CHIROPRACTORS'
    | 'CIGAR_STORES_AND_STANDS'
    | 'CIVIC_SOCIAL_FRATERNAL_ASSOCIATIONS'
    | 'CLEANING_AND_MAINTENANCE'
    | 'CLOTHING_RENTAL'
    | 'COLLEGES_UNIVERSITIES'
    | 'COMMERCIAL_EQUIPMENT'
    | 'COMMERCIAL_FOOTWEAR'
    | 'COMMERCIAL_PHOTOGRAPHY_ART_AND_GRAPHICS'
    | 'COMMUTER_TRANSPORT_AND_FERRIES'
    | 'COMPUTER_NETWORK_SERVICES'
    | 'COMPUTER_PROGRAMMING'
    | 'COMPUTER_REPAIR'
    | 'COMPUTER_SOFTWARE_STORES'
    | 'COMPUTERS_PERIPHERALS_AND_SOFTWARE'
    | 'CONCRETE_WORK_SERVICES'
    | 'CONSTRUCTION_MATERIALS'
    | 'CONSULTING_PUBLIC_RELATIONS'
    | 'CORRESPONDENCE_SCHOOLS'
    | 'COSMETIC_STORES'
    | 'COUNSELING_SERVICES'
    | 'COUNTRY_CLUBS'
    | 'COURIER_SERVICES'
    | 'COURT_COSTS'
    | 'CREDIT_REPORTING_AGENCIES'
    | 'CRUISE_LINES'
    | 'DAIRY_PRODUCTS_STORES'
    | 'DANCE_HALL_STUDIOS_SCHOOLS'
    | 'DATING_ESCORT_SERVICES'
    | 'DENTISTS_ORTHODONTISTS'
    | 'DEPARTMENT_STORES'
    | 'DETECTIVE_AGENCIES'
    | 'DIGITAL_GOODS_MEDIA'
    | 'DIGITAL_GOODS_APPLICATIONS'
    | 'DIGITAL_GOODS_GAMES'
    | 'DIGITAL_GOODS_LARGE_VOLUME'
    | 'DIRECT_MARKETING_CATALOG_MERCHANT'
    | 'DIRECT_MARKETING_COMBINATION_CATALOG_AND_RETAIL_MERCHANT'
    | 'DIRECT_MARKETING_INBOUND_TELEMARKETING'
    | 'DIRECT_MARKETING_INSURANCE_SERVICES'
    | 'DIRECT_MARKETING_OTHER'
    | 'DIRECT_MARKETING_OUTBOUND_TELEMARKETING'
    | 'DIRECT_MARKETING_SUBSCRIPTION'
    | 'DIRECT_MARKETING_TRAVEL'
    | 'DISCOUNT_STORES'
    | 'DOCTORS'
    | 'DOOR_TO_DOOR_SALES'
    | 'DRAPERY_WINDOW_COVERING_AND_UPHOLSTERY_STORES'
    | 'DRINKING_PLACES'
    | 'DRUG_STORES_AND_PHARMACIES'
    | 'DRUGS_DRUG_PROPRIETARIES_AND_DRUGGIST_SUNDRIES'
    | 'DRY_CLEANERS'
    | 'DURABLE_GOODS'
    | 'DUTY_FREE_STORES'
    | 'EATING_PLACES_RESTAURANTS'
    | 'EDUCATIONAL_SERVICES'
    | 'ELECTRIC_RAZOR_STORES'
    | 'ELECTRICAL_PARTS_AND_EQUIPMENT'
    | 'ELECTRICAL_SERVICES'
    | 'ELECTRONICS_REPAIR_SHOPS'
    | 'ELECTRONICS_STORES'
    | 'ELEMENTARY_SECONDARY_SCHOOLS'
    | 'EMPLOYMENT_TEMP_AGENCIES'
    | 'EQUIPMENT_RENTAL'
    | 'EXTERMINATING_SERVICES'
    | 'FAMILY_CLOTHING_STORES'
    | 'FAST_FOOD_RESTAURANTS'
    | 'FINANCIAL_INSTITUTIONS'
    | 'FINES_GOVERNMENT_ADMINISTRATIVE_ENTITIES'
    | 'FIREPLACE_FIREPLACE_SCREENS_AND_ACCESSORIES_STORES'
    | 'FLOOR_COVERING_STORES'
    | 'FLORISTS'
    | 'FLORISTS_SUPPLIES_NURSERY_STOCK_AND_FLOWERS'
    | 'FREEZER_AND_LOCKER_MEAT_PROVISIONERS'
    | 'FUEL_DEALERS_NON_AUTOMOTIVE'
    | 'FUNERAL_SERVICES_CREMATORIES'
    | 'FURNITURE_REPAIR_REFINISHING'
    | 'FURNITURE_HOME_FURNISHINGS_AND_EQUIPMENT_STORES_EXCEPT_APPLIANCES'
    | 'FURRIERS_AND_FUR_SHOPS'
    | 'GENERAL_SERVICES'
    | 'GIFT_CARD_NOVELTY_AND_SOUVENIR_SHOPS'
    | 'GLASS_PAINT_AND_WALLPAPER_STORES'
    | 'GLASSWARE_CRYSTAL_STORES'
    | 'GOLF_COURSES_PUBLIC'
    | 'GOVERNMENT_SERVICES'
    | 'GROCERY_STORES_SUPERMARKETS'
    | 'HARDWARE_STORES'
    | 'HARDWARE_EQUIPMENT_AND_SUPPLIES'
    | 'HEALTH_AND_BEAUTY_SPAS'
    | 'HEARING_AIDS_SALES_AND_SUPPLIES'
    | 'HEATING_PLUMBING_A_C'
    | 'HOBBY_TOY_AND_GAME_SHOPS'
    | 'HOME_SUPPLY_WAREHOUSE_STORES'
    | 'HOSPITALS'
    | 'HOTELS_MOTELS_AND_RESORTS'
    | 'HOUSEHOLD_APPLIANCE_STORES'
    | 'INDUSTRIAL_SUPPLIES'
    | 'INFORMATION_RETRIEVAL_SERVICES'
    | 'INSURANCE_DEFAULT'
    | 'INSURANCE_UNDERWRITING_PREMIUMS'
    | 'INTRA_COMPANY_PURCHASES'
    | 'JEWELRY_STORES_WATCHES_CLOCKS_AND_SILVERWARE_STORES'
    | 'LANDSCAPING_SERVICES'
    | 'LAUNDRIES'
    | 'LAUNDRY_CLEANING_SERVICES'
    | 'LEGAL_SERVICES_ATTORNEYS'
    | 'LUGGAGE_AND_LEATHER_GOODS_STORES'
    | 'LUMBER_BUILDING_MATERIALS_STORES'
    | 'MANUAL_CASH_DISBURSE'
    | 'MARINAS_SERVICE_AND_SUPPLIES'
    | 'MASONRY_STONEWORK_AND_PLASTER'
    | 'MASSAGE_PARLORS'
    | 'MEDICAL_SERVICES'
    | 'MEDICAL_AND_DENTAL_LABS'
    | 'MEDICAL_DENTAL_OPHTHALMIC_AND_HOSPITAL_EQUIPMENT_AND_SUPPLIES'
    | 'MEMBERSHIP_ORGANIZATIONS'
    | 'MENS_AND_BOYS_CLOTHING_AND_ACCESSORIES_STORES'
    | 'MENS_WOMENS_CLOTHING_STORES'
    | 'METAL_SERVICE_CENTERS'
    | 'MISCELLANEOUS_APPAREL_AND_ACCESSORY_SHOPS'
    | 'MISCELLANEOUS_AUTO_DEALERS'
    | 'MISCELLANEOUS_BUSINESS_SERVICES'
    | 'MISCELLANEOUS_FOOD_STORES'
    | 'MISCELLANEOUS_GENERAL_MERCHANDISE'
    | 'MISCELLANEOUS_GENERAL_SERVICES'
    | 'MISCELLANEOUS_HOME_FURNISHING_SPECIALTY_STORES'
    | 'MISCELLANEOUS_PUBLISHING_AND_PRINTING'
    | 'MISCELLANEOUS_RECREATION_SERVICES'
    | 'MISCELLANEOUS_REPAIR_SHOPS'
    | 'MISCELLANEOUS_SPECIALTY_RETAIL'
    | 'MOBILE_HOME_DEALERS'
    | 'MOTION_PICTURE_THEATERS'
    | 'MOTOR_FREIGHT_CARRIERS_AND_TRUCKING'
    | 'MOTOR_HOMES_DEALERS'
    | 'MOTOR_VEHICLE_SUPPLIES_AND_NEW_PARTS'
    | 'MOTORCYCLE_SHOPS_AND_DEALERS'
    | 'MOTORCYCLE_SHOPS_DEALERS'
    | 'MUSIC_STORES_MUSICAL_INSTRUMENTS_PIANOS_AND_SHEET_MUSIC'
    | 'NEWS_DEALERS_AND_NEWSSTANDS'
    | 'NON_FI_MONEY_ORDERS'
    | 'NON_FI_STORED_VALUE_CARD_PURCHASE_LOAD'
    | 'NONDURABLE_GOODS'
    | 'NURSERIES_LAWN_AND_GARDEN_SUPPLY_STORES'
    | 'NURSING_PERSONAL_CARE'
    | 'OFFICE_AND_COMMERCIAL_FURNITURE'
    | 'OPTICIANS_EYEGLASSES'
    | 'OPTOMETRISTS_OPHTHALMOLOGIST'
    | 'ORTHOPEDIC_GOODS_PROSTHETIC_DEVICES'
    | 'OSTEOPATHS'
    | 'PACKAGE_STORES_BEER_WINE_AND_LIQUOR'
    | 'PAINTS_VARNISHES_AND_SUPPLIES'
    | 'PARKING_LOTS_GARAGES'
    | 'PASSENGER_RAILWAYS'
    | 'PAWN_SHOPS'
    | 'PET_SHOPS_PET_FOOD_AND_SUPPLIES'
    | 'PETROLEUM_AND_PETROLEUM_PRODUCTS'
    | 'PHOTO_DEVELOPING'
    | 'PHOTOGRAPHIC_STUDIOS'
    | 'PHOTOGRAPHIC_PHOTOCOPY_MICROFILM_EQUIPMENT_AND_SUPPLIES'
    | 'PICTURE_VIDEO_PRODUCTION'
    | 'PIECE_GOODS_NOTIONS_AND_OTHER_DRY_GOODS'
    | 'PLUMBING_HEATING_EQUIPMENT_AND_SUPPLIES'
    | 'POLITICAL_ORGANIZATIONS'
    | 'POSTAL_SERVICES_GOVERNMENT_ONLY'
    | 'PRECIOUS_STONES_AND_METALS_WATCHES_AND_JEWELRY'
    | 'PROFESSIONAL_SERVICES'
    | 'PUBLIC_WAREHOUSING_AND_STORAGE'
    | 'QUICK_COPY_REPRO_AND_BLUEPRINT'
    | 'RAILROADS'
    | 'REAL_ESTATE_AGENTS_AND_MANAGERS_RENTALS'
    | 'RECORD_STORES'
    | 'RECREATIONAL_VEHICLE_RENTALS'
    | 'RELIGIOUS_GOODS_STORES'
    | 'RELIGIOUS_ORGANIZATIONS'
    | 'ROOFING_SIDING_SHEET_METAL'
    | 'SECRETARIAL_SUPPORT_SERVICES'
    | 'SECURITY_BROKERS_DEALERS'
    | 'SERVICE_STATIONS'
    | 'SEWING_NEEDLEWORK_FABRIC_AND_PIECE_GOODS_STORES'
    | 'SHOE_REPAIR_HAT_CLEANING'
    | 'SHOE_STORES'
    | 'SMALL_APPLIANCE_REPAIR'
    | 'SNOWMOBILE_DEALERS'
    | 'SPECIAL_TRADE_SERVICES'
    | 'SPECIALTY_CLEANING'
    | 'SPORTING_GOODS_STORES'
    | 'SPORTING_RECREATION_CAMPS'
    | 'SPORTS_CLUBS_FIELDS'
    | 'SPORTS_AND_RIDING_APPAREL_STORES'
    | 'STAMP_AND_COIN_STORES'
    | 'STATIONARY_OFFICE_SUPPLIES_PRINTING_AND_WRITING_PAPER'
    | 'STATIONERY_STORES_OFFICE_AND_SCHOOL_SUPPLY_STORES'
    | 'SWIMMING_POOLS_SALES'
    | 'T_UI_TRAVEL_GERMANY'
    | 'TAILORS_ALTERATIONS'
    | 'TAX_PAYMENTS_GOVERNMENT_AGENCIES'
    | 'TAX_PREPARATION_SERVICES'
    | 'TAXICABS_LIMOUSINES'
    | 'TELECOMMUNICATION_EQUIPMENT_AND_TELEPHONE_SALES'
    | 'TELECOMMUNICATION_SERVICES'
    | 'TELEGRAPH_SERVICES'
    | 'TENT_AND_AWNING_SHOPS'
    | 'TESTING_LABORATORIES'
    | 'THEATRICAL_TICKET_AGENCIES'
    | 'TIMESHARES'
    | 'TIRE_RETREADING_AND_REPAIR'
    | 'TOLLS_BRIDGE_FEES'
    | 'TOURIST_ATTRACTIONS_AND_EXHIBITS'
    | 'TOWING_SERVICES'
    | 'TRAILER_PARKS_CAMPGROUNDS'
    | 'TRANSPORTATION_SERVICES'
    | 'TRAVEL_AGENCIES_TOUR_OPERATORS'
    | 'TRUCK_STOP_ITERATION'
    | 'TRUCK_UTILITY_TRAILER_RENTALS'
    | 'TYPESETTING_PLATE_MAKING_AND_RELATED_SERVICES'
    | 'TYPEWRITER_STORES'
    | 'U_S_FEDERAL_GOVERNMENT_AGENCIES_OR_DEPARTMENTS'
    | 'UNIFORMS_COMMERCIAL_CLOTHING'
    | 'USED_MERCHANDISE_AND_SECONDHAND_STORES'
    | 'UTILITIES'
    | 'VARIETY_STORES'
    | 'VETERINARY_SERVICES'
    | 'VIDEO_AMUSEMENT_GAME_SUPPLIES'
    | 'VIDEO_GAME_ARCADES'
    | 'VIDEO_TAPE_RENTAL_STORES'
    | 'VOCATIONAL_TRADE_SCHOOLS'
    | 'WATCH_JEWELRY_REPAIR'
    | 'WELDING_REPAIR'
    | 'WHOLESALE_CLUBS'
    | 'WIG_AND_TOUPEE_STORES'
    | 'WIRES_MONEY_ORDERS'
    | 'WOMENS_ACCESSORY_AND_SPECIALTY_SHOPS'
    | 'WOMENS_READY_TO_WEAR_STORES'
    | 'WRECKING_AND_SALVAGE_YARDS';
  merchantNumber?: string;

  /** @format int32 */
  merchantCategoryCode?: number;
  merchantCategoryGroup?:
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
    | 'OTHER';
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
  receiptId?: string[];
}

export interface GraphDataRequest {
  /** @format uuid */
  allocationId?: string;

  /** @format uuid */
  userId?: string;

  /** @format uuid */
  cardId?: string;

  /** @format date-time */
  from: string;

  /** @format date-time */
  to: string;
}

export interface DashboardGraphData {
  totalSpend?: number;
  averageSpend?: number;
  graphData?: GraphData[];
}

export interface GraphData {
  /** @format date-time */
  from?: string;

  /** @format date-time */
  to?: string;
  amount?: number;
  count?: number;
}

export interface ChartDataRequest {
  chartFilter: 'MERCHANT_CATEGORY' | 'ALLOCATION' | 'EMPLOYEE' | 'MERCHANT';

  /** @format uuid */
  allocationId?: string;

  /** @format uuid */
  userId?: string;

  /** @format date-time */
  from: string;

  /** @format date-time */
  to: string;
}

export interface AllocationChartData {
  allocation?: AllocationInfo;
  amount?: Amount;
}

export interface AllocationInfo {
  /** @format uuid */
  allocationId?: string;
  name?: string;
}

export interface ChartDataResponse {
  merchantCategoryChartData?: MerchantCategoryChartData[];
  allocationChartData?: AllocationChartData[];
  userChartData?: UserChartData[];
  merchantChartData?: MerchantChartData[];
}

export interface MerchantCategoryChartData {
  merchantType?:
    | 'UNKNOWN'
    | 'AC_REFRIGERATION_REPAIR'
    | 'ACCOUNTING_BOOKKEEPING_SERVICES'
    | 'ADVERTISING_SERVICES'
    | 'AGRICULTURAL_COOPERATIVE'
    | 'AIRLINES_AIR_CARRIERS'
    | 'AIRPORTS_FLYING_FIELDS'
    | 'AMBULANCE_SERVICES'
    | 'AMUSEMENT_PARKS_CARNIVALS'
    | 'ANTIQUE_REPRODUCTIONS'
    | 'ANTIQUE_SHOPS'
    | 'AQUARIUMS'
    | 'ARCHITECTURAL_SURVEYING_SERVICES'
    | 'ART_DEALERS_AND_GALLERIES'
    | 'ARTISTS_SUPPLY_AND_CRAFT_SHOPS'
    | 'AUTO_BODY_REPAIR_SHOPS'
    | 'AUTO_PAINT_SHOPS'
    | 'AUTO_SERVICE_SHOPS'
    | 'AUTO_AND_HOME_SUPPLY_STORES'
    | 'AUTOMATED_CASH_DISBURSE'
    | 'AUTOMATED_FUEL_DISPENSERS'
    | 'AUTOMOBILE_ASSOCIATIONS'
    | 'AUTOMOTIVE_PARTS_AND_ACCESSORIES_STORES'
    | 'AUTOMOTIVE_TIRE_STORES'
    | 'BAIL_AND_BOND_PAYMENTS'
    | 'BAKERIES'
    | 'BANDS_ORCHESTRAS'
    | 'BARBER_AND_BEAUTY_SHOPS'
    | 'BETTING_CASINO_GAMBLING'
    | 'BICYCLE_SHOPS'
    | 'BILLIARD_POOL_ESTABLISHMENTS'
    | 'BOAT_DEALERS'
    | 'BOAT_RENTALS_AND_LEASES'
    | 'BOOK_STORES'
    | 'BOOKS_PERIODICALS_AND_NEWSPAPERS'
    | 'BOWLING_ALLEYS'
    | 'BUS_LINES'
    | 'BUSINESS_SECRETARIAL_SCHOOLS'
    | 'BUYING_SHOPPING_SERVICES'
    | 'CABLE_SATELLITE_AND_OTHER_PAY_TELEVISION_AND_RADIO'
    | 'CAMERA_AND_PHOTOGRAPHIC_SUPPLY_STORES'
    | 'CANDY_NUT_AND_CONFECTIONERY_STORES'
    | 'CAR_RENTAL_AGENCIES'
    | 'CAR_WASHES'
    | 'CAR_AND_TRUCK_DEALERS_NEW_USED'
    | 'CAR_AND_TRUCK_DEALERS_USED_ONLY'
    | 'CARPENTRY_SERVICES'
    | 'CARPET_UPHOLSTERY_CLEANING'
    | 'CATERERS'
    | 'CHARITABLE_AND_SOCIAL_SERVICE_ORGANIZATIONS_FUNDRAISING'
    | 'CHEMICALS_AND_ALLIED_PRODUCTS'
    | 'CHILD_CARE_SERVICES'
    | 'CHILDRENS_AND_INFANTS_WEAR_STORES'
    | 'CHIROPODISTS_PODIATRISTS'
    | 'CHIROPRACTORS'
    | 'CIGAR_STORES_AND_STANDS'
    | 'CIVIC_SOCIAL_FRATERNAL_ASSOCIATIONS'
    | 'CLEANING_AND_MAINTENANCE'
    | 'CLOTHING_RENTAL'
    | 'COLLEGES_UNIVERSITIES'
    | 'COMMERCIAL_EQUIPMENT'
    | 'COMMERCIAL_FOOTWEAR'
    | 'COMMERCIAL_PHOTOGRAPHY_ART_AND_GRAPHICS'
    | 'COMMUTER_TRANSPORT_AND_FERRIES'
    | 'COMPUTER_NETWORK_SERVICES'
    | 'COMPUTER_PROGRAMMING'
    | 'COMPUTER_REPAIR'
    | 'COMPUTER_SOFTWARE_STORES'
    | 'COMPUTERS_PERIPHERALS_AND_SOFTWARE'
    | 'CONCRETE_WORK_SERVICES'
    | 'CONSTRUCTION_MATERIALS'
    | 'CONSULTING_PUBLIC_RELATIONS'
    | 'CORRESPONDENCE_SCHOOLS'
    | 'COSMETIC_STORES'
    | 'COUNSELING_SERVICES'
    | 'COUNTRY_CLUBS'
    | 'COURIER_SERVICES'
    | 'COURT_COSTS'
    | 'CREDIT_REPORTING_AGENCIES'
    | 'CRUISE_LINES'
    | 'DAIRY_PRODUCTS_STORES'
    | 'DANCE_HALL_STUDIOS_SCHOOLS'
    | 'DATING_ESCORT_SERVICES'
    | 'DENTISTS_ORTHODONTISTS'
    | 'DEPARTMENT_STORES'
    | 'DETECTIVE_AGENCIES'
    | 'DIGITAL_GOODS_MEDIA'
    | 'DIGITAL_GOODS_APPLICATIONS'
    | 'DIGITAL_GOODS_GAMES'
    | 'DIGITAL_GOODS_LARGE_VOLUME'
    | 'DIRECT_MARKETING_CATALOG_MERCHANT'
    | 'DIRECT_MARKETING_COMBINATION_CATALOG_AND_RETAIL_MERCHANT'
    | 'DIRECT_MARKETING_INBOUND_TELEMARKETING'
    | 'DIRECT_MARKETING_INSURANCE_SERVICES'
    | 'DIRECT_MARKETING_OTHER'
    | 'DIRECT_MARKETING_OUTBOUND_TELEMARKETING'
    | 'DIRECT_MARKETING_SUBSCRIPTION'
    | 'DIRECT_MARKETING_TRAVEL'
    | 'DISCOUNT_STORES'
    | 'DOCTORS'
    | 'DOOR_TO_DOOR_SALES'
    | 'DRAPERY_WINDOW_COVERING_AND_UPHOLSTERY_STORES'
    | 'DRINKING_PLACES'
    | 'DRUG_STORES_AND_PHARMACIES'
    | 'DRUGS_DRUG_PROPRIETARIES_AND_DRUGGIST_SUNDRIES'
    | 'DRY_CLEANERS'
    | 'DURABLE_GOODS'
    | 'DUTY_FREE_STORES'
    | 'EATING_PLACES_RESTAURANTS'
    | 'EDUCATIONAL_SERVICES'
    | 'ELECTRIC_RAZOR_STORES'
    | 'ELECTRICAL_PARTS_AND_EQUIPMENT'
    | 'ELECTRICAL_SERVICES'
    | 'ELECTRONICS_REPAIR_SHOPS'
    | 'ELECTRONICS_STORES'
    | 'ELEMENTARY_SECONDARY_SCHOOLS'
    | 'EMPLOYMENT_TEMP_AGENCIES'
    | 'EQUIPMENT_RENTAL'
    | 'EXTERMINATING_SERVICES'
    | 'FAMILY_CLOTHING_STORES'
    | 'FAST_FOOD_RESTAURANTS'
    | 'FINANCIAL_INSTITUTIONS'
    | 'FINES_GOVERNMENT_ADMINISTRATIVE_ENTITIES'
    | 'FIREPLACE_FIREPLACE_SCREENS_AND_ACCESSORIES_STORES'
    | 'FLOOR_COVERING_STORES'
    | 'FLORISTS'
    | 'FLORISTS_SUPPLIES_NURSERY_STOCK_AND_FLOWERS'
    | 'FREEZER_AND_LOCKER_MEAT_PROVISIONERS'
    | 'FUEL_DEALERS_NON_AUTOMOTIVE'
    | 'FUNERAL_SERVICES_CREMATORIES'
    | 'FURNITURE_REPAIR_REFINISHING'
    | 'FURNITURE_HOME_FURNISHINGS_AND_EQUIPMENT_STORES_EXCEPT_APPLIANCES'
    | 'FURRIERS_AND_FUR_SHOPS'
    | 'GENERAL_SERVICES'
    | 'GIFT_CARD_NOVELTY_AND_SOUVENIR_SHOPS'
    | 'GLASS_PAINT_AND_WALLPAPER_STORES'
    | 'GLASSWARE_CRYSTAL_STORES'
    | 'GOLF_COURSES_PUBLIC'
    | 'GOVERNMENT_SERVICES'
    | 'GROCERY_STORES_SUPERMARKETS'
    | 'HARDWARE_STORES'
    | 'HARDWARE_EQUIPMENT_AND_SUPPLIES'
    | 'HEALTH_AND_BEAUTY_SPAS'
    | 'HEARING_AIDS_SALES_AND_SUPPLIES'
    | 'HEATING_PLUMBING_A_C'
    | 'HOBBY_TOY_AND_GAME_SHOPS'
    | 'HOME_SUPPLY_WAREHOUSE_STORES'
    | 'HOSPITALS'
    | 'HOTELS_MOTELS_AND_RESORTS'
    | 'HOUSEHOLD_APPLIANCE_STORES'
    | 'INDUSTRIAL_SUPPLIES'
    | 'INFORMATION_RETRIEVAL_SERVICES'
    | 'INSURANCE_DEFAULT'
    | 'INSURANCE_UNDERWRITING_PREMIUMS'
    | 'INTRA_COMPANY_PURCHASES'
    | 'JEWELRY_STORES_WATCHES_CLOCKS_AND_SILVERWARE_STORES'
    | 'LANDSCAPING_SERVICES'
    | 'LAUNDRIES'
    | 'LAUNDRY_CLEANING_SERVICES'
    | 'LEGAL_SERVICES_ATTORNEYS'
    | 'LUGGAGE_AND_LEATHER_GOODS_STORES'
    | 'LUMBER_BUILDING_MATERIALS_STORES'
    | 'MANUAL_CASH_DISBURSE'
    | 'MARINAS_SERVICE_AND_SUPPLIES'
    | 'MASONRY_STONEWORK_AND_PLASTER'
    | 'MASSAGE_PARLORS'
    | 'MEDICAL_SERVICES'
    | 'MEDICAL_AND_DENTAL_LABS'
    | 'MEDICAL_DENTAL_OPHTHALMIC_AND_HOSPITAL_EQUIPMENT_AND_SUPPLIES'
    | 'MEMBERSHIP_ORGANIZATIONS'
    | 'MENS_AND_BOYS_CLOTHING_AND_ACCESSORIES_STORES'
    | 'MENS_WOMENS_CLOTHING_STORES'
    | 'METAL_SERVICE_CENTERS'
    | 'MISCELLANEOUS_APPAREL_AND_ACCESSORY_SHOPS'
    | 'MISCELLANEOUS_AUTO_DEALERS'
    | 'MISCELLANEOUS_BUSINESS_SERVICES'
    | 'MISCELLANEOUS_FOOD_STORES'
    | 'MISCELLANEOUS_GENERAL_MERCHANDISE'
    | 'MISCELLANEOUS_GENERAL_SERVICES'
    | 'MISCELLANEOUS_HOME_FURNISHING_SPECIALTY_STORES'
    | 'MISCELLANEOUS_PUBLISHING_AND_PRINTING'
    | 'MISCELLANEOUS_RECREATION_SERVICES'
    | 'MISCELLANEOUS_REPAIR_SHOPS'
    | 'MISCELLANEOUS_SPECIALTY_RETAIL'
    | 'MOBILE_HOME_DEALERS'
    | 'MOTION_PICTURE_THEATERS'
    | 'MOTOR_FREIGHT_CARRIERS_AND_TRUCKING'
    | 'MOTOR_HOMES_DEALERS'
    | 'MOTOR_VEHICLE_SUPPLIES_AND_NEW_PARTS'
    | 'MOTORCYCLE_SHOPS_AND_DEALERS'
    | 'MOTORCYCLE_SHOPS_DEALERS'
    | 'MUSIC_STORES_MUSICAL_INSTRUMENTS_PIANOS_AND_SHEET_MUSIC'
    | 'NEWS_DEALERS_AND_NEWSSTANDS'
    | 'NON_FI_MONEY_ORDERS'
    | 'NON_FI_STORED_VALUE_CARD_PURCHASE_LOAD'
    | 'NONDURABLE_GOODS'
    | 'NURSERIES_LAWN_AND_GARDEN_SUPPLY_STORES'
    | 'NURSING_PERSONAL_CARE'
    | 'OFFICE_AND_COMMERCIAL_FURNITURE'
    | 'OPTICIANS_EYEGLASSES'
    | 'OPTOMETRISTS_OPHTHALMOLOGIST'
    | 'ORTHOPEDIC_GOODS_PROSTHETIC_DEVICES'
    | 'OSTEOPATHS'
    | 'PACKAGE_STORES_BEER_WINE_AND_LIQUOR'
    | 'PAINTS_VARNISHES_AND_SUPPLIES'
    | 'PARKING_LOTS_GARAGES'
    | 'PASSENGER_RAILWAYS'
    | 'PAWN_SHOPS'
    | 'PET_SHOPS_PET_FOOD_AND_SUPPLIES'
    | 'PETROLEUM_AND_PETROLEUM_PRODUCTS'
    | 'PHOTO_DEVELOPING'
    | 'PHOTOGRAPHIC_STUDIOS'
    | 'PHOTOGRAPHIC_PHOTOCOPY_MICROFILM_EQUIPMENT_AND_SUPPLIES'
    | 'PICTURE_VIDEO_PRODUCTION'
    | 'PIECE_GOODS_NOTIONS_AND_OTHER_DRY_GOODS'
    | 'PLUMBING_HEATING_EQUIPMENT_AND_SUPPLIES'
    | 'POLITICAL_ORGANIZATIONS'
    | 'POSTAL_SERVICES_GOVERNMENT_ONLY'
    | 'PRECIOUS_STONES_AND_METALS_WATCHES_AND_JEWELRY'
    | 'PROFESSIONAL_SERVICES'
    | 'PUBLIC_WAREHOUSING_AND_STORAGE'
    | 'QUICK_COPY_REPRO_AND_BLUEPRINT'
    | 'RAILROADS'
    | 'REAL_ESTATE_AGENTS_AND_MANAGERS_RENTALS'
    | 'RECORD_STORES'
    | 'RECREATIONAL_VEHICLE_RENTALS'
    | 'RELIGIOUS_GOODS_STORES'
    | 'RELIGIOUS_ORGANIZATIONS'
    | 'ROOFING_SIDING_SHEET_METAL'
    | 'SECRETARIAL_SUPPORT_SERVICES'
    | 'SECURITY_BROKERS_DEALERS'
    | 'SERVICE_STATIONS'
    | 'SEWING_NEEDLEWORK_FABRIC_AND_PIECE_GOODS_STORES'
    | 'SHOE_REPAIR_HAT_CLEANING'
    | 'SHOE_STORES'
    | 'SMALL_APPLIANCE_REPAIR'
    | 'SNOWMOBILE_DEALERS'
    | 'SPECIAL_TRADE_SERVICES'
    | 'SPECIALTY_CLEANING'
    | 'SPORTING_GOODS_STORES'
    | 'SPORTING_RECREATION_CAMPS'
    | 'SPORTS_CLUBS_FIELDS'
    | 'SPORTS_AND_RIDING_APPAREL_STORES'
    | 'STAMP_AND_COIN_STORES'
    | 'STATIONARY_OFFICE_SUPPLIES_PRINTING_AND_WRITING_PAPER'
    | 'STATIONERY_STORES_OFFICE_AND_SCHOOL_SUPPLY_STORES'
    | 'SWIMMING_POOLS_SALES'
    | 'T_UI_TRAVEL_GERMANY'
    | 'TAILORS_ALTERATIONS'
    | 'TAX_PAYMENTS_GOVERNMENT_AGENCIES'
    | 'TAX_PREPARATION_SERVICES'
    | 'TAXICABS_LIMOUSINES'
    | 'TELECOMMUNICATION_EQUIPMENT_AND_TELEPHONE_SALES'
    | 'TELECOMMUNICATION_SERVICES'
    | 'TELEGRAPH_SERVICES'
    | 'TENT_AND_AWNING_SHOPS'
    | 'TESTING_LABORATORIES'
    | 'THEATRICAL_TICKET_AGENCIES'
    | 'TIMESHARES'
    | 'TIRE_RETREADING_AND_REPAIR'
    | 'TOLLS_BRIDGE_FEES'
    | 'TOURIST_ATTRACTIONS_AND_EXHIBITS'
    | 'TOWING_SERVICES'
    | 'TRAILER_PARKS_CAMPGROUNDS'
    | 'TRANSPORTATION_SERVICES'
    | 'TRAVEL_AGENCIES_TOUR_OPERATORS'
    | 'TRUCK_STOP_ITERATION'
    | 'TRUCK_UTILITY_TRAILER_RENTALS'
    | 'TYPESETTING_PLATE_MAKING_AND_RELATED_SERVICES'
    | 'TYPEWRITER_STORES'
    | 'U_S_FEDERAL_GOVERNMENT_AGENCIES_OR_DEPARTMENTS'
    | 'UNIFORMS_COMMERCIAL_CLOTHING'
    | 'USED_MERCHANDISE_AND_SECONDHAND_STORES'
    | 'UTILITIES'
    | 'VARIETY_STORES'
    | 'VETERINARY_SERVICES'
    | 'VIDEO_AMUSEMENT_GAME_SUPPLIES'
    | 'VIDEO_GAME_ARCADES'
    | 'VIDEO_TAPE_RENTAL_STORES'
    | 'VOCATIONAL_TRADE_SCHOOLS'
    | 'WATCH_JEWELRY_REPAIR'
    | 'WELDING_REPAIR'
    | 'WHOLESALE_CLUBS'
    | 'WIG_AND_TOUPEE_STORES'
    | 'WIRES_MONEY_ORDERS'
    | 'WOMENS_ACCESSORY_AND_SPECIALTY_SHOPS'
    | 'WOMENS_READY_TO_WEAR_STORES'
    | 'WRECKING_AND_SALVAGE_YARDS';
  amount?: Amount;
}

export interface MerchantChartData {
  merchant?: MerchantInfo;
  amount?: Amount;
}

export interface MerchantInfo {
  name?: string;
  type?:
    | 'UNKNOWN'
    | 'AC_REFRIGERATION_REPAIR'
    | 'ACCOUNTING_BOOKKEEPING_SERVICES'
    | 'ADVERTISING_SERVICES'
    | 'AGRICULTURAL_COOPERATIVE'
    | 'AIRLINES_AIR_CARRIERS'
    | 'AIRPORTS_FLYING_FIELDS'
    | 'AMBULANCE_SERVICES'
    | 'AMUSEMENT_PARKS_CARNIVALS'
    | 'ANTIQUE_REPRODUCTIONS'
    | 'ANTIQUE_SHOPS'
    | 'AQUARIUMS'
    | 'ARCHITECTURAL_SURVEYING_SERVICES'
    | 'ART_DEALERS_AND_GALLERIES'
    | 'ARTISTS_SUPPLY_AND_CRAFT_SHOPS'
    | 'AUTO_BODY_REPAIR_SHOPS'
    | 'AUTO_PAINT_SHOPS'
    | 'AUTO_SERVICE_SHOPS'
    | 'AUTO_AND_HOME_SUPPLY_STORES'
    | 'AUTOMATED_CASH_DISBURSE'
    | 'AUTOMATED_FUEL_DISPENSERS'
    | 'AUTOMOBILE_ASSOCIATIONS'
    | 'AUTOMOTIVE_PARTS_AND_ACCESSORIES_STORES'
    | 'AUTOMOTIVE_TIRE_STORES'
    | 'BAIL_AND_BOND_PAYMENTS'
    | 'BAKERIES'
    | 'BANDS_ORCHESTRAS'
    | 'BARBER_AND_BEAUTY_SHOPS'
    | 'BETTING_CASINO_GAMBLING'
    | 'BICYCLE_SHOPS'
    | 'BILLIARD_POOL_ESTABLISHMENTS'
    | 'BOAT_DEALERS'
    | 'BOAT_RENTALS_AND_LEASES'
    | 'BOOK_STORES'
    | 'BOOKS_PERIODICALS_AND_NEWSPAPERS'
    | 'BOWLING_ALLEYS'
    | 'BUS_LINES'
    | 'BUSINESS_SECRETARIAL_SCHOOLS'
    | 'BUYING_SHOPPING_SERVICES'
    | 'CABLE_SATELLITE_AND_OTHER_PAY_TELEVISION_AND_RADIO'
    | 'CAMERA_AND_PHOTOGRAPHIC_SUPPLY_STORES'
    | 'CANDY_NUT_AND_CONFECTIONERY_STORES'
    | 'CAR_RENTAL_AGENCIES'
    | 'CAR_WASHES'
    | 'CAR_AND_TRUCK_DEALERS_NEW_USED'
    | 'CAR_AND_TRUCK_DEALERS_USED_ONLY'
    | 'CARPENTRY_SERVICES'
    | 'CARPET_UPHOLSTERY_CLEANING'
    | 'CATERERS'
    | 'CHARITABLE_AND_SOCIAL_SERVICE_ORGANIZATIONS_FUNDRAISING'
    | 'CHEMICALS_AND_ALLIED_PRODUCTS'
    | 'CHILD_CARE_SERVICES'
    | 'CHILDRENS_AND_INFANTS_WEAR_STORES'
    | 'CHIROPODISTS_PODIATRISTS'
    | 'CHIROPRACTORS'
    | 'CIGAR_STORES_AND_STANDS'
    | 'CIVIC_SOCIAL_FRATERNAL_ASSOCIATIONS'
    | 'CLEANING_AND_MAINTENANCE'
    | 'CLOTHING_RENTAL'
    | 'COLLEGES_UNIVERSITIES'
    | 'COMMERCIAL_EQUIPMENT'
    | 'COMMERCIAL_FOOTWEAR'
    | 'COMMERCIAL_PHOTOGRAPHY_ART_AND_GRAPHICS'
    | 'COMMUTER_TRANSPORT_AND_FERRIES'
    | 'COMPUTER_NETWORK_SERVICES'
    | 'COMPUTER_PROGRAMMING'
    | 'COMPUTER_REPAIR'
    | 'COMPUTER_SOFTWARE_STORES'
    | 'COMPUTERS_PERIPHERALS_AND_SOFTWARE'
    | 'CONCRETE_WORK_SERVICES'
    | 'CONSTRUCTION_MATERIALS'
    | 'CONSULTING_PUBLIC_RELATIONS'
    | 'CORRESPONDENCE_SCHOOLS'
    | 'COSMETIC_STORES'
    | 'COUNSELING_SERVICES'
    | 'COUNTRY_CLUBS'
    | 'COURIER_SERVICES'
    | 'COURT_COSTS'
    | 'CREDIT_REPORTING_AGENCIES'
    | 'CRUISE_LINES'
    | 'DAIRY_PRODUCTS_STORES'
    | 'DANCE_HALL_STUDIOS_SCHOOLS'
    | 'DATING_ESCORT_SERVICES'
    | 'DENTISTS_ORTHODONTISTS'
    | 'DEPARTMENT_STORES'
    | 'DETECTIVE_AGENCIES'
    | 'DIGITAL_GOODS_MEDIA'
    | 'DIGITAL_GOODS_APPLICATIONS'
    | 'DIGITAL_GOODS_GAMES'
    | 'DIGITAL_GOODS_LARGE_VOLUME'
    | 'DIRECT_MARKETING_CATALOG_MERCHANT'
    | 'DIRECT_MARKETING_COMBINATION_CATALOG_AND_RETAIL_MERCHANT'
    | 'DIRECT_MARKETING_INBOUND_TELEMARKETING'
    | 'DIRECT_MARKETING_INSURANCE_SERVICES'
    | 'DIRECT_MARKETING_OTHER'
    | 'DIRECT_MARKETING_OUTBOUND_TELEMARKETING'
    | 'DIRECT_MARKETING_SUBSCRIPTION'
    | 'DIRECT_MARKETING_TRAVEL'
    | 'DISCOUNT_STORES'
    | 'DOCTORS'
    | 'DOOR_TO_DOOR_SALES'
    | 'DRAPERY_WINDOW_COVERING_AND_UPHOLSTERY_STORES'
    | 'DRINKING_PLACES'
    | 'DRUG_STORES_AND_PHARMACIES'
    | 'DRUGS_DRUG_PROPRIETARIES_AND_DRUGGIST_SUNDRIES'
    | 'DRY_CLEANERS'
    | 'DURABLE_GOODS'
    | 'DUTY_FREE_STORES'
    | 'EATING_PLACES_RESTAURANTS'
    | 'EDUCATIONAL_SERVICES'
    | 'ELECTRIC_RAZOR_STORES'
    | 'ELECTRICAL_PARTS_AND_EQUIPMENT'
    | 'ELECTRICAL_SERVICES'
    | 'ELECTRONICS_REPAIR_SHOPS'
    | 'ELECTRONICS_STORES'
    | 'ELEMENTARY_SECONDARY_SCHOOLS'
    | 'EMPLOYMENT_TEMP_AGENCIES'
    | 'EQUIPMENT_RENTAL'
    | 'EXTERMINATING_SERVICES'
    | 'FAMILY_CLOTHING_STORES'
    | 'FAST_FOOD_RESTAURANTS'
    | 'FINANCIAL_INSTITUTIONS'
    | 'FINES_GOVERNMENT_ADMINISTRATIVE_ENTITIES'
    | 'FIREPLACE_FIREPLACE_SCREENS_AND_ACCESSORIES_STORES'
    | 'FLOOR_COVERING_STORES'
    | 'FLORISTS'
    | 'FLORISTS_SUPPLIES_NURSERY_STOCK_AND_FLOWERS'
    | 'FREEZER_AND_LOCKER_MEAT_PROVISIONERS'
    | 'FUEL_DEALERS_NON_AUTOMOTIVE'
    | 'FUNERAL_SERVICES_CREMATORIES'
    | 'FURNITURE_REPAIR_REFINISHING'
    | 'FURNITURE_HOME_FURNISHINGS_AND_EQUIPMENT_STORES_EXCEPT_APPLIANCES'
    | 'FURRIERS_AND_FUR_SHOPS'
    | 'GENERAL_SERVICES'
    | 'GIFT_CARD_NOVELTY_AND_SOUVENIR_SHOPS'
    | 'GLASS_PAINT_AND_WALLPAPER_STORES'
    | 'GLASSWARE_CRYSTAL_STORES'
    | 'GOLF_COURSES_PUBLIC'
    | 'GOVERNMENT_SERVICES'
    | 'GROCERY_STORES_SUPERMARKETS'
    | 'HARDWARE_STORES'
    | 'HARDWARE_EQUIPMENT_AND_SUPPLIES'
    | 'HEALTH_AND_BEAUTY_SPAS'
    | 'HEARING_AIDS_SALES_AND_SUPPLIES'
    | 'HEATING_PLUMBING_A_C'
    | 'HOBBY_TOY_AND_GAME_SHOPS'
    | 'HOME_SUPPLY_WAREHOUSE_STORES'
    | 'HOSPITALS'
    | 'HOTELS_MOTELS_AND_RESORTS'
    | 'HOUSEHOLD_APPLIANCE_STORES'
    | 'INDUSTRIAL_SUPPLIES'
    | 'INFORMATION_RETRIEVAL_SERVICES'
    | 'INSURANCE_DEFAULT'
    | 'INSURANCE_UNDERWRITING_PREMIUMS'
    | 'INTRA_COMPANY_PURCHASES'
    | 'JEWELRY_STORES_WATCHES_CLOCKS_AND_SILVERWARE_STORES'
    | 'LANDSCAPING_SERVICES'
    | 'LAUNDRIES'
    | 'LAUNDRY_CLEANING_SERVICES'
    | 'LEGAL_SERVICES_ATTORNEYS'
    | 'LUGGAGE_AND_LEATHER_GOODS_STORES'
    | 'LUMBER_BUILDING_MATERIALS_STORES'
    | 'MANUAL_CASH_DISBURSE'
    | 'MARINAS_SERVICE_AND_SUPPLIES'
    | 'MASONRY_STONEWORK_AND_PLASTER'
    | 'MASSAGE_PARLORS'
    | 'MEDICAL_SERVICES'
    | 'MEDICAL_AND_DENTAL_LABS'
    | 'MEDICAL_DENTAL_OPHTHALMIC_AND_HOSPITAL_EQUIPMENT_AND_SUPPLIES'
    | 'MEMBERSHIP_ORGANIZATIONS'
    | 'MENS_AND_BOYS_CLOTHING_AND_ACCESSORIES_STORES'
    | 'MENS_WOMENS_CLOTHING_STORES'
    | 'METAL_SERVICE_CENTERS'
    | 'MISCELLANEOUS_APPAREL_AND_ACCESSORY_SHOPS'
    | 'MISCELLANEOUS_AUTO_DEALERS'
    | 'MISCELLANEOUS_BUSINESS_SERVICES'
    | 'MISCELLANEOUS_FOOD_STORES'
    | 'MISCELLANEOUS_GENERAL_MERCHANDISE'
    | 'MISCELLANEOUS_GENERAL_SERVICES'
    | 'MISCELLANEOUS_HOME_FURNISHING_SPECIALTY_STORES'
    | 'MISCELLANEOUS_PUBLISHING_AND_PRINTING'
    | 'MISCELLANEOUS_RECREATION_SERVICES'
    | 'MISCELLANEOUS_REPAIR_SHOPS'
    | 'MISCELLANEOUS_SPECIALTY_RETAIL'
    | 'MOBILE_HOME_DEALERS'
    | 'MOTION_PICTURE_THEATERS'
    | 'MOTOR_FREIGHT_CARRIERS_AND_TRUCKING'
    | 'MOTOR_HOMES_DEALERS'
    | 'MOTOR_VEHICLE_SUPPLIES_AND_NEW_PARTS'
    | 'MOTORCYCLE_SHOPS_AND_DEALERS'
    | 'MOTORCYCLE_SHOPS_DEALERS'
    | 'MUSIC_STORES_MUSICAL_INSTRUMENTS_PIANOS_AND_SHEET_MUSIC'
    | 'NEWS_DEALERS_AND_NEWSSTANDS'
    | 'NON_FI_MONEY_ORDERS'
    | 'NON_FI_STORED_VALUE_CARD_PURCHASE_LOAD'
    | 'NONDURABLE_GOODS'
    | 'NURSERIES_LAWN_AND_GARDEN_SUPPLY_STORES'
    | 'NURSING_PERSONAL_CARE'
    | 'OFFICE_AND_COMMERCIAL_FURNITURE'
    | 'OPTICIANS_EYEGLASSES'
    | 'OPTOMETRISTS_OPHTHALMOLOGIST'
    | 'ORTHOPEDIC_GOODS_PROSTHETIC_DEVICES'
    | 'OSTEOPATHS'
    | 'PACKAGE_STORES_BEER_WINE_AND_LIQUOR'
    | 'PAINTS_VARNISHES_AND_SUPPLIES'
    | 'PARKING_LOTS_GARAGES'
    | 'PASSENGER_RAILWAYS'
    | 'PAWN_SHOPS'
    | 'PET_SHOPS_PET_FOOD_AND_SUPPLIES'
    | 'PETROLEUM_AND_PETROLEUM_PRODUCTS'
    | 'PHOTO_DEVELOPING'
    | 'PHOTOGRAPHIC_STUDIOS'
    | 'PHOTOGRAPHIC_PHOTOCOPY_MICROFILM_EQUIPMENT_AND_SUPPLIES'
    | 'PICTURE_VIDEO_PRODUCTION'
    | 'PIECE_GOODS_NOTIONS_AND_OTHER_DRY_GOODS'
    | 'PLUMBING_HEATING_EQUIPMENT_AND_SUPPLIES'
    | 'POLITICAL_ORGANIZATIONS'
    | 'POSTAL_SERVICES_GOVERNMENT_ONLY'
    | 'PRECIOUS_STONES_AND_METALS_WATCHES_AND_JEWELRY'
    | 'PROFESSIONAL_SERVICES'
    | 'PUBLIC_WAREHOUSING_AND_STORAGE'
    | 'QUICK_COPY_REPRO_AND_BLUEPRINT'
    | 'RAILROADS'
    | 'REAL_ESTATE_AGENTS_AND_MANAGERS_RENTALS'
    | 'RECORD_STORES'
    | 'RECREATIONAL_VEHICLE_RENTALS'
    | 'RELIGIOUS_GOODS_STORES'
    | 'RELIGIOUS_ORGANIZATIONS'
    | 'ROOFING_SIDING_SHEET_METAL'
    | 'SECRETARIAL_SUPPORT_SERVICES'
    | 'SECURITY_BROKERS_DEALERS'
    | 'SERVICE_STATIONS'
    | 'SEWING_NEEDLEWORK_FABRIC_AND_PIECE_GOODS_STORES'
    | 'SHOE_REPAIR_HAT_CLEANING'
    | 'SHOE_STORES'
    | 'SMALL_APPLIANCE_REPAIR'
    | 'SNOWMOBILE_DEALERS'
    | 'SPECIAL_TRADE_SERVICES'
    | 'SPECIALTY_CLEANING'
    | 'SPORTING_GOODS_STORES'
    | 'SPORTING_RECREATION_CAMPS'
    | 'SPORTS_CLUBS_FIELDS'
    | 'SPORTS_AND_RIDING_APPAREL_STORES'
    | 'STAMP_AND_COIN_STORES'
    | 'STATIONARY_OFFICE_SUPPLIES_PRINTING_AND_WRITING_PAPER'
    | 'STATIONERY_STORES_OFFICE_AND_SCHOOL_SUPPLY_STORES'
    | 'SWIMMING_POOLS_SALES'
    | 'T_UI_TRAVEL_GERMANY'
    | 'TAILORS_ALTERATIONS'
    | 'TAX_PAYMENTS_GOVERNMENT_AGENCIES'
    | 'TAX_PREPARATION_SERVICES'
    | 'TAXICABS_LIMOUSINES'
    | 'TELECOMMUNICATION_EQUIPMENT_AND_TELEPHONE_SALES'
    | 'TELECOMMUNICATION_SERVICES'
    | 'TELEGRAPH_SERVICES'
    | 'TENT_AND_AWNING_SHOPS'
    | 'TESTING_LABORATORIES'
    | 'THEATRICAL_TICKET_AGENCIES'
    | 'TIMESHARES'
    | 'TIRE_RETREADING_AND_REPAIR'
    | 'TOLLS_BRIDGE_FEES'
    | 'TOURIST_ATTRACTIONS_AND_EXHIBITS'
    | 'TOWING_SERVICES'
    | 'TRAILER_PARKS_CAMPGROUNDS'
    | 'TRANSPORTATION_SERVICES'
    | 'TRAVEL_AGENCIES_TOUR_OPERATORS'
    | 'TRUCK_STOP_ITERATION'
    | 'TRUCK_UTILITY_TRAILER_RENTALS'
    | 'TYPESETTING_PLATE_MAKING_AND_RELATED_SERVICES'
    | 'TYPEWRITER_STORES'
    | 'U_S_FEDERAL_GOVERNMENT_AGENCIES_OR_DEPARTMENTS'
    | 'UNIFORMS_COMMERCIAL_CLOTHING'
    | 'USED_MERCHANDISE_AND_SECONDHAND_STORES'
    | 'UTILITIES'
    | 'VARIETY_STORES'
    | 'VETERINARY_SERVICES'
    | 'VIDEO_AMUSEMENT_GAME_SUPPLIES'
    | 'VIDEO_GAME_ARCADES'
    | 'VIDEO_TAPE_RENTAL_STORES'
    | 'VOCATIONAL_TRADE_SCHOOLS'
    | 'WATCH_JEWELRY_REPAIR'
    | 'WELDING_REPAIR'
    | 'WHOLESALE_CLUBS'
    | 'WIG_AND_TOUPEE_STORES'
    | 'WIRES_MONEY_ORDERS'
    | 'WOMENS_ACCESSORY_AND_SPECIALTY_SHOPS'
    | 'WOMENS_READY_TO_WEAR_STORES'
    | 'WRECKING_AND_SALVAGE_YARDS';
  merchantNumber?: string;

  /** @format int32 */
  merchantCategoryCode?: number;
  merchantLogoUrl?: string;
}

export interface UserChartData {
  user?: UserChartInfo;
  amount?: Amount;
}

export interface UserChartInfo {
  /** @format uuid */
  userId?: string;
  type?: 'EMPLOYEE' | 'BUSINESS_OWNER';
  firstName?: string;
  lastName?: string;
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
  /** @format uuid */
  userId: string;

  /** Error message for any records that failed. Will be null if successful */
  errorMessage?: string;
}

export interface UpdateCardStatusRequest {
  /** @example CARDHOLDER_REQUESTED */
  statusReason?: 'NONE' | 'CARDHOLDER_REQUESTED';
}

export interface Card {
  /** @format uuid */
  cardId?: string;

  /** @format uuid */
  allocationId?: string;

  /** @format uuid */
  userId?: string;

  /** @format uuid */
  accountId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
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
  type?: 'PHYSICAL' | 'VIRTUAL';
  superseded?: boolean;
  cardNumber?: string;
  lastFour?: string;
  address?: Address;
  externalRef?: string;
}

export interface ActivateCardRequest {
  /** @pattern ^\d{4}$ */
  lastFour?: string;

  /** @example CARDHOLDER_REQUESTED */
  statusReason?: 'NONE' | 'CARDHOLDER_REQUESTED';
}

export interface UpdateCardAccountRequest {
  /**
   * @format uuid
   * @example c9609768-647d-4f00-b755-e474cc761c33
   */
  allocationId?: string;

  /**
   * @format uuid
   * @example 54826974-c2e3-4eee-a305-ba6f847748e8
   */
  accountId?: string;
}

export interface UpdateAccountActivityRequest {
  notes: string;

  /**
   * @format int32
   * @min 1
   */
  iconRef?: number;
}

export interface UpdateCardRequest {
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
}

export interface CardDetailsResponse {
  card: Card;
  ledgerBalance: Amount;
  availableBalance: Amount;
  allocationName: string;
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
}

export interface UpdateAllocationRequest {
  /**
   * name of the department/ allocation
   * @example advertisement
   */
  name?: string;

  /**
   * @format uuid
   * @example 48104ecb-1343-4cc1-b6f2-e6cc88e9a80f
   */
  parentAllocationId?: string;

  /** @format uuid */
  ownerId?: string;
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
}

export interface AllocationDetailsResponse {
  allocation?: Allocation;
  owner?: UserData;
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
}

export interface Receipt {
  /** @format uuid */
  receiptId: string;

  /** @format date-time */
  created: string;

  /** @format uuid */
  businessId: string;

  /** @format uuid */
  allocationId: string;

  /** @format uuid */
  accountId?: string;

  /** @format uuid */
  adjustmentId?: string;
  amount: Amount;
}

export interface CardAccount {
  /**
   * @format uuid
   * @example c9609768-647d-4f00-b755-e474cc761c33
   */
  allocationId?: string;

  /**
   * @format uuid
   * @example 54826974-c2e3-4eee-a305-ba6f847748e8
   */
  accountId?: string;

  /** @example ALLOCATION */
  accountType?: 'ALLOCATION' | 'CARD';
  ledgerBalance?: Amount;
}

export interface UserAllocationRolesResponse {
  userRolesAndPermissionsList: UserRolesAndPermissionsRecord[];
}

export interface UserRolesAndPermissionsRecord {
  /** @format uuid */
  userAllocationRoleId?: string;

  /** @format uuid */
  allocationId: string;
  user?: UserData;
  allocationRole?: string;
  inherited?: boolean;
  allocationPermissions?: (
    | 'READ'
    | 'CATEGORIZE'
    | 'LINK_RECEIPTS'
    | 'MANAGE_FUNDS'
    | 'MANAGE_CARDS'
    | 'MANAGE_USERS'
    | 'MANAGE_PERMISSIONS'
    | 'MANAGE_CONNECTIONS'
    | 'VIEW_OWN'
  )[];
  globalUserPermissions?: (
    | 'BATCH_ONBOARD'
    | 'CROSS_BUSINESS_BOUNDARY'
    | 'GLOBAL_READ'
    | 'CUSTOMER_SERVICE'
    | 'CUSTOMER_SERVICE_MANAGER'
    | 'SYSTEM'
  )[];
}

export interface CreateTestDataResponse {
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

export interface BusinessOwner {
  /** @format uuid */
  businessId?: string;
  type?: 'UNSPECIFIED' | 'PRINCIPLE_OWNER' | 'ULTIMATE_BENEFICIAL_OWNER';
  firstName?: NullableEncryptedString;
  lastName?: NullableEncryptedString;
  title?: string;
  relationshipOwner?: boolean;
  relationshipRepresentative?: boolean;
  relationshipExecutive?: boolean;
  relationshipDirector?: boolean;
  percentageOwnership?: number;
  address?: Address;
  taxIdentificationNumber?: NullableEncryptedString;
  email?: string;
  phone?: string;

  /** @format date */
  dateOfBirth?: string;
  countryOfCitizenship?:
    | 'UNSPECIFIED'
    | 'ABW'
    | 'AFG'
    | 'AGO'
    | 'AIA'
    | 'ALA'
    | 'ALB'
    | 'AND'
    | 'ANT'
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
  subjectRef?: string;
  knowYourCustomerStatus?: 'PENDING' | 'REVIEW' | 'FAIL' | 'PASS';
  status?: 'ACTIVE' | 'RETIRED';
  stripePersonReference?: string;

  /** @format int64 */
  version?: number;

  /** @format date-time */
  created?: string;

  /** @format date-time */
  updated?: string;

  /** @format uuid */
  id?: string;
}

export interface BusinessRecord {
  business?: Business;
  businessOwners?: BusinessOwner[];
  user?: User;
  allocation?: Allocation;
}

export interface NullableEncryptedString {
  encrypted?: string;
}

export interface ExpenseCategory {
  /** @format int32 */
  iconRef?: number;
  categoryName?: string;
}

export interface CodatAccountNested {
  id?: string;
  name?: string;
  status?: string;
  fullyQualifiedCategory?: string;
  fullyQualifiedName?: string;
  type?: string;
  children?: CodatAccountNested[];
}

export interface CodatAccountNestedResponse {
  results?: CodatAccountNested[];
}

export interface CodatBankAccount {
  id?: string;
  accountName?: string;
}

export interface CodatBankAccountsResponse {
  results?: CodatBankAccount[];
}

export interface BusinessLimit {
  /** @format int32 */
  issuedPhysicalCardsLimit?: number;

  /** @format int32 */
  issuedPhysicalCardsTotal?: number;
}

export interface BusinessProspectData {
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

  /**
   * The Business type
   * @example SINGLE_MEMBER_LLC
   */
  businessType:
    | 'INDIVIDUAL'
    | 'SOLE_PROPRIETORSHIP'
    | 'SINGLE_MEMBER_LLC'
    | 'MULTI_MEMBER_LLC'
    | 'PRIVATE_PARTNERSHIP'
    | 'PUBLIC_PARTNERSHIP'
    | 'PRIVATE_CORPORATION'
    | 'PUBLIC_CORPORATION'
    | 'INCORPORATED_NON_PROFIT';

  /**
   * Relationship to business Owner
   * @example true
   */
  relationshipOwner?: boolean;

  /**
   * Relationship to business Representative
   * @example true
   */
  relationshipRepresentative?: boolean;

  /**
   * Relationship to business Executive
   * @example true
   */
  relationshipExecutive?: boolean;

  /**
   * Relationship to business Director
   * @example true
   */
  relationshipDirector?: boolean;
}

export interface OwnersProvidedResponse {
  business: Business;

  /** Error message for any records that failed. Will be null if successful */
  errorMessages?: string[];
}

export interface BusinessOwnerInfo {
  /** @format uuid */
  businessOwnerId?: string;

  /** @format uuid */
  businessId?: string;
  firstName?: string;
  lastName?: string;

  /** @format date */
  dateOfBirth?: string;
  taxIdentificationNumber?: string;
  relationshipOwner?: boolean;
  relationshipRepresentative?: boolean;
  relationshipExecutive?: boolean;
  relationshipDirector?: boolean;
  percentageOwnership?: number;
  title?: string;
  address?: Address;
  email?: string;
  phone?: string;
}

export interface BankAccount {
  /** @format uuid */
  businessBankAccountId?: string;
  name?: string;
  routingNumber?: string;
  accountNumber?: string;
}

export interface LinkTokenResponse {
  linkToken?: string;
}

export interface ApplicationReviewRequirements {
  kybRequiredFields?: string[];
  kycRequiredFields?: Record<string, string[]>;
  kybRequiredDocuments?: RequiredDocument[];
  kycRequiredDocuments?: KycDocuments[];
  requireOwner?: boolean;
  requireRepresentative?: boolean;
}

export interface KycDocuments {
  owner?: string;
  documents?: RequiredDocument[];
}

export interface RequiredDocument {
  documentName?: string;
  type?: string;
  entityTokenId?: string;
}

export interface AllocationRolePermissionRecord {
  /** @format uuid */
  id?: string;

  /** @format uuid */
  businessId?: string;
  role_name: string;
  permissions: (
    | 'READ'
    | 'CATEGORIZE'
    | 'LINK_RECEIPTS'
    | 'MANAGE_FUNDS'
    | 'MANAGE_CARDS'
    | 'MANAGE_USERS'
    | 'MANAGE_PERMISSIONS'
    | 'MANAGE_CONNECTIONS'
    | 'VIEW_OWN'
  )[];
}

export interface AllocationRolePermissionsResponse {
  userAllocationRoleList: AllocationRolePermissionRecord[];
}
