export enum DocumentType {
  contract,
  license,
  passport,
  utility,
}

export enum ReviewType {
  KYB,
  KYC,
}

export enum KYBDocuments {
  Certificate_of_Incorporation = 'Certificate_of_Incorporation',
  Bank_Statement = 'Bank_Statement',
  Utility_Bill = 'Utility_Bill',
  Tax_Return = 'Tax_Return',
  Processed_SS4 = 'Processed_SS4',
  Manual_Third_Party_review = 'Manual_Third_Party_review',
}

export enum KYCDocuments {
  Bank_Statement = 'Bank_Statement',
  Utility_Bill = 'Utility_Bill',
  Unexpired_government_issued_ID = 'Unexpired_government_issued_ID',
  Tax_Return = 'Tax_Return',
  Manual_Third_Party_review = 'Manual_Third_Party_review',
}

export interface KycErrorCode {
  name: String;
  document: String;
}

export interface KybErrorCode {
  name: String;
  document: String;
}

export interface KycOwnerErrorCode {
  owner: String;
  kycErrorCodes: readonly Readonly<KycErrorCode>[];
}

export interface ReviewDocuments {
  kybErrorCodes: readonly Readonly<KybErrorCode>[];
  kycOwnerDocuments: readonly Readonly<KycOwnerErrorCode>[];
}

export interface RequiredDocument {
  documentName: String;
  type: DocumentType;
  entityTokenId: String;
}

export interface KycDocuments {
  owner: String;
  documents: readonly Readonly<RequiredDocument>[];
}

export interface ManualReviewResponse {
  kybRequiredDocuments: readonly Readonly<RequiredDocument>[];
  kycRequiredDocuments: readonly Readonly<KycDocuments>[];
}
