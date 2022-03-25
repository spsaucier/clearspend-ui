import { createSignal, Show } from 'solid-js';

import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { useBool } from '_common/utils/useBool';
import { Popover } from '_common/components/Popover';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import smallLogo from 'app/assets/logo.svg';
import fullLogo from 'app/assets/Logo_Tagline_Black.png';

import { MainMenu } from '../MainMenu';

import css from './Sidebar.css';

const VIEW_STORAGE_KEY = 'menu_expanded';

export function Sidebar() {
  const media = useMediaContext();
  const [menuOpen, toggleMenu] = useBool();

  const [expand, setExpand] = createSignal(storage.get<boolean>(VIEW_STORAGE_KEY, false));

  const onChangeExpand = () => {
    setExpand((prev) => {
      storage.set(VIEW_STORAGE_KEY, !prev);
      return !prev;
    });
  };

  return (
    <div class={css.root} classList={{ [css.expanded!]: expand() }}>
      <div class={css.header}>
        <Show when={media.medium} fallback={<img src={fullLogo} alt="Company logo" class={css.logoMobile} />}>
          <Show when={expand()} fallback={<img src={smallLogo} alt="Company logo" class={css.logo} />}>
            <img src={fullLogo} alt="Company logo" class={css.logoExpanded} />
          </Show>
        </Show>
      </div>
      <Show when={media.small}>
        <Popover
          open={menuOpen()}
          position="bottom-right"
          class={css.menuPopup}
          content={<MainMenu view="mobile" onItemClick={toggleMenu} />}
          onClickOutside={toggleMenu}
        >
          <Button view="ghost" icon="more-vertical" class={css.menuButton} onClick={toggleMenu} />
        </Popover>
      </Show>
      <Show when={media.medium}>
        <MainMenu view={expand() ? 'expanded' : 'collapsed'} class={css.sideMenu} />
        <Button view="ghost" class={css.toggle} onClick={onChangeExpand}>
          <Icon name="chevron-right" class={css.toggleIcon} />
        </Button>
      </Show>
    </div>
  );
}
