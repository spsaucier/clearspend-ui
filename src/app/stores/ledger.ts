import { create } from '_common/utils/store';
import { getLedgerActivity } from 'app/services/activity';

export const useLedger = create(getLedgerActivity);
