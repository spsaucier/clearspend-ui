export interface FormValues {
  firstName: string;
  lastName: string;
  birthdate: ReadonlyDate | undefined;
  ssn: string;
  email: string;
  phone: string;
  streetLine1: string;
  streetLine2: string;
  locality: string;
  region: string;
  postalCode: string;
  percentageOwnership: number;
  title?: string;
  relationshipToBusiness: string[];
}
