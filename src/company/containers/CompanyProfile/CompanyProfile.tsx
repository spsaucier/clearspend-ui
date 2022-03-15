import { Text } from 'solid-i18n';

import { formatPhone } from '_common/formatters/phone';
import { formatAddress } from '_common/formatters/address';
import { Section } from 'app/components/Section';
import { DataRow } from 'app/components/DataRow';
import { CopyButton } from 'app/components/CopyButton';
import type { Business } from 'generated/capital';
import { BUSINESS_MCC } from 'app/types/mcc';

import css from './CompanyProfile.css';

interface CompanyProfileProps {
  data: Readonly<Business>;
}

export function CompanyProfile(props: Readonly<CompanyProfileProps>) {
  const mccValue = BUSINESS_MCC.find((category) => category.value === props.data.mcc);

  return (
    <div>
      <Section title={<Text message="Business details" />} class={css.section}>
        <DataRow icon="company" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Legal entity name" />:
          </span>
          <span class={css.dataValue}>{props.data.legalName}</span>
          <CopyButton value={props.data.legalName!} class={css.copy} />
        </DataRow>
        <DataRow icon="file-text" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Legal entity type" />:
          </span>
          <span class={css.dataValue}>{props.data.businessType}</span>
          <CopyButton value={props.data.businessType!} class={css.copy} />
        </DataRow>
        <DataRow icon="payment-bank" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Business EIN" />:
          </span>
          <span class={css.dataValue}>{props.data.employerIdentificationNumber}</span>
          <CopyButton value={props.data.employerIdentificationNumber!} class={css.copy} />
        </DataRow>
        <DataRow icon="channel-moto" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Corporate phone number" />:
          </span>
          <span class={css.dataValue}>{formatPhone(props.data.businessPhone)}</span>
          <CopyButton value={formatPhone(props.data.businessPhone)} class={css.copy} />
        </DataRow>
      </Section>
      <Section title={<Text message="Business description" />} class={css.section}>
        <DataRow icon="file-text" class={css.data}>
          <span class={css.dataLabel}>
            <Text message="Brief description" />:
          </span>
          <span class={css.dataValue}>{props.data.description}</span>
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
          {formatAddress(props.data.address!)}
        </DataRow>
      </Section>
    </div>
  );
}
