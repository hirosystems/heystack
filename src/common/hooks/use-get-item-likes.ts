import { useAtomValue } from 'jotai/utils';
import { itemLikesAtom } from '@store/hey';

export function useGetItemLikes(index: number) {
  return useAtomValue(itemLikesAtom(index));
}
