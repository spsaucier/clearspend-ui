import { Button } from '_common/components/Button';
import { Page } from 'app/components/Page';

import { AllocationsSide } from './components/AllocationsSide';

import css from './Allocations.css';

export default function Allocations() {
  return (
    <Page
      title="$5,291.54"
      actions={
        <div class={css.actions}>
          <Button type="primary" size="lg" icon="add">
            Add Funds
          </Button>
          <Button icon="add" size="lg">
            New Card
          </Button>
        </div>
      }
      side={<AllocationsSide />}
    >
      Content
    </Page>
  );
}
