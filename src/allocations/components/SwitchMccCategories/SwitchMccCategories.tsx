import { createMemo } from 'solid-js';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { SwitchGroupBox, SwitchGroupBoxItem } from 'app/components/SwitchGroupBox';
import type { MccGroup } from 'generated/capital';

type Item = Omit<SwitchGroupBoxItem, 'key'>;

// TODO: Update icons
const CATEGORIES: Readonly<Record<string, Item>> = {
  UT_MCG_CONFG: { icon: 'confirm', name: i18n.t('Utilities') },
  RS_MCG_CONFG: { icon: 'confirm', name: i18n.t('Retail Stores') },
  AV_MCG_CONFG: { icon: 'confirm', name: i18n.t('Automobiles and Vehicles') },
  MS_MCG_CONFG: { icon: 'confirm', name: i18n.t('Miscellaneous Stores') },
  SP_MCG_CONFG: { icon: 'confirm', name: i18n.t('Service Providers') },
  PS_MCG_CONFG: { icon: 'confirm', name: i18n.t('Personal Service Providers') },
  BS_MCG_CONFG: { icon: 'confirm', name: i18n.t('Business') },
  RR_MCG_CONFG: { icon: 'confirm', name: i18n.t('Repair') },
  AE_MCG_CONFG: { icon: 'confirm', name: i18n.t('Amusement and Entertainment') },
  SM_MCG_CONFG: { icon: 'confirm', name: i18n.t('Professional Services and Membership Organizations') },
  GS_MCG_CONFG: { icon: 'confirm', name: i18n.t('Government') },
  CR_MCG_CONFG: { icon: 'confirm', name: i18n.t('Clothing Stores') },
  CS_MCG_CONFG: { icon: 'confirm', name: i18n.t('Contracted') },
  AL_MCG_CONFG: { icon: 'confirm', name: i18n.t('Airlines') },
  AR_MCG_CONFG: { icon: 'confirm', name: i18n.t('Auto Rentals') },
  HM_MCG_CONFG: { icon: 'confirm', name: i18n.t('Hotels and Motels') },
  TT_MCG_CONFG: { icon: 'confirm', name: i18n.t('Transportation') },
  TE_MCG_CONFG: { icon: 'confirm', name: i18n.t('Travel and Entertainment') },
  MSL_MCG_CONFG: { icon: 'confirm', name: i18n.t('Miscellaneous') },
  WS_MCG_CONFG: { icon: 'confirm', name: i18n.t('Wholesale Distributors and Manufacturers') },
  OP_MCG_CONFG: { icon: 'confirm', name: i18n.t('Mail / Phone Order Providers') },
  DG_MCG_CONFG: { icon: 'confirm', name: i18n.t('Digital Goods / Media') },
  RES_MCG_CONFG: { icon: 'confirm', name: i18n.t('Restaurants') },
  GAS_MCG_CONFG: { icon: 'confirm', name: i18n.t('Gas Stations') },
  EDU_MCG_CONFG: { icon: 'confirm', name: i18n.t('Education') },
};

interface SwitchMccCategoriesProps {
  value: readonly string[];
  items: readonly Readonly<MccGroup>[];
  class?: string;
  onChange: (value: string[]) => void;
}

export function SwitchMccCategories(props: Readonly<SwitchMccCategoriesProps>) {
  const items = createMemo(() =>
    props.items.map((item) => ({
      key: item.mccGroupId!,
      ...(CATEGORIES[item.i2cMccGroupRef!] || ({ icon: 'user', name: item.name! } as Item)),
    })),
  );

  return (
    <SwitchGroupBox
      name="mcc-categories"
      value={props.value}
      allTitle={<Text message="All categories" />}
      items={items()}
      class={props.class}
      onChange={props.onChange}
    />
  );
}
