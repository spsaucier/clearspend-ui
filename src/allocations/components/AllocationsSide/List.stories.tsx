import { Router } from 'solid-app-router';

import { getAccessibleAllocations } from 'allocations/utils/getAccessibleAllocations';
import type { Allocation, UserRolesAndPermissionsRecord } from 'generated/capital';
import { getFirstAccessibleAllocation, getRootAllocation } from 'allocations/utils/getRootAllocation';

import { byName } from '../AllocationSelect/utils';

import type { ListProps } from './List';
import { List } from './List';

const allocations = [
  {
    allocationId: '7a2ed2cd-f517-428e-8b3e-bf7e13b1bb51',
    name: 'Breakfast',
    ownerId: 'd9b5b629-853b-4799-8d77-1a35a9b2339c',
    account: {
      accountId: '577459a2-1948-48fa-a90f-916df2280e4f',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: '7a2ed2cd-f517-428e-8b3e-bf7e13b1bb51',
      ledgerAccountId: 'db6798e2-c92e-430a-bcca-43f669d45387',
      type: 'ALLOCATION',
      cardId: null,
      ledgerBalance: { currency: 'USD', amount: 200.0 },
      availableBalance: { currency: 'USD', amount: 200.0 },
    },
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    childrenAllocationIds: [],
  },
  {
    allocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
    name: 'IT',
    ownerId: 'd9b5b629-853b-4799-8d77-1a35a9b2339c',
    account: {
      accountId: '5b2468a5-9245-45ae-9b4c-32ff450be870',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
      ledgerAccountId: '044b8d86-913e-49a8-811f-41c586d4581f',
      type: 'ALLOCATION',
      cardId: null,
      ledgerBalance: { currency: 'USD', amount: 1.0 },
      availableBalance: { currency: 'USD', amount: 1.0 },
    },
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    childrenAllocationIds: ['bdb01f17-5f1c-4e31-ad43-90fefb6e7954'],
  },
  {
    allocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    name: 'Dovetail',
    ownerId: 'd9b5b629-853b-4799-8d77-1a35a9b2339c',
    account: {
      accountId: '618175ef-c8fc-4695-8a02-5414440a0cda',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
      ledgerAccountId: '024dfe66-ac98-4b55-918d-312ab55fd10c',
      type: 'ALLOCATION',
      cardId: null,
      ledgerBalance: { currency: 'USD', amount: 808.0 },
      availableBalance: { currency: 'USD', amount: 808.0 },
    },
    parentAllocationId: null,
    childrenAllocationIds: [
      '7a2ed2cd-f517-428e-8b3e-bf7e13b1bb51',
      '527b4e6c-a069-4d07-bd44-10fc04070f7d',
      '2587f140-93af-453a-904d-506eac12a53a',
    ],
  },
  {
    allocationId: 'aa469797-9b3b-46b5-8528-1312238c03d4',
    name: 'Q2 2022',
    ownerId: 'fc0c07fe-bb22-4e53-8b79-639a8fb2326b',
    account: {
      accountId: 'e9dd963d-74fe-4c79-952b-7e07b86cfd64',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: 'aa469797-9b3b-46b5-8528-1312238c03d4',
      ledgerAccountId: 'e2e1f756-1335-4188-b9ea-da0fdadbe403',
      type: 'ALLOCATION',
      cardId: null,
      ledgerBalance: { currency: 'USD', amount: 5.0 },
      availableBalance: { currency: 'USD', amount: 5.0 },
    },
    parentAllocationId: '2587f140-93af-453a-904d-506eac12a53a',
    childrenAllocationIds: [],
  },
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
  {
    allocationId: '2587f140-93af-453a-904d-506eac12a53a',
    name: 'Marketing',
    ownerId: 'c1d27ff4-4a9d-4232-b3b3-1dc3b537a7aa',
    account: {
      accountId: 'd1959c32-527b-44a4-ba0c-a6b52bf2a9ee',
      businessId: '58022877-a122-47b8-8f78-7bdfbbba0e4d',
      allocationId: '2587f140-93af-453a-904d-506eac12a53a',
      ledgerAccountId: 'b78de55d-86da-4125-876b-8e58db12010b',
      type: 'ALLOCATION',
      cardId: null,
      ledgerBalance: { currency: 'USD', amount: 137.96 },
      availableBalance: { currency: 'USD', amount: 137.96 },
    },
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    childrenAllocationIds: ['aa469797-9b3b-46b5-8528-1312238c03d4', 'c057f800-5920-4fda-a0db-14f7d3c454c4'],
  },
];
const root = getRootAllocation(allocations as unknown as Allocation[]);

