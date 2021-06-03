import { contentTransactionsAtom } from '@store/hey';
import { useAtomValue } from 'jotai/utils';

export function useFeed() {
  const feed = useAtomValue(contentTransactionsAtom);

  return feed;
}
