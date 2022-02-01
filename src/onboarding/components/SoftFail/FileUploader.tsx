import { createSignal } from 'solid-js';

import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';

import { AlloyUploader } from './AlloyUploader';
import type { DocumentType } from './types';

import css from './FileUploader.css';

export interface FileUploaderProps {
  documentName: String;
  entityTokenId: String;
  type: DocumentType;
  onChangeInput: () => void;
}

export function FileUploader(props: Readonly<FileUploaderProps>) {
  const [buttonDisplay, setButtonDisplay] = createSignal<Boolean>();
  let hiddenFileInput!: HTMLInputElement;
  let buttonElement!: HTMLButtonElement;
  setButtonDisplay(true);

  const handleClick = () => {
    hiddenFileInput.click();
  };

  const handleChange = () => {
    setButtonDisplay(false);
    props.onChangeInput();
  };

  const handleDeleteFile = () => {
    setButtonDisplay(true);
    hiddenFileInput.value = '';
    hiddenFileInput.files = null;
  };

  return (
    <>
      {buttonDisplay() === true ? (
        <>
          <Button icon="upload" ref={buttonElement} onClick={() => handleClick()} htmlType="button">
            {' '}
            Select file
          </Button>
          <AlloyUploader
            documentName={props.documentName}
            documentType={props.type.toString()}
            entityToken={props.entityTokenId}
          />
        </>
      ) : (
        <div class={css.file}>
          {hiddenFileInput.files![0]?.name}
          <div onclick={() => handleDeleteFile()}>
            <Icon name="trash" class={css.icon}></Icon>
          </div>
        </div>
      )}
      <input
        ref={hiddenFileInput}
        accept="image/*,.pdf"
        name={props.entityTokenId + '|' + props.type + '|' + props.documentName}
        onChange={() => handleChange()}
        type="file"
        style={{ display: 'none' }}
      />
    </>
  );
}
