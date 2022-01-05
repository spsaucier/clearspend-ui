import { AddressView, AddressViewProps } from './AddressView';

export default {
  title: 'Common/AddressView',
  component: AddressView,
  args: {
    icon: 'company',
    label: 'Business',
    address: {
      streetLine1: '2380 N Creek Vista Dr',
      streetLine2: '',
      locality: 'Tucson',
      region: 'Arizona',
      postalCode: '85749',
      country: 'USA',
    },
  },
};

export const Default = (args: AddressViewProps) => <AddressView {...args} />;
