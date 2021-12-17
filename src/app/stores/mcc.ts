import { create } from '_common/utils/store';

import { getMCCGroups } from '../services/mcc';

export const useMCC = create(getMCCGroups);
