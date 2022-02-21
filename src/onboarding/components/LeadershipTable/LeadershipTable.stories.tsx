/* eslint-disable @typescript-eslint/no-magic-numbers */
import { createSignal } from 'solid-js';

import type { CreateOrUpdateBusinessOwnerRequest } from '../../../generated/capital';

import { LeadershipTable } from './LeadershipTable';

export default {
  title: 'Composite/Leadership Table',
  component: LeadershipTable,
};

function randomString(len: number) {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  // eslint-disable-next-line @typescript-eslint/no-shadow
  let randomString = '';
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const generateLeader = () =>
  ({
    firstName: capitalize(randomString(12).toLocaleLowerCase()),
    lastName: capitalize(randomString(12).toLocaleLowerCase()),
    email: `${randomString(8)}@${randomString(8)}.com`,
    id: randomString(30),
    dateOfBirth: randomString(8),
    taxIdentificationNumber: randomString(12),
    relationshipDirector: Math.random() < 0.5,
    relationshipExecutive: Math.random() < 0.5,
    relationshipRepresentative: Math.random() < 0.5,
    relationshipOwner: Math.random() < 0.5,
    percentageOwnership: Math.floor(Math.random() * 100),
  } as CreateOrUpdateBusinessOwnerRequest);

export const KeyboardAccessibility = () => {
  const [leaders, setLeaders] = createSignal<CreateOrUpdateBusinessOwnerRequest[]>([]);

  // eslint-disable-next-line no-console
  const onEditClick = (id: string) => console.log(leaders().find((l) => l.id === id));
  const onDeleteClick = (id: string) => setLeaders((oldVal) => oldVal.filter((o) => o.id !== id));
  const onAddClick = () => {
    setLeaders((oldVal) => [...oldVal, generateLeader()]);
  };

  return (
    <div style={{ 'max-width': '800px' }}>
      <LeadershipTable
        leaders={leaders()}
        onEditClick={onEditClick}
        onAddClick={onAddClick}
        onDeleteClick={onDeleteClick}
      />
    </div>
  );
};
