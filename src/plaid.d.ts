// https://plaid.com/docs/link/web/

declare interface PlaidBankAccount {
  id: string;
  mask: string;
  name: string;
  subtype: string;
  type: string;
}

declare interface PlaidMetadata {
  accounts: readonly Readonly<PlaidBankAccount>[];
  link_session_id: string;
  public_token: string;
}

type PlaidExitError = {
  error_type: string;
  error_code: string;
  error_message: string;
  display_message: string;
} | null;

type PlaidInstitution = {
  name: string;
  institution_id: string;
};

type PlaidExitStatus =
  | 'requires_questions'
  | 'requires_selections'
  | 'requires_code'
  | 'choose_device'
  | 'requires_credentials'
  | 'requires_oauth'
  | 'institution_not_found';

type PlaidExitMetadata = {
  institution: PlaidInstitution;
  status: PlaidExitStatus;
  link_session_id: string;
  request_id: string;
};

declare interface PlaidConfig {
  token: string;
  receivedRedirectUri: string | null;
  onSuccess?: (publicToken: string, metadata: Readonly<PlaidMetadata>) => void;
  onLoad?: () => void;
  onExit?: (err: PlaidExitError, metadata: PlaidExitMetadata) => void;
  onEvent?: (eventName: string, metadata: unknown) => void;
}

declare interface PlaidLink {
  open: () => void;
  exit: () => void;
  destroy: () => void;
}

declare const Plaid: {
  create: (config: PlaidConfig) => PlaidLink;
};
