import { createUniqueId, JSXElement, createMemo, Index } from 'solid-js';

import { join } from '_common/utils/join';

import css from './Accordion.css';

interface AccordionProps {
  items?: { title: JSXElement; content: JSXElement }[];
  multiple?: boolean;
  preventSelfClose?: boolean;
  class?: string;
}
export const Accordion = (props: AccordionProps) => {
  const id = createUniqueId();
  const items = createMemo(() => props.items);

  return (
    <div class={join(css.tabs, props.class)}>
      <Index each={items()}>
        {(item, idx) => (
          <div class={css.tab}>
            <input
              class={css.input}
              type={props.multiple ? 'checkbox' : 'radio'}
              id={`${id}-${idx}`}
              name={`accordion-${id}`}
            />
            <label
              class={css.tabLabel}
              for={`${id}-${idx}`}
              onClick={() => {
                if (!props.preventSelfClose && !props.multiple) {
                  const target = document.querySelector(`#${id}-${idx}:checked`) as HTMLInputElement | null;
                  if (target) {
                    // Needs a tick to work
                    setTimeout(() => {
                      target.checked = false;
                    });
                  }
                }
              }}
            >
              {item().title}
            </label>
            <div class={css.tabContent}>{item().content}</div>
          </div>
        )}
      </Index>
    </div>
  );
};
