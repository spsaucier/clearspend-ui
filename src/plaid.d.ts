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

declare interface PlaidConfig {
  token: string;
  receivedRedirectUri: string | null;
  onSuccess?: (publicToken: string, metadata: Readonly<PlaidMetadata>) => void;
  onLoad?: () => void;
  onExit?: (err: unknown, metadata: unknown) => void;
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
