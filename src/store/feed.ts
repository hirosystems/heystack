import { atom } from 'jotai';
import { Heystack } from '@store/hey';

export const composeHeystackAom = atom('');
export const attachmentUriAtom = atom('');

export const feedItemsAtom = atom<Record<string, Heystack>>({});
