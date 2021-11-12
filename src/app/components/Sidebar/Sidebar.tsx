import { Show } from 'solid-js';

import { useMediaContext } from '_common/api/media/context';
import { useBool } from '_common/utils/useBool';
import { Popover } from '_common/components/Popover';
import { Button } from '_common/components/Button';

import { MainMenu } from '../MainMenu';

import testLogo from './assets/test.png';
import testSmLogo from './assets/test-sm.png';

import css from './Sidebar.css';

export function Sidebar() {
  const media = useMediaContext();
  const [menuOpen, toggleMenu] = useBool();

  return (
    <div class={css.root}>
      <div class={css.header}>
        <Show when={media.small} fallback={<img src={testLogo} alt="Company logo" class={css.logo} />}>
          <img src={testSmLogo} alt="Company logo" class={css.logo} />
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
