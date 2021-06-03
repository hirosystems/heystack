import { Box, BoxProps } from '@stacks/ui';
import Avatar from 'boring-avatars';
import React from 'react';
import { useCurrentAddress } from '@hooks/use-current-address';

export const UserAvatar = (props: BoxProps) => {
  const address = useCurrentAddress();
  return <Box as={Avatar} name={address} variant="beam" size="40px" {...props} />;
};
