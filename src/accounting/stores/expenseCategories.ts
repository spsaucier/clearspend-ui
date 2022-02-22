import { create } from '_common/utils/store';

import { getExpenseCategories } from '../services';

export const useExpenseCategories = create(getExpenseCategories);
