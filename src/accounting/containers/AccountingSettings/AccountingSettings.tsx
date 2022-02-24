import { Text } from 'solid-i18n';
import { createSignal } from 'solid-js';

import { Section } from 'app/components/Section';
import { Button } from '_common/components/Button';
import { Popover } from '_common/components/Popover';

import css from './AccountingSettings.css';

export function AccountingSettings() {
  const [open, setOpen] = createSignal(false);

  return (
    <Section
      title={<Text message="Unlink Account" />}
      description={<Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />}
    >
      <Popover
        balloon
        open={open()}
        onClickOutside={() => setOpen(false)}
        class={css.popoverRoot}
        content={
          <div>
            <Text message="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
            <div class={css.popoverButtons}>
              <Button view="ghost" onClick={() => setOpen(false)}>
                <Text message="Cancel" />
              </Button>
              <Button
                class={css.popoverUnlink}
                icon={{ name: 'confirm', pos: 'right' }}
                onClick={() => {
                  // TODO
                }}
              >
                <Text message="Unlink now" />
              </Button>
            </div>
          </div>
        }
      >
        <Button size="lg" icon="trash" class={css.unlink} onClick={() => setOpen(true)}>
          <Text message="Unlink account" />
        </Button>
      </Popover>
    </Section>
  );
}
