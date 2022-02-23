import type { UserRolesAndPermissionsRecord } from 'generated/capital';

import { getAllocationUserRole } from '../../utils/getAllocationUserRole';
import type { AllocationUserRole } from '../../types';

export function getRolesList(
  current: readonly UserRolesAndPermissionsRecord[],
  updated: readonly AllocationUserRole[],
): readonly AllocationUserRole[] {
  const currentIds = current.map((item) => item.user?.userId);
  const updatedIds = updated.map((item) => item.user.userId);

  return [
    ...current.map((role) => {
      const userId = role.user?.userId;
      return updatedIds.includes(userId)
        ? updated.find((item) => item.user.userId === userId)!
        : getAllocationUserRole(role);
    }),
    ...updated.filter((role) => !currentIds.includes(role.user.userId)),
  ];
}

export function getRolesUpdates(
  current: readonly UserRolesAndPermissionsRecord[],
  updated: readonly AllocationUserRole[],
) {
  const currentIds = current.map((item) => item.user?.userId);
  const updatedIds = updated.map((item) => item.user.userId);

  const [update, create] = updated.reduce<[update: AllocationUserRole[], create: AllocationUserRole[]]>(
    (res, role) => {
      if (currentIds.includes(role.user.userId)) res[0].push(role);
      else res[1].push(role);
      return res;
    },
    [[], []],
  );

  const remove = current.reduce<string[]>((res, item) => {
    const userId = item.user?.userId;
    if (!item.inherited && userId && !updatedIds.includes(userId)) res.push(userId);
    return res;
  }, []);

  return { create, update, remove };
}
