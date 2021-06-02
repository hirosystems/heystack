import { color, ColorsStringLiteral } from '@stacks/ui';
import { Property } from 'csstype';

export const border = (
  _color: ColorsStringLiteral = 'border',
  width = 1,
  style: Property.BorderStyle = 'solid'
): string => `${width}px ${style as string} ${color(_color)}`;
