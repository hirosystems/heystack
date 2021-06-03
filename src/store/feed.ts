import { atom } from 'jotai';
import { feed } from '@common/feed';
import { atomWithDefault } from 'jotai/utils';

export const composeHeystackAom = atom('');

export const feedAtom = atomWithDefault(async () => {
  // TODO: replace with real fetching async logic
  await new Promise(resolve => setTimeout(resolve, 2500));
  return feed;
});
