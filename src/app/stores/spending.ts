import { create } from '_common/utils/store';

import { getSpendingByCategory } from '../services/activity';

export const useSpending = create(getSpendingByCategory);
