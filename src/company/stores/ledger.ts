import { create } from '_common/utils/store';
import { getAccountActivity } from 'app/services/activity';

export const useLedger = create(getAccountActivity);
