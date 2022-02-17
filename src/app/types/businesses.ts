export enum BusinessStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ONBOARDING = 'ONBOARDING',
  SUSPENDED = 'SUSPENDED',
}

// From ConvertBusinessProspectRequest['businessType']
export enum BusinessType {
  UNKNOWN = 'UNKNOWN',
  OTHER = 'OTHER',
  SOLE_PROPRIETORSHIP = 'SOLE_PROPRIETORSHIP',
  SINGLE_MEMBER_LLC = 'SINGLE_MEMBER_LLC',
  MULTI_MEMBER_LLC = 'MULTI_MEMBER_LLC',
  PRIVATE_PARTNERSHIP = 'PRIVATE_PARTNERSHIP',
  PUBLIC_PARTNERSHIP = 'PUBLIC_PARTNERSHIP',
  PRIVATE_CORPORATION = 'PRIVATE_CORPORATION',
  PUBLIC_CORPORATION = 'PUBLIC_CORPORATION',
  INCORPORATED_NON_PROFIT = 'INCORPORATED_NON_PROFIT',
}

export enum OnboardingStep {
  BUSINESS = 'BUSINESS',
  BUSINESS_OWNERS = 'BUSINESS_OWNERS',
  LINK_ACCOUNT = 'LINK_ACCOUNT',
  REVIEW = 'REVIEW',
  SOFT_FAIL = 'SOFT_FAIL',
  TRANSFER_MONEY = 'TRANSFER_MONEY',
  COMPLETE = 'COMPLETE',
}

export enum RelationshipToBusiness {
  OWNER = 'OWNER',
  REPRESENTATIVE = 'REPRESENTATIVE',
  EXECUTIVE = 'EXECUTIVE',
  DIRECTOR = 'DIRECTOR',
  OTHER = 'OTHER',
}

export enum BusinessTypeCategory {
  UNKNOWN = 'UNKNOWN',
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
  NONPROFIT = 'NONPROFIT',
}

export enum AccountSetupStep {
  ADD_CREDIT_CARD = 'ADD_CREDIT_CARD',
  MAP_CATEGORIES = 'MAP_CATEGORIES',
  COMPLETE = 'COMPLETE',
}
