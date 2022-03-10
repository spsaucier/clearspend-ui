import { createSignal, createEffect, Show } from 'solid-js';
import * as pdfLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min';

import css from './PdfView.css';

pdfLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface PdfViewProps {
  uri: string;
}

export default function PdfView(props: Readonly<PdfViewProps>) {
  let canvas!: HTMLCanvasElement;
  const [error, setError] = createSignal<string>();

  createEffect(() => {
    pdfLib
      .getDocument(props.uri)
      .promise.then((pdf) => {
        return pdf.getPage(1).then((page) => {
          const viewport = page.getViewport({ scale: 1.0 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          setError(undefined);
          return page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
        });
      })
      .catch((reason: string) => {
        setError(reason);
      });
  });

  return (
    <>
      <canvas ref={canvas} class={css.root} width="0" height="0" />
      <Show when={error()}>{error()}</Show>
    </>
  );
}
