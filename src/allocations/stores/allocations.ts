import { create } from '_common/utils/store';

import { getAllocations } from '../services';

export const useAllocations = create(getAllocations);