const rootManagerRoles = [
  {
    allocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    parentAllocationId: null,
    user: { userId: 'e9e8d9c9-8ed4-4d93-a480-e182892f4b84', type: 'EMPLOYEE', firstName: 'Root', lastName: 'Manager' },
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
    allocationId: '2587f140-93af-453a-904d-506eac12a53a',
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    user: { userId: 'e9e8d9c9-8ed4-4d93-a480-e182892f4b84', type: 'EMPLOYEE', firstName: 'Root', lastName: 'Manager' },
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
  {
    allocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    user: { userId: 'e9e8d9c9-8ed4-4d93-a480-e182892f4b84', type: 'EMPLOYEE', firstName: 'Root', lastName: 'Manager' },
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
  {
    allocationId: '7a2ed2cd-f517-428e-8b3e-bf7e13b1bb51',
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    user: { userId: 'e9e8d9c9-8ed4-4d93-a480-e182892f4b84', type: 'EMPLOYEE', firstName: 'Root', lastName: 'Manager' },
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
  {
    allocationId: 'aa469797-9b3b-46b5-8528-1312238c03d4',
    parentAllocationId: '2587f140-93af-453a-904d-506eac12a53a',
    user: { userId: 'e9e8d9c9-8ed4-4d93-a480-e182892f4b84', type: 'EMPLOYEE', firstName: 'Root', lastName: 'Manager' },
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
  {
    allocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    parentAllocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
    user: { userId: 'e9e8d9c9-8ed4-4d93-a480-e182892f4b84', type: 'EMPLOYEE', firstName: 'Root', lastName: 'Manager' },
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
  {
    allocationId: 'c057f800-5920-4fda-a0db-14f7d3c454c4',
    parentAllocationId: '2587f140-93af-453a-904d-506eac12a53a',
    user: { userId: 'e9e8d9c9-8ed4-4d93-a480-e182892f4b84', type: 'EMPLOYEE', firstName: 'Root', lastName: 'Manager' },
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
  {
    allocationId: '88243a69-b24f-4695-a70e-9089ca0998ce',
    parentAllocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    user: { userId: 'e9e8d9c9-8ed4-4d93-a480-e182892f4b84', type: 'EMPLOYEE', firstName: 'Root', lastName: 'Manager' },
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
const rootManagerAccessibleAllocations = getAccessibleAllocations(
  allocations as unknown as Allocation[],
  rootManagerRoles as UserRolesAndPermissionsRecord[],
);
const rootManagerCurrent = getFirstAccessibleAllocation([...rootManagerAccessibleAllocations].sort(byName));

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

const singleManagerRoles = [
  {
    allocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    parentAllocationId: null,
    user: { userId: 'f9fb1cb7-44ec-43db-9f29-084f9f64a4d9', type: 'EMPLOYEE', firstName: 'Sub', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: false,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: '2587f140-93af-453a-904d-506eac12a53a',
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    user: { userId: 'f9fb1cb7-44ec-43db-9f29-084f9f64a4d9', type: 'EMPLOYEE', firstName: 'Sub', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: true,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    user: { userId: 'f9fb1cb7-44ec-43db-9f29-084f9f64a4d9', type: 'EMPLOYEE', firstName: 'Sub', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: true,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: '7a2ed2cd-f517-428e-8b3e-bf7e13b1bb51',
    parentAllocationId: '1d77bbeb-d765-43b8-a947-0d13e54cf871',
    user: { userId: 'f9fb1cb7-44ec-43db-9f29-084f9f64a4d9', type: 'EMPLOYEE', firstName: 'Sub', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: true,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: 'aa469797-9b3b-46b5-8528-1312238c03d4',
    parentAllocationId: '2587f140-93af-453a-904d-506eac12a53a',
    user: { userId: 'f9fb1cb7-44ec-43db-9f29-084f9f64a4d9', type: 'EMPLOYEE', firstName: 'Sub', lastName: 'Manager' },
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
    allocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    parentAllocationId: '527b4e6c-a069-4d07-bd44-10fc04070f7d',
    user: { userId: 'f9fb1cb7-44ec-43db-9f29-084f9f64a4d9', type: 'EMPLOYEE', firstName: 'Sub', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: true,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: 'c057f800-5920-4fda-a0db-14f7d3c454c4',
    parentAllocationId: '2587f140-93af-453a-904d-506eac12a53a',
    user: { userId: 'f9fb1cb7-44ec-43db-9f29-084f9f64a4d9', type: 'EMPLOYEE', firstName: 'Sub', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: true,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
  {
    allocationId: '88243a69-b24f-4695-a70e-9089ca0998ce',
    parentAllocationId: 'bdb01f17-5f1c-4e31-ad43-90fefb6e7954',
    user: { userId: 'f9fb1cb7-44ec-43db-9f29-084f9f64a4d9', type: 'EMPLOYEE', firstName: 'Sub', lastName: 'Manager' },
    allocationRole: 'Employee',
    inherited: false,
    allocationPermissions: ['CATEGORIZE', 'LINK_RECEIPTS', 'VIEW_OWN'],
    globalUserPermissions: [],
  },
];
const singleManagerAccessibleAllocations = getAccessibleAllocations(
  allocations as unknown as Allocation[],
  singleManagerRoles as UserRolesAndPermissionsRecord[],
);
const singleManagerCurrent = getFirstAccessibleAllocation([...singleManagerAccessibleAllocations].sort(byName));

const argSets = {
  'Root Manager': { allocations: rootManagerAccessibleAllocations, current: rootManagerCurrent?.allocationId },
  'Multi-Allocation Manager': {
    allocations: multiManagerAccessibleAllocations,
    current: multiManagerCurrent?.allocationId,
  },
  'Single-Allocation Manager': {
    allocations: singleManagerAccessibleAllocations,
    current: singleManagerCurrent?.allocationId,
  },
};

export default {
  title: 'Allocations/List',
  component: List,
  args: {
    argSets,
  },
};

export const RootManager = (args: {
  argSets: { [key: string]: { allocations: ListProps['items']; current: ListProps['currentID'] } };
}) => (
  <Router>
    <div style={{ 'max-width': '400px', background: '#f3f2ef', padding: '15px', 'margin-bottom': '30px' }}>
      {/* eslint-disable-next-line no-console */}
      <List
        parentID={root?.allocationId || ''}
        currentID={args.argSets['Root Manager']!.current}
        items={args.argSets['Root Manager']!.allocations}
        onSelect={console.log}
      ></List>
    </div>
    <p>
      Current:{' '}
      {
        args.argSets['Root Manager']!.allocations.find((a) => a.allocationId === args.argSets['Root Manager']!.current)
          ?.name
      }
    </p>
  </Router>
);

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

export const SingleManager = (args: {
  argSets: { [key: string]: { allocations: ListProps['items']; current: ListProps['currentID'] } };
}) => (
  <Router>
    <div style={{ 'max-width': '400px', background: '#f3f2ef', padding: '15px', 'margin-bottom': '30px' }}>
      {/* eslint-disable-next-line no-console */}
      <List
        parentID={root?.allocationId || ''}
        currentID={args.argSets['Single-Allocation Manager']!.current}
        items={args.argSets['Single-Allocation Manager']!.allocations}
        onSelect={console.log}
      ></List>
    </div>
    <p>
      Current:{' '}
      {
        args.argSets['Single-Allocation Manager']!.allocations.find(
          (a) => a.allocationId === args.argSets['Single-Allocation Manager']!.current,
        )?.name
      }
    </p>
  </Router>
);
