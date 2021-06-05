import React from 'react';
import { useAtom } from 'jotai';
import { attachmentUriAtom, composeHeystackAom } from '@store/feed';
import { useToggle } from '@hooks/use-boolean';
import { gihpyQueryAtom } from '@store/giphy';
import { useUpdateAtom } from 'jotai/utils';

export function useCompose() {
  const { toggle: giphyIsShowing } = useToggle('GIF_RESULTS');

  const setAttachmentUri = useUpdateAtom(attachmentUriAtom);
  const [value, setValue] = useAtom(composeHeystackAom);
  const [giphyValue, setGiphyValue] = useAtom(gihpyQueryAtom);

  const handleUpdate = (event: React.FormEvent<HTMLInputElement>) => {
    const update = event.currentTarget.value;
    if (giphyIsShowing) {
      void setGiphyValue(event.currentTarget.value);
      return;
    }
    if (update.length < 140) {
      void setValue(event.currentTarget.value);
    }
  };

  const handleReset = () => {
    void setGiphyValue('');
    void setAttachmentUri('');
    void setValue('');
  };

  return {
    value: giphyIsShowing ? giphyValue : value,
    handleUpdate,
    handleReset,
  };
}
