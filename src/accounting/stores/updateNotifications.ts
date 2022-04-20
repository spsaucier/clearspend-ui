import { getRecentUpdateNotifications, getUpdateNotifications } from 'accounting/services';
import { create } from '_common/utils/store';

export const useUpdateNotifications = create(getUpdateNotifications);

export const useRecentUpdateNotifications = create(getRecentUpdateNotifications);
