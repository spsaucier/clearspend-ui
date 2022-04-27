import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import type { Allocation, UserRolesAndPermissionsRecord } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';
import { getParentsChain } from '../../utils/getParentsChain';
import { canLinkBankAccounts, canManageFunds } from '../../utils/permissions';

interface ManageBalanceButtonProps {
  allocationId: string;
  allocations: readonly Readonly<Allocation>[];
  userPermissions: Readonly<UserRolesAndPermissionsRecord> | null;
  onClick: (allocationId: string) => void;
}

export function ManageBalanceButton(props: Readonly<ManageBalanceButtonProps>) {
  const canManage = createMemo<boolean>(() => {
    const allocation = props.allocations.find(allocationWithID(props.allocationId));

    if (!allocation) return false;
    if (!allocation.parentAllocationId) return canLinkBankAccounts(props.userPermissions);

    return canManageFunds(props.userPermissions) && !!getParentsChain(props.allocations, allocation).length;
  });

  return (
    <Show when={canManage()}>
      <Button
        id="manage-balance-button"
        size="lg"
        type="primary"
        icon="dollars"
        onClick={() => props.onClick(props.allocationId)}
      >
        <Text message="Manage Balance" />
      </Button>
    </Show>
  );
}
