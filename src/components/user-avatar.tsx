import React from 'react';
import { BoxProps } from '@stacks/ui';
import { Avatar } from '@components/avatar';
import { useCurrentAddress } from '@hooks/use-current-address';

export const UserAvatar = (props: BoxProps) => {
  const address = useCurrentAddress();
  return <Avatar name={address} size="40px" {...props} />;
};
