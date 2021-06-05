import { atom } from 'jotai';
import { contentTransactionsAtom, Heystack } from '@store/hey';
import { atomWithDefault } from 'jotai/utils';

export const composeHeystackAom = atom('');
export const attachmentUriAtom = atom('');

export const feedItemsAtom = atom<Record<string, Heystack>>({});
