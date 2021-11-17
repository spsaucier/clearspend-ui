import { create } from '_common/utils/store';

import { getAccountActivity } from '../services/activity';

export const useActivity = create(getAccountActivity);
