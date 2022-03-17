import { isString } from '_common/utils/isString';

export const maxLength =
  (maxLengthValue: number) =>
  (value?: unknown): boolean | string => {
    return (
      (isString(value) && !!value.trim() && value.trim().length) < maxLengthValue ||
      `Exceeds maximum length of ${maxLengthValue}`
    );
  };
