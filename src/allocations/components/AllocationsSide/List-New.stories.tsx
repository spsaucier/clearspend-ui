import { Router } from 'solid-app-router';

import { getAccessibleAllocations } from 'allocations/utils/getAccessibleAllocations';
import type { Allocation, UserRolesAndPermissionsRecord } from 'generated/capital';
import { getFirstAccessibleAllocation, getRootAllocation } from 'allocations/utils/getRootAllocation';

import { byName } from '../AllocationSelect/utils';

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

const multiManagerRoles = [
  {
    allocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    parentAllocationId: null,
    user: { userId: '31551bd0-5f96-458e-9497-665f24ecdc84', type: 'EMPLOYEE', firstName: 'Multi', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: false,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: '2587f140-93af-453a-904d-506eac12a53a',
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    user: { userId: '31551bd0-5f96-458e-9497-665f24ecdc84', type: 'EMPLOYEE', firstName: 'Multi', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: true,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    user: { userId: '31551bd0-5f96-458e-9497-665f24ecdc84', type: 'EMPLOYEE', firstName: 'Multi', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: true,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: '7a2ed2cd-f517-428e-8b3e-bf7e13b1bb51',
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    user: { userId: '31551bd0-5f96-458e-9497-665f24ecdc84', type: 'EMPLOYEE', firstName: 'Multi', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: true,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: 'aa469797-9b3b-46b5-8528-1312238c03d4',
    parentAllocationId: '2587f140-93af-453a-904d-506eac12a53a',
    user: { userId: '31551bd0-5f96-458e-9497-665f24ecdc84', type: 'EMPLOYEE', firstName: 'Multi', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: true,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    parentAllocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
    user: { userId: '31551bd0-5f96-458e-9497-665f24ecdc84', type: 'EMPLOYEE', firstName: 'Multi', lastName: 'Manager' },
    allocationRole: 'Manager',
    inherited: false,
    allocationPermissions: [
      'READ',
      'CATEGORIZE',
      'LINK_RECEIPTS',
      'MANAGE_FUNDS',
      'MANAGE_CARDS',
      'MANAGE_PERMISSIONS',
      'MANAGE_CONNECTIONS',
      'VIEW_OWN',
    ],
    globalUserPermissions: [],
  },
  {
    allocationId: 'c057f800-5920-4fda-a0db-14f7d3c454c4',
    parentAllocationId: '2587f140-93af-453a-904d-506eac12a53a',
    user: { userId: '31551bd0-5f96-458e-9497-665f24ecdc84', type: 'EMPLOYEE', firstName: 'Multi', lastName: 'Manager' },
    allocationRole: 'Manager',
    inherited: false,
    allocationPermissions: [
      'READ',
      'CATEGORIZE',
      'LINK_RECEIPTS',
      'MANAGE_FUNDS',
      'MANAGE_CARDS',
      'MANAGE_PERMISSIONS',
      'MANAGE_CONNECTIONS',
      'VIEW_OWN',
    ],
    globalUserPermissions: [],
  },
  {
    allocationId: '88243a69-b24f-4695-a70e-9089ca0998ce',
    parentAllocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    user: { userId: '31551bd0-5f96-458e-9497-665f24ecdc84', type: 'EMPLOYEE', firstName: 'Multi', lastName: 'Manager' },
    allocationRole: 'Manager',
    inherited: true,
    allocationPermissions: [
      'READ',
      'CATEGORIZE',
      'LINK_RECEIPTS',
      'MANAGE_FUNDS',
      'MANAGE_CARDS',
      'MANAGE_PERMISSIONS',
      'MANAGE_CONNECTIONS',
      'VIEW_OWN',
    ],
    globalUserPermissions: [],
  },
];
const multiManagerAccessibleAllocations = getAccessibleAllocations(
  allocations as unknown as Allocation[],
  multiManagerRoles as UserRolesAndPermissionsRecord[],
);
const multiManagerCurrent = getFirstAccessibleAllocation([...multiManagerAccessibleAllocations].sort(byName));

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
