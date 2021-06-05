import React, { useCallback } from 'react';
import { useAtom } from 'jotai';
import { composeHeystackAom } from '@store/feed';
import { useToggle } from '@hooks/use-boolean';
import { gihpyQueryAtom } from '@store/giphy';
import { useAttachment } from '@hooks/use-attachment';

export function useCompose() {
  const { toggle: giphyIsShowing } = useToggle('GIF_RESULTS');
  const { resetAttachment } = useAttachment();
  const [value, setValue] = useAtom(composeHeystackAom);
  const [giphyValue, setGiphyValue] = useAtom<string, string>(gihpyQueryAtom);

  const handleUpdate = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const update = event.currentTarget.value;
      if (giphyIsShowing) {
        void setGiphyValue(event.currentTarget.value);
        return;
      }
      if (update.length < 140) {
        void setValue(event.currentTarget.value);
      }
    },
    [setGiphyValue, setValue, giphyIsShowing]
  );

  const handleReset = () => {
    void setGiphyValue('');
    void resetAttachment();
    void setValue('');
  };

  return {
    value: giphyIsShowing ? giphyValue : value,
    handleUpdate,
    handleReset,
  };
}
