import { Accessor, createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { Input } from '_common/components/Input';

import css from './EditCardNameForm.css';

interface EditCardNameFormProps {
  oldCardName: Accessor<string>;
  onSave: (name: string) => void;
}

export function EditCardNameForm(props: Readonly<EditCardNameFormProps>) {
  const [newCardName, setNewCardName] = createSignal<string>(props.oldCardName());
  return (
    <div class={css.root}>
      <div>
        <h1 class={css.title}>Edit Card</h1>
        <Text message="Card name" />
        <Input
          name="first-name"
          value={newCardName()}
          onChange={(value) => setNewCardName(value)}
          error={newCardName() === ''}
        />
      </div>
      <Button onClick={() => props.onSave(newCardName())} disabled={newCardName() === ''}>
        Save
      </Button>
    </div>
  );
}
