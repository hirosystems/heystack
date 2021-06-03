import React from 'react';
import { Button as _Button, ButtonProps } from '@stacks/ui';

export const Button = (props: ButtonProps) => (
  <_Button
    css={{
      '& > div > div': {
        borderStyle: 'solid',
      },
    }}
    borderRadius="10px"
    {...props}
  />
);
