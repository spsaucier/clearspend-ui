import { createSignal, For, Show } from 'solid-js';

import { useMessages } from 'app/containers/Messages/context';
import { FormItem } from '_common/components/Form';
import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';
import { Section } from 'app/components/Section';
import type { ExceptionData } from 'onboarding/types';

import type { KycDocuments, RequiredDocument } from './types';

import { FileUploader } from '.';

import css from './SoftFail.css';

export interface SoftFailProps {
  kybRequiredDocuments: readonly Readonly<RequiredDocument>[] | undefined;
  kycRequiredDocuments: readonly Readonly<KycDocuments>[] | undefined;
  onNext: (data: Readonly<FormData>) => Promise<unknown>;
}

export function SoftFail(props: Readonly<SoftFailProps>) {
  const [submitDisplay, setSubmitDisplay] = createSignal<boolean>();
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, next] = wrapAction(props.onNext);

  let formElement: HTMLFormElement;

  const handleOnChangeInput = () => {
    let t = formElement.getElementsByTagName('input');
    let displaySubmit = true;
    for (let f in t) {
      if (t.hasOwnProperty(f)) {
        let inputElement: HTMLInputElement = t[f] as HTMLInputElement;
        let fileList: FileList | null = inputElement.files;
        if (fileList && fileList.length === 0) {
          displaySubmit = false;
        }
      }
    }
    if (displaySubmit) {
      setSubmitDisplay(true);
    }
  };

  const onSubmit = (e: Event) => {
    e.preventDefault();
    let fo = new FormData();

    let t = formElement.getElementsByTagName('input');
    for (let f in t) {
      if (t.hasOwnProperty(f)) {
        let inputElement: HTMLInputElement = t[f] as HTMLInputElement;
        let fileList: FileList | null = inputElement.files;
        if (fileList && fileList.length > 0) fo.append('documentList', fileList[0] as File, inputElement.name);
      }
    }

    next(fo).catch((exception: ExceptionData) => {
      let message =
        exception.data.message.split('default message')[exception.data.message.split('default message').length - 1];
      messages.error({ title: 'Something went wrong.', message: 'this ' + message });
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      ref={(el) => {
        formElement = el;
      }}
    >
      <Show when={props.kybRequiredDocuments && props.kybRequiredDocuments!.length > 0}>
        <Section
          title="Business documents"
          description="In order to verify your business, please upload the following documents."
          class={css.section}
        >
          <div class={css.wrapper}>
            <For each={props.kybRequiredDocuments}>
              {(document) => (
                <FormItem label={document.documentName.toString()} /*error={errors().name}*/>
                  <FileUploader
                    onChangeInput={() => handleOnChangeInput()}
                    documentName={document.documentName}
                    type={document.type}
                    entityTokenId={document.entityTokenId}
                  />
                </FormItem>
              )}
            </For>
          </div>
        </Section>
      </Show>
      <Show when={props.kycRequiredDocuments && props.kycRequiredDocuments!.length > 0}>
        <Section
          title="Individual documents"
          description="In order to verify your identities of your leadership, please upload the following documents."
          class={css.section}
        >
          <For each={props.kycRequiredDocuments}>
            {(kycOwnerDocuments) => (
              <div class={css.wrapper}>
                <For each={kycOwnerDocuments.documents}>
                  {(document) => (
                    <FormItem
                      label={
                        document.documentName.toString() + ' for ' + kycOwnerDocuments.owner.toString()
                      } /*error={errors().line2}*/
                    >
                      <FileUploader
                        onChangeInput={() => handleOnChangeInput()}
                        documentName={document.documentName}
                        type={document.type}
                        entityTokenId={document.entityTokenId}
                      />
                    </FormItem>
                  )}
                </For>
              </div>
            )}
          </For>
        </Section>
      </Show>
      <Section title="" class={css.section}>
        <Button type="primary" htmlType="submit" wide={media.small} disabled={!submitDisplay()} loading={loading()}>
          Next
        </Button>
      </Section>
    </form>
  );
}
