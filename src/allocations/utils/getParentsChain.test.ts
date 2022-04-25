import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import type { Account } from 'generated/capital';

import type { AccessibleAllocation } from '../types';

import { getParentsChain } from './getParentsChain';

const test = suite('getParentsChain');

const ACCOUNT: Account = {
  accountId: '',
  businessId: '',
  allocationId: '',
  ledgerAccountId: '',
  type: 'ALLOCATION',
  ledgerBalance: {},
};

const ROOT: AccessibleAllocation = {
  allocationId: 'a',
  name: '',
  ownerId: '',
  account: ACCOUNT,
  childrenAllocationIds: ['b', 'd'],
  inaccessible: true,
};

const B: AccessibleAllocation = {
  allocationId: 'b',
  name: '',
  ownerId: '',
  account: ACCOUNT,
  parentAllocationId: 'a',
  childrenAllocationIds: ['c'],
};

const C: AccessibleAllocation = {
  allocationId: 'c',
  name: '',
  ownerId: '',
  account: ACCOUNT,
  parentAllocationId: 'b',
};

const D: AccessibleAllocation = {
  allocationId: 'd',
  name: '',
  ownerId: '',
  account: ACCOUNT,
  parentAllocationId: 'a',
  inaccessible: true,
};

const ALLOCATIONS: readonly Readonly<AccessibleAllocation>[] = [ROOT, B, C, D];

test('it should return parents', () => {
  assert.equal(getParentsChain(ALLOCATIONS, undefined), []);
  assert.equal(getParentsChain(ALLOCATIONS, ROOT), []);
  assert.equal(getParentsChain(ALLOCATIONS, B), [ROOT]);
  assert.equal(getParentsChain(ALLOCATIONS, C), [ROOT, B]);
  assert.equal(getParentsChain(ALLOCATIONS, D), [ROOT]);
});

test('it should return parents without root item', () => {
  const options = { excludeRoot: true };
  assert.equal(getParentsChain(ALLOCATIONS, B, options), []);
  assert.equal(getParentsChain(ALLOCATIONS, C, options), [B]);
  assert.equal(getParentsChain(ALLOCATIONS, D, options), []);
});

test('it should return parents without inaccessible items', () => {
  const options = { excludeInaccessible: true };
  assert.equal(getParentsChain(ALLOCATIONS, B, options), []);
  assert.equal(getParentsChain(ALLOCATIONS, C, options), [B]);
  assert.equal(getParentsChain(ALLOCATIONS, D, options), []);
});

test.run();
