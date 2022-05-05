import { createSignal, createMemo } from 'solid-js';
import { Router } from 'solid-app-router';

import type { Allocation } from 'generated/capital';

import { byNameChain } from '../AllocationSelect/utils';

import { LimitedList } from './LimitedList';

const allocations: Allocation[] = [
  {
    allocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    name: 'Lunch',
    account: {
      accountId: '477cd256-d361-4bba-9895-84afc2f69914',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
      ledgerAccountId: '9bfe796f-2686-43bc-8911-d1656d548949',
      type: 'ALLOCATION',
      cardId: undefined,
      ledgerBalance: { currency: 'USD', amount: 2.0 },
      availableBalance: { currency: 'USD', amount: 2.0 },
    },
    parentAllocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
    childrenAllocationIds: ['88243a69-b24f-4695-a70e-9089ca0998ce'],
  },
  {
    allocationId: '88243a69-b24f-4695-a70e-9089ca0998ce',
    name: 'Dinner',
    account: {
      accountId: '89925532-9177-4964-84f5-d655427cb8e1',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: '88243a69-b24f-4695-a70e-9089ca0998ce',
      ledgerAccountId: '9e45b90c-a34e-4b20-b9ef-5eea7cf602c5',
      type: 'ALLOCATION',
      cardId: undefined,
      ledgerBalance: { currency: 'USD', amount: 8.0 },
      availableBalance: { currency: 'USD', amount: 8.0 },
    },
    parentAllocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    childrenAllocationIds: [],
  },
  {
    allocationId: 'c057f800-5920-4fda-a0db-14f7d3c454c4',
    name: 'Permissions',
    account: {
      accountId: 'dae0b467-03cd-48c0-9f7a-38d41d2737ab',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: 'c057f800-5920-4fda-a0db-14f7d3c454c4',
      ledgerAccountId: '36038ae5-6239-40d2-acf0-9d25fc80b6f0',
      type: 'ALLOCATION',
      cardId: undefined,
      ledgerBalance: { currency: 'USD', amount: 10.0 },
      availableBalance: { currency: 'USD', amount: 10.0 },
    },
    parentAllocationId: '2587f140-93af-453a-904d-506eac12a53a',
    childrenAllocationIds: [],
  },
];

export default {
  title: 'Allocations/List (Limited Allocations)',
  component: LimitedList,
};

export const Default = () => {
  const sortedItems = createMemo(() => [...allocations].sort((a, b) => byNameChain(a, b, allocations)));
  const [currentID, setCurrentID] = createSignal(sortedItems()[0]!.allocationId);

  return (
    <Router>
      <div style={{ 'max-width': '400px', background: '#f3f2ef', padding: '15px', 'margin-bottom': '30px' }}>
        <LimitedList currentID={currentID()} items={sortedItems()} onSelect={setCurrentID} />
      </div>
      <p>
        <span>Current: </span>
        {sortedItems().find((a) => a.allocationId === currentID())?.name}
      </p>
    </Router>
  );
};
