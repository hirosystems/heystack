import React from 'react';
import { Fade, Box, Stack } from '@stacks/ui';
import { border } from '@common/utils';
import { useCompose } from '@hooks/use-compose';
import { Button } from '@components/button';
import { useHandlePublishContent } from '@hooks/use-publish-hey';
import { useLoading } from '@hooks/use-loading';
import { LOADING_KEYS } from '@store/ui';

export const Compose = () => {
  const { value, handleUpdate, handleReset } = useCompose();
  const handlePublishContent = useHandlePublishContent();
  const { isLoading } = useLoading(LOADING_KEYS.SEND_HEY);
  return (
    <Stack
      isInline
      border={border()}
      width="100%"
      p="loose"
      alignItems="center"
      borderRadius="24px"
      position="relative"
    >
      <Box
        onChange={handleUpdate}
        value={value}
        as="input"
        border={0}
        outline={0}
        placeholder="Say hey to other Stackers"
        width="100%"
      />
      <Fade in={value !== ''}>
        {styles => (
          <Button
            position="absolute"
            right="loose"
            isLoading={isLoading}
            style={styles}
            onClick={() => {
              handlePublishContent(value, () => {
                void handleReset();
              });
            }}
          >
            Send
          </Button>
        )}
      </Fade>
    </Stack>
  );
};
