import { createSignal, type JSXElement } from 'solid-js';

import css from './FilesDropArea.css';

interface FilesDropAreaProps {
  types?: readonly string[];
  dropText: JSXElement;
  onDrop: (files: readonly File[]) => void;
  children: JSXElement;
}

export function FilesDropArea(props: Readonly<FilesDropAreaProps>) {
  const [active, setActive] = createSignal(false);

  const onDrag = (event: DragEvent) => {
    event.preventDefault();
    setActive(Boolean(event.dataTransfer?.types.includes('Files')));
  };

  const onLeave = (event: DragEvent) => {
    event.preventDefault();
    setActive(false);
  };

  const onDrop = (event: DragEvent) => {
    onLeave(event);
    const files = Array.from(event.dataTransfer?.files || []);
    props.onDrop(props.types ? files.filter((file) => props.types?.includes(file.type)) : files);
  };

  return (
    <div
      class={css.root}
      data-active={active()}
      onDragEnter={onDrag}
      onDragOver={onDrag}
      onDragLeave={onLeave}
      onDrop={onDrop}
    >
      <div class={css.children}>{props.children}</div>
      <div class={css.dropText}>{props.dropText}</div>
    </div>
  );
}
