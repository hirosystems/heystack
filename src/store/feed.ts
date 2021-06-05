import { atom } from 'jotai';
import { contentTransactionsAtom, Heystack } from '@store/hey';
import { atomWithDefault } from 'jotai/utils';

export const composeHeystackAom = atom('');
export const attachmentUriAtom = atom('');

export const feedItemsAtom = atomWithDefault<Record<string, Heystack>>(get => {
  const feed: Record<string, Heystack> = {};
  const data = get(contentTransactionsAtom);
  data.forEach(item => {
    feed[item.id] = item;
  });
  return feed;
});
