import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import type { Account, Allocation } from 'generated/capital';

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

const ROOT: Allocation = {
  allocationId: 'a',
  name: '',
  ownerId: '',
  account: ACCOUNT,
  childrenAllocationIds: ['b', 'd'],
};

const B: Allocation = {
  allocationId: 'b',
  name: '',
  ownerId: '',
  account: ACCOUNT,
  parentAllocationId: 'a',
  childrenAllocationIds: ['c'],
};

const C: Allocation = {
  allocationId: 'c',
  name: '',
  ownerId: '',
  account: ACCOUNT,
  parentAllocationId: 'b',
};

const D: Allocation = {
  allocationId: 'd',
  name: '',
  ownerId: '',
  account: ACCOUNT,
  parentAllocationId: 'a',
};

const ALLOCATIONS: readonly Readonly<Allocation>[] = [ROOT, B, C, D];

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

test.run();
