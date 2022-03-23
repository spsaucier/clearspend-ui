export enum AppEvent {
  Logout = 'logout',
}

export enum FileTypes {
  JPG = 'image/jpeg',
  PNG = 'image/png',
  PDF = 'application/pdf',
}

export interface FieldError {
  code: string;
  message: string;
}

export type FieldErrors = Readonly<Record<string, readonly Readonly<FieldError>[]>>;

export interface DateRange {
  from: string;
  to: string;
}
