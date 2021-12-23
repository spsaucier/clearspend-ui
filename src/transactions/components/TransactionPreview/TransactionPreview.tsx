import { useNavigate } from 'solid-app-router';

import { DateTime } from 'solid-i18n';
import type { AccountActivityResponse } from 'generated/capital';
import { DateFormat } from '_common/api/intl/types';
import css from './TransactionPreview.css';

import smallLogo from 'app/assets/logo.svg';
import { Icon } from '_common/components/Icon/Icon';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import { formatName } from 'employees/utils/formatName';

interface TransactionPreviewProps {
  transaction: AccountActivityResponse;
}

const getTransactionStatusDetailMsg = (status?: 'PENDING' | 'DECLINED' | 'APPROVED' | 'PROCESSED') => {
  switch (status) {
    // TODO: these do not match figma, need UX/Product guidance
    case 'PENDING':
      return '';
    case 'DECLINED':
      return 'ATM is disabled';
    case 'PROCESSED':
      return '';
    case 'APPROVED':
      return 'Payment has been authorized';
    default:
      return 'Unknown';
  }
};

export function TransactionPreview(props: Readonly<TransactionPreviewProps>) {
  const navigate = useNavigate();
  const transaction = props.transaction;
  const displayAmount = formatCurrency(transaction.amount?.amount || 0);

  return (
    <div>
      <div class={css.status}>
        <span class={css.icon}>
          <Icon name="approved-status" />
        </span>
        {transaction.status?.toLocaleLowerCase()}
        <span class={css.statusMsg}>{getTransactionStatusDetailMsg(transaction.status)}</span>
      </div>
      <div class={css.summary}>
        <img src={transaction.merchant?.merchantLogoUrl ?? smallLogo} alt="Merchant logo" class={css.merchantLogo} />
        <div class={css.amount}>{displayAmount}</div>
        <div class={css.merchant}>
          {transaction.merchant?.name}
          <span>&#8226;</span>
          {transaction.merchant?.type}
        </div>
        <div class={css.date}>
          <DateWithDateTime activityTime={transaction.activityTime!} />
        </div>
        <div class={css.receiptCta}>
          <Button view={'default'} wide={true} icon="add-receipt">
            Add Receipt
          </Button>
        </div>
      </div>
      {/* TODO: Missing comment section. API exists? */}
      <div>
        <div>
          <div class={css.title}>Card</div>
          <div>
            <div class={css.card} onClick={() => navigate(`/cards/view/${transaction.card?.cardId}`)}>
              <div class={css.cardIcon}>
                <Icon name="card" />
              </div>
              <div class={css.cardDetailWrapper}>
                <div class={css.cardNumber}>
                  {transaction.card?.lastFour ? formatCardNumber(transaction.card.lastFour) : '--'}
                </div>
                <div class={css.cardName}>
                  {formatName({
                    firstName: transaction.card!.ownerFirstName!,
                    lastName: transaction.card!.ownerLastName!,
                  })}
                </div>
              </div>
              <Icon name="chevron-right" />
            </div>
          </div>
        </div>
        <div>
          <div class={css.title}>Merchant</div>
          <div class={css.detailRows}>
            <div>Merchant Name</div>
            <div>{transaction.merchant?.name}</div>
            <div>Merchant ID</div>
            <div>{transaction.merchant?.merchantNumber}</div>
            <div>Merchant Category</div>
            <div>{transaction.merchant?.merchantCategoryCode}</div>
          </div>
        </div>
        <div>
          <div class={css.title}>Transaction Details</div>
          <div class={css.detailRows}>
            <div>Posted On</div>
            <div>
              <DateWithDateTime activityTime={transaction.activityTime!} />
            </div>
            <div>Posted Amount</div>
            <div>{displayAmount}</div>
            <div>Location</div>
            <div>
              {/* TODO: Don't have this yet? */}
              --
            </div>
          </div>
        </div>
        <div class={css.reportIssueCta}>
          <Button view={'default'} wide={true} icon={{ name: 'alert', pos: 'right' }}>
            {/* TODO: Need guidance on where this goes */}
            Report an issue
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DateWithDateTime(props: { activityTime: string }) {
  const date = new Date(props.activityTime || '');
  return (
    <>
      <DateTime date={date} />
      <span>&#8226;</span>
      <DateTime date={date} preset={DateFormat.time} />
    </>
  );
}
