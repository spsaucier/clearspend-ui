import { queryHelpers } from 'solid-testing-library';

export const queryByDataName = queryHelpers.queryByAttribute.bind(null, 'data-name');
