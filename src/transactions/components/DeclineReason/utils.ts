import { i18n } from '_common/api/intl';
import type { AccountActivityResponse } from 'generated/capital';

import { declineReasons } from './constants';

export function getReasonText(details: Required<AccountActivityResponse>['declineDetails']) {
  const reason = declineReasons[details.reason!] || details.reason || '';

  if ('postalCode' in details && details.postalCode) {
    return i18n.t('{reason} ({postalCode} entered)', { reason: String(reason), postalCode: details.postalCode });
  }

  if ('mccGroup' in details) {
    if (details.mccGroup) {
      return i18n.t('{reason}: {mccGroup} not permitted on this {entityType}', {
        reason: String(reason),
        mccGroup: details.mccGroup.toLowerCase().replace(/_/g, ''),
        entityType: details.entityType?.toLowerCase() || 'card',
      });
    } else if (details.paymentType) {
      return i18n.t('{reason}: {paymentType} not permitted on this {entityType}', {
        reason: String(reason),
        paymentType: details.paymentType.toLowerCase().replace(/_/g, ''),
        entityType: details.entityType?.toLowerCase() || 'card',
      });
    }
  }
  if ('limitType' in details && details.limitType) {
    if ('exceededAmount' in details && details.exceededAmount) {
      return i18n.t('{reason}: {limitType} {period} limit exceeded by {amount}', {
        reason: String(reason),
        limitType: details.limitType.toLowerCase().replace(/_/g, ''),
        period: details.limitPeriod?.toLowerCase() || '',
        amount: details.exceededAmount,
      });
    } else {
      return i18n.t('{reason}: {limitType} {period} limit exceeded', {
        reason: String(reason),
        limitType: details.limitType.toLowerCase().replace(/_/g, ''),
        period: details.limitPeriod?.toLowerCase() || '',
      });
    }
  }

  return reason;
}
