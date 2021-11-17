import { create } from '_common/utils/store';

import { searchUsers } from '../services';

export const useUsers = create(searchUsers);
