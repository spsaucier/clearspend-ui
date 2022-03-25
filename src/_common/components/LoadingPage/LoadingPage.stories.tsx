import { Modal } from '../Modal';

import { LoadingPage } from './LoadingPage';

export default {
  title: 'Onboarding/LoadingPage',
  component: LoadingPage,
};

export const Default = () => (
  <Modal isOpen={true}>
    <LoadingPage />
  </Modal>
);
