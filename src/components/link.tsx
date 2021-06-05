import React from 'react';
import { Text, Box, BoxProps } from '@stacks/ui';

export const buildEnterKeyEvent = (onClick: () => void) => {
  return (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && onClick) {
      onClick();
    }
  };
};

export const Link: React.FC<BoxProps> = ({
  _hover = {},
  children,
  fontSize = '12px',
  textStyle = 'caption.medium',
  onClick,
  ...rest
}) => (
  <Box {...rest} onKeyPress={buildEnterKeyEvent(onClick as any)} onClick={onClick} tabIndex={0}>
    <Text
      _hover={{ textDecoration: 'underline', cursor: 'pointer', ..._hover }}
      fontSize={fontSize}
      textStyle={textStyle}
    >
      {children}
    </Text>
  </Box>
);
