import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';
import { useParams } from 'solid-app-router';

import { useNav, useLoc } from '_common/api/router';
import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { InputCode } from '_common/components/InputCode';
import { useMessages } from 'app/containers/Messages/context';
import { Page, PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import { activateCard } from '../../services';

import css from './CardActivate.css';

interface FormValues {
  code: string;
}

export default function CardActivate() {
  const i18n = useI18n();
  const messages = useMessages();
  const navigate = useNav();
  const location = useLoc();

  const params = useParams<{ id: string }>();

  const { values, errors, handlers, isDirty, setErrors, reset, trigger } = createForm<FormValues>({
    defaultValues: { code: '' },
    rules: {
      code: [(value: string): boolean | string => /^\d{4}$/.test(value) || String(i18n.t('Inappropriate value'))],
    },
  });

  const onSubmit = async () => {
    if (!params.id || hasErrors(trigger())) return;

    await activateCard(params.id, values().code)
      .then(() => {
        sendAnalyticsEvent({ name: Events.ACTIVATE_CARD });
        messages.success({
          title: i18n.t('Card activated'),
          message: i18n.t('Your card has been successfully activated.'),
        });
        navigate(location.state?.prev || `/cards/view/${params.id}`);
      })
      .catch(() => {
        setErrors({ code: String(i18n.t('Inappropriate value')) });
        messages.error({
          title: i18n.t('Card not activated'),
          message: i18n.t('We could not find a card that matches this number or user. Please try the number again.'),
        });
      });
  };

  return (
    <Page title={<Text message="Activate card" />}>
      <Form>
        <Section
          title={<Text message="Card number" />}
          description={
            <Text message="Enter the last 4 digits of the 16-digit card number printed on the back of your card." />
          }
        >
          <FormItem label={<Text message="Last 4 digits" />} error={errors().code}>
            <InputCode
              name="code"
              codeLength={4}
              value={values().code}
              error={Boolean(errors().code)}
              class={css.code}
              onChange={handlers.code}
            />
          </FormItem>
        </Section>
        <Show when={isDirty()}>
          <PageActions action={<Text message="Activate Card" />} onCancel={() => reset()} onSave={onSubmit} />
        </Show>
      </Form>
    </Page>
  );
}
