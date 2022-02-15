export interface IntegrationOptionCardValues {
  name: string;
  description: string;
  largeLogo: string;
  smallLogo: string;
  onClick: () => Promise<void>;
}
