import { useNavigate } from 'solid-app-router';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { Divider } from '_common/components/Divider';
import { Button } from '_common/components/Button';

import css from './AllocationsSide.css';

export function AllocationsSide() {
  const navigate = useNavigate();

  return (
    <section class={css.root}>
      <header class={css.header}>
        <h3 class={css.title}>Allocations</h3>
        <Input disabled placeholder="Search Allocations..." suffix={<Icon name="search" size="sm" />} />
      </header>
      <div class={css.content}>
        <button class={css.item} classList={{ [css.active!]: true }}>
          <Icon name="company" />
          [Name]
        </button>
        <Divider class={css.divider} />
        <button class={css.item}>[Name]</button>
        <button class={css.item}>[Name]</button>
        <button class={css.item}>[Name]</button>
        <Button wide type="primary" icon="add" onClick={() => navigate('/allocations/edit')}>
          New Allocation
        </Button>
      </div>
    </section>
  );
}
