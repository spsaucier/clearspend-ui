import { create } from '_common/utils/store';

import { getGraphData } from '../services/activity';

export const useSpend = create(getGraphData);
