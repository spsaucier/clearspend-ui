import { Router } from 'solid-app-router';

import type { Allocation } from 'generated/capital';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';

import { byNameChain } from '../AllocationSelect/utils';

import type { ListProps } from './List';
import { List } from './List';

const allocations = [
  {
    allocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    name: 'Lunch',
    ownerId: 'd9b5b629-853b-4799-8d77-1a35a9b2339c',
    account: {
      accountId: '477cd256-d361-4bba-9895-84afc2f69914',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
      ledgerAccountId: '9bfe796f-2686-43bc-8911-d1656d548949',
      type: 'ALLOCATION',
      cardId: null,
      ledgerBalance: { currency: 'USD', amount: 2.0 },
      availableBalance: { currency: 'USD', amount: 2.0 },
    },
    parentAllocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
    childrenAllocationIds: ['88243a69-b24f-4695-a70e-9089ca0998ce'],
  },
  {
    allocationId: '88243a69-b24f-4695-a70e-9089ca0998ce',
    name: 'Dinner',
    ownerId: 'd9b5b629-853b-4799-8d77-1a35a9b2339c',
    account: {
      accountId: '89925532-9177-4964-84f5-d655427cb8e1',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: '88243a69-b24f-4695-a70e-9089ca0998ce',
      ledgerAccountId: '9e45b90c-a34e-4b20-b9ef-5eea7cf602c5',
      type: 'ALLOCATION',
      cardId: null,
      ledgerBalance: { currency: 'USD', amount: 8.0 },
      availableBalance: { currency: 'USD', amount: 8.0 },
    },
    parentAllocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    childrenAllocationIds: [],
  },
  {
    allocationId: 'c057f800-5920-4fda-a0db-14f7d3c454c4',
    name: 'Permissions',
    ownerId: 'd9b5b629-853b-4799-8d77-1a35a9b2339c',
    account: {
      accountId: 'dae0b467-03cd-48c0-9f7a-38d41d2737ab',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: 'c057f800-5920-4fda-a0db-14f7d3c454c4',
      ledgerAccountId: '36038ae5-6239-40d2-acf0-9d25fc80b6f0',
      type: 'ALLOCATION',
      cardId: null,
      ledgerBalance: { currency: 'USD', amount: 10.0 },
      availableBalance: { currency: 'USD', amount: 10.0 },
    },
    parentAllocationId: '2587f140-93af-453a-904d-506eac12a53a',
    childrenAllocationIds: [],
  },
];
const root = getRootAllocation(allocations as unknown as Allocation[]);

const multiManagerAccessibleAllocations = [...(allocations as unknown as Allocation[])].sort((a, b) =>
  byNameChain(a, b, [...multiManagerAccessibleAllocations]),
);
const multiManagerCurrent = multiManagerAccessibleAllocations[0];

const argSets = {
  'Multi-Allocation Manager': {
    allocations: multiManagerAccessibleAllocations,
    current: multiManagerCurrent?.allocationId,
  },
};

export default {
  title: 'Allocations/List (Limited Allocations)',
  component: List,
  args: {
    argSets,
  },
};

export const MultiManager = (args: {
  argSets: { [key: string]: { allocations: ListProps['items']; current: ListProps['currentID'] } };
}) => (
  <Router>
    <div style={{ 'max-width': '400px', background: '#f3f2ef', padding: '15px', 'margin-bottom': '30px' }}>
      {/* eslint-disable-next-line no-console */}
      <List
        parentID={root?.allocationId || ''}
        currentID={args.argSets['Multi-Allocation Manager']!.current}
        items={args.argSets['Multi-Allocation Manager']!.allocations}
        // eslint-disable-next-line no-console
        onSelect={console.log}
      ></List>
    </div>
    <p>
      Current:{' '}
      {
        args.argSets['Multi-Allocation Manager']!.allocations.find(
          (a) => a.allocationId === args.argSets['Multi-Allocation Manager']!.current,
        )?.name
      }
    </p>
  </Router>
);
