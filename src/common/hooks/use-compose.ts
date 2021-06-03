import React from 'react';
import { useAtom } from 'jotai';
import { composeHeystackAom } from '@store/feed';

export function useCompose() {
  const [value, setValue] = useAtom(composeHeystackAom);

  const handleUpdate = (event: React.FormEvent<HTMLInputElement>) => {
    const update = event.currentTarget.value;
    if (update.length < 140) {
      void setValue(event.currentTarget.value);
    }
  };

  const handleReset = () => setValue('');

  return {
    value,
    handleUpdate,
    handleReset,
  };
}
