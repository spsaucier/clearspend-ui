import { Text } from 'solid-i18n';

import { Description } from 'signup/components/Description';

import css from './Review.css';

interface ReviewDetails {
  ownerEmail: String;
}

export function Review(props: Readonly<ReviewDetails>) {
  return (
    <div class={css.content}>
      <div class={css.header}>We are reviewing documents.</div>
      <Description>
        <Text
          message={
            'Once we finish reviewing your documents, we will email ' +
            props.ownerEmail +
            ' with next steps for completing your application.'
          }
        />
      </Description>
    </div>
  );
}
