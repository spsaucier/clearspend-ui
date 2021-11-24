import { create } from '_common/utils/store';

import { searchCards } from '../services';

export const useCards = create(searchCards);
