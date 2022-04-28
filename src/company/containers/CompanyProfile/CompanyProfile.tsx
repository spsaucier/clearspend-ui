import { Text } from 'solid-i18n';
import { createMemo } from 'solid-js';

import { formatPhone } from '_common/formatters/phone';
import { formatAddress } from '_common/formatters/address';
import { Section } from 'app/components/Section';
import { DataRow } from 'app/components/DataRow';
import { CopyButton } from 'app/components/CopyButton';
import { BUSINESS_MCC } from 'app/types/mcc';
import { BusinessTypeI18n } from 'app/types/businesses';
import { LeadershipTable } from 'onboarding/components/LeadershipTable';
import { useBusiness } from 'app/containers/Main/context';
import { useResource } from '_common/utils/useResource';
import { listBusinessOwners } from 'onboarding/services/onboarding';
import { join } from '_common/utils/join';

import css from './CompanyProfile.css';

export function CompanyProfile() {
  const { business, currentUser } = useBusiness();
  const [ownersList] = useResource(listBusinessOwners, []);
  const leaders = createMemo(() => {
    const value = ownersList() ?? [];
    return value;
  });
  const mccValue = BUSINESS_MCC.find((category) => category.value === business().mcc);

  return (
    <div>
      <Section title={<Text message="Business details" />} class={css.section}>
        <DataRow icon="company" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Legal entity name" />:
          </span>
          <span class={css.dataValue}>{business().legalName}</span>
          <CopyButton value={business().legalName!} class={css.copy} />
        </DataRow>
        <DataRow icon="file-text" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Legal entity type" />:
          </span>
          <span class={css.dataValue}>{BusinessTypeI18n[business().businessType!]}</span>
          <CopyButton value={business().businessType!} class={css.copy} />
        </DataRow>
        <DataRow icon="payment-bank" class={css.data}>
          <span class={join(css.dataLabel, 'fs-mask')}>
            <Text message="Business EIN" />:
          </span>
          <span class={css.dataValue}>{business().employerIdentificationNumber}</span>
          <CopyButton value={business().employerIdentificationNumber!} class={css.copy} />
        </DataRow>
        <DataRow icon="channel-moto" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Corporate phone number" />:
          </span>
          <span class={join(css.dataValue, 'fs-mask')}>{formatPhone(business().businessPhone)}</span>
          <CopyButton value={formatPhone(business().businessPhone)} class={css.copy} />
        </DataRow>
      </Section>
      <Section title={<Text message="Business description" />} class={css.section}>
        <DataRow icon="file-text" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Brief description" />:
          </span>
          <span class={css.dataValue}>{business().description}</span>
        </DataRow>
        <DataRow icon="merchant-services" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Merchant category" />:
          </span>
          <span class={css.dataValue}>{`${mccValue?.name} (${mccValue?.value})`}</span>
        </DataRow>
      </Section>
      <Section
        title={<Text message="Business address" />}
        description={
          <Text
            message={
              "Please enter the address for your company's main office. " +
              'PO Boxes and virtual addresses are not allowed. ' +
              'This address will be used as the billing address for all cards issued to your employees.'
            }
          />
        }
        class={css.section}
      >
        <DataRow icon="pin" class={css.data} contentClass={css.address}>
          {formatAddress(business().address!)}
        </DataRow>
      </Section>
      <Section title={<Text message="Leadership" />} class={css.section}>
        <LeadershipTable business={business()} currentUserEmail={currentUser().email} leaders={leaders()} />
      </Section>
    </div>
  );
}
