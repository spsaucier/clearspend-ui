import { i18n } from '_common/api/intl';

import type { UpdateBusiness } from '../../generated/capital';

type TimeZone = {
  [key in NonNullable<UpdateBusiness['timeZone']>]: string;
};

export const TIMEZONES: TimeZone = {
  US_EASTERN: String(i18n.t('US (Eastern)')),
  US_CENTRAL: String(i18n.t('US (Central)')),
  US_MOUNTAIN: String(i18n.t('US (Mountain)')),
  US_PACIFIC: String(i18n.t('US (Pacific)')),
  US_ALASKA: String(i18n.t('US (Alaska)')),
  US_HAWAII: String(i18n.t('US (Hawaii)')),
};
