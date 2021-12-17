import { create } from '_common/utils/store';

import { getUsers } from '../services';

export const useUsersList = create(getUsers);
