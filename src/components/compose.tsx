import React, { useCallback } from 'react';
import { Fade, Box, Stack } from '@stacks/ui';
import { border } from '@common/utils';
import { useCompose } from '@hooks/use-compose';
import { Button } from '@components/button';
import { useHandlePublishContent } from '@hooks/use-publish-hey';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';
import Textarea from 'react-textarea-autosize';

export const Compose = () => {
  const { value, handleUpdate, handleReset } = useCompose();
  const handlePublishContent = useHandlePublishContent();
  const { isLoading } = useLoading(LOADING_KEYS.SEND_HEY);
  const handleSubmit = useCallback(() => {
    handlePublishContent(value, () => {
      void handleReset();
    });
  }, [handlePublishContent, value, handleReset]);

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );
  return (
    <Stack
      isInline
      border={border()}
      p="loose"
      alignItems="center"
      borderRadius="24px"
      as="form"
      onSubmit={onSubmit}
      mx="auto"
      position="relative"
      width="600px"
    >
      <Box
        onChange={handleUpdate}
        value={value}
        as={Textarea}
        resize="none"
        border={0}
        outline={0}
        placeholder="Say hey to other Stackers"
        width="100%"
        pr="70px"
      />
      <Fade in={value !== ''}>
        {styles => (
          <Button position="absolute" right="loose" isLoading={isLoading} style={styles}>
            Send
          </Button>
        )}
      </Fade>
    </Stack>
  );
};
