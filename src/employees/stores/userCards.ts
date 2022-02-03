import { create } from '_common/utils/store';

import { getUserCards } from '../services';

export const useUserCards = create(getUserCards);
