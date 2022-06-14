import { createSignal } from 'solid-js';

import { Accordion } from './Accordion';

export default {
  title: 'Common/Accordion',
  component: Accordion,
};

export const Default = () => {
  const [items, setItems] = createSignal([
    {
      title: 'Title 1',
      content: 'Here is my content',
    },
    {
      title: 'Title 2',
      content: 'Here is my content 2',
    },
  ]);
  return (
    <>
      <button
        onClick={() =>
          setItems((i) => [
            ...i,
            {
              title: `Title ${i.length + 1}`,
              content: `Here is my content ${i.length + 1}`,
            },
          ])
        }
      >
        Add row
      </button>
      <button onClick={() => setItems((i) => i.splice(0, i.length - 1))}>Remove row</button>
      <Accordion items={items()} />
    </>
  );
};
