import { i18n } from '_common/api/intl';

import { formatAccountNumber } from './formatAccountNumber';

export function formatCardNumber(value: string = '', activated?: boolean): string {
  return activated ? formatAccountNumber(value) : String(i18n.t('Awaiting activation'));
}
