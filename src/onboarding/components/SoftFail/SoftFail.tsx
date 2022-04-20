import { createEffect, createSignal, For, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { useMessages } from 'app/containers/Messages/context';
import { FormItem } from '_common/components/Form';
import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';
import { wrapAction } from '_common/utils/wrapAction';
import { Section } from 'app/components/Section';
import type { ExceptionData } from 'onboarding/types';

import { FileUploader } from './FileUploader';
import type { KycDocuments, RequiredDocument } from './types';

import css from './SoftFail.css';

export interface SoftFailProps {
  kybRequiredDocuments: readonly Readonly<RequiredDocument>[] | undefined;
  kycRequiredDocuments: readonly Readonly<KycDocuments>[] | undefined;
  onNext: (data: Readonly<FormData>) => Promise<unknown>;
  setLoadingModalOpen: (open: boolean) => void;
}

export function SoftFail(props: Readonly<SoftFailProps>) {
  const [submitDisplay, setSubmitDisplay] = createSignal<boolean>();
  const media = useMediaContext();
  const messages = useMessages();
  const [loading, next] = wrapAction(props.onNext);

  createEffect(() => {
    props.setLoadingModalOpen(loading());
  });

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
    const formData = new FormData();

    const fileInputs = formElement.getElementsByTagName('input');
    for (const file in fileInputs) {
      if (fileInputs.hasOwnProperty(file)) {
        const inputElement: HTMLInputElement = fileInputs[file] as HTMLInputElement;
        const fileList: FileList | null = inputElement.files;
        if (fileList && fileList.length > 0) {
          formData.append('documentList', fileList[0] as File, `${inputElement.name}${fileList[0]?.name}`);
        }
      }
    }
    next(formData).catch((exception: ExceptionData) => {
      messages.error({ title: 'Something went wrong.', message: exception.data.message });
    });
  };

  const requirementsLoaded = () =>
    (props.kycRequiredDocuments && props.kycRequiredDocuments!.length > 0) ||
    (props.kybRequiredDocuments && props.kybRequiredDocuments!.length > 0);

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
      <Show when={!requirementsLoaded()}>
        <div class={css.section}>
          <Text message="Requirements are still pending verification." />
        </div>
        <Button type="primary" htmlType="submit" wide={media.small} disabled={requirementsLoaded()} loading={loading()}>
          Check again
        </Button>
      </Show>
      <Show when={requirementsLoaded()}>
        <Section title="" class={css.section}>
          <Button type="primary" htmlType="submit" wide={media.small} disabled={!submitDisplay()} loading={loading()}>
            Next
          </Button>
        </Section>
      </Show>
    </form>
  );
}
