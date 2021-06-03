import { Box, BoxProps } from '@stacks/ui';
import BoringAvatar from 'boring-avatars';
import React from 'react';

export const Avatar = (props: { name: string } & BoxProps) => (
  <Box
    as={BoringAvatar}
    colors={[
      '#5546FF',
      '#7A40EE',
      '#AB26C7',
      '#E24486',
      '#FB6B41',
      '#F7B70F',
      '#6EE9E4',
      '#427EF2',
    ]}
    variant="beam"
    {...props}
  />
);
