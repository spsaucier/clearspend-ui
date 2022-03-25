import { Text } from 'solid-i18n';
import { For, onCleanup, onMount } from 'solid-js';

import { join } from '_common/utils/join';

import css from './RotatingText.css';

const RAND = 0.5;
const MS_PER_SLIDE = 3500;

export function RotatingText(props: { class?: string }) {
  const textArr = [
    'Generating witty dialog',
    'The bits are breeding',
    'Checking the gravitational constant in your locale',
    "We're testing your patience",
    'Go ahead and order a sandwich',
    'Our other loading screen is much faster',
    'A Møøse once bit my sister',
    'Hum something loud while others stare',
    'Insert quarter',
    "We're making you a cookie",
    'Computing chance of success',
    "I feel like I'm supposed to be loading something",
    'Not enough minerals',
    "I swear it's almost done",
    'Downloading more RAM',
    'Feel free to spin in your chair',
  ].sort(() => RAND - Math.random());

  onMount(() => {
    const interval = setInterval(function () {
      const show = document.querySelector('[data-show]');
      const next = show?.nextElementSibling || document.querySelector('[data-first]');
      const up = document.querySelector('[data-up]');
      up?.removeAttribute('data-up');
      show?.removeAttribute('data-show');
      show?.setAttribute('data-up', '');
      next?.setAttribute('data-show', '');
    }, MS_PER_SLIDE);
    onCleanup(() => {
      clearInterval(interval);
    });
  });

  return (
    <div class={css.root} data-rotator>
      <div class={join(css.ellipsis, css.slide, props.class)} data-first data-show>
        <Text message="Submitting & verifying your info" />
      </div>
      <For each={textArr}>{(text) => <div class={join(css.ellipsis, css.slide, props.class)}>{text}</div>}</For>
    </div>
  );
}
