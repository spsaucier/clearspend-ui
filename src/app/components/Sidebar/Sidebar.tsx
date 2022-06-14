import { createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';

import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { useBool } from '_common/utils/useBool';
import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import fullLogo from 'app/assets/Tagline_Lockup_White.svg';
import smallLogo from 'app/assets/logo.svg';

import { MainMenu } from '../MainMenu';

import css from './Sidebar.css';

export const MENU_EXPANDED_KEY = 'menu_expanded';

export function Sidebar() {
  const media = useMediaContext();
  const [menuOpen, toggleMenu] = useBool();

  const [expand, setExpand] = createSignal(storage.get<boolean>(MENU_EXPANDED_KEY, false));

  const onChangeExpand = () => {
    setExpand((prev) => {
      storage.set(MENU_EXPANDED_KEY, !prev);
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
        <Button
          view="ghost"
          icon={menuOpen() ? 'cancel' : 'more-vertical'}
          class={css.menuButton}
          onClick={toggleMenu}
        />
        <Show when={menuOpen()}>
          <Portal>
            <div class={css.menuMask} onClick={toggleMenu} />
            <MainMenu view="mobile" class={css.menuPopup} onItemClick={toggleMenu} />
          </Portal>
        </Show>
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
