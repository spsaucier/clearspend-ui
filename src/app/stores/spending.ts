import { create } from '_common/utils/store';

import { getSpending } from '../services/activity';

export const useSpending = create(getSpending);
