import alloy from '@alloyidentity/web-sdk/dist';

import { Button } from '_common/components/Button';

export interface AlloyUploaderProps {
  documentName: String;
  documentType: String;
  entityToken: String;
}

interface AlloyInterface {
  init: Function;
  open: Function;
  close: Function;
}

export function AlloyUploader(props: Readonly<AlloyUploaderProps>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let alloyI: AlloyInterface = alloy;

  // Callback
  const callback = (data: () => void) => {
    console.log(data); /* eslint-disable-line no-console */
  };

  const onOpen = (event: Event) => {
    let doc = [props.documentType];
    const alloyInitParams = {
      key: '91ce2e11-d6e3-4d74-9b6a-4538f8201513',
      entityToken: props.entityToken,
      documents: doc,
      selfie: true,
      color: { primary: '#5bea83', secondary: '#5bea83' },
      // forceMobile: true
    };
    alloyI.init(alloyInitParams);
    // @ts-ignore: Object is possibly 'null'.
    alloyI.open(callback, event.target.value);
  };

  return <Button onClick={() => onOpen(event as Event)}>{'By mobile'}</Button>;
}
