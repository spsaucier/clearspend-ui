import { For, JSXElement } from 'solid-js';

import { HeaderButton } from './HeaderButton';

import css from './PartnerHeader.css';

interface PartnerHeaderProps {
  branding: string | JSXElement;
  navigationItems: {
    label: string;
    onClick?: () => void;
    href?: string;
  }[];
  selectedLabel?: string;
}

export function PartnerHeader(props: Readonly<PartnerHeaderProps>) {
  return (
    <>
      <div class={css.wrapper}>
        <div class={css.branding}>{props.branding}</div>
        <div style={{ flex: 1 }} />
        <div>
          <For each={props.navigationItems}>
            {(navItem) => {
              return (
                <HeaderButton
                  isActive={navItem.label === props.selectedLabel}
                  hideIcon={true}
                  type={'primary'}
                  view="ghost"
                  size="sm"
                  onClick={navItem.onClick}
                  href={navItem.href}
                >
                  {navItem.label}
                </HeaderButton>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
}
