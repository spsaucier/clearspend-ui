import type { CodatAccountNested } from 'generated/capital';

export interface FlattenedIntegrationAccount extends CodatAccountNested {
  level: number;
  hasChildren: boolean;
  isNew: boolean;
}
