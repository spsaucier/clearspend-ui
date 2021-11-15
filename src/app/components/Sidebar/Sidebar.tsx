import { Show } from 'solid-js';

import { useMediaContext } from '_common/api/media/context';
import { useBool } from '_common/utils/useBool';
import { Popover } from '_common/components/Popover';
import { Button } from '_common/components/Button';
import smallLogo from 'app/assets/logo.svg';
import fullLogo from 'app/assets/logo-name.svg';

import { MainMenu } from '../MainMenu';

import css from './Sidebar.css';

export function Sidebar() {
  const media = useMediaContext();
  const [menuOpen, toggleMenu] = useBool();

  return (
    <div class={css.root}>
      <div class={css.header}>
        <Show when={media.small} fallback={<img src={smallLogo} alt="Company logo" class={css.logo} />}>
          <img src={fullLogo} alt="Company logo" class={css.logo} />
        </Show>
      </div>
      <Show when={media.small}>
        <Popover
          open={menuOpen()}
          position="bottom-right"
          class={css.menuPopup}
          content={<MainMenu onItemClick={toggleMenu} />}
          onClickOutside={toggleMenu}
        >
          <Button inverse icon="more-vertical" class={css.menuButton} onClick={toggleMenu} />
        </Popover>
      </Show>
      <Show when={media.medium}>
        <MainMenu />
      </Show>
    </div>
  );
}
