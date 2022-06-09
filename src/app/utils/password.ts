import type { IMessagesContext } from 'app/containers/Messages/context';
import type { PasswordErrors } from 'employees/pages/ChangePassword/ChangePassword';
import { HttpStatus } from '_common/api/fetch/types';
import { i18n } from '_common/api/intl';

export function handlePasswordErrors(errors: PasswordErrors, messagesService: Readonly<IMessagesContext>) {
  if (errors.data?.fieldErrors?.password && errors.data.fieldErrors.password[0]?.code === '[previouslyUsed]password') {
    messagesService.error({
      title: i18n.t('Unable to update password'),
      message: i18n.t('You cannot use a previously used password'),
    });
  } else {
    messagesService.error({
      title: i18n.t('Failed to update password'),
      message:
        errors.status === HttpStatus.NotFound
          ? i18n.t('Are you sure you entered the correct password?')
          : errors.data?.fieldErrors?.password
          ? errors.data.fieldErrors.password[0]?.message
          : '',
    });
  }
  // eslint-disable-next-line no-console
  console.error(errors);
  throw new Error(JSON.stringify(errors));
}
