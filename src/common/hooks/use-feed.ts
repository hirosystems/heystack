import { contentTransactionsAtom } from '@store/hey';
import { useAtomValue } from 'jotai/utils';
import { useMemo } from 'react';

export function useFeed() {
  const feed = useAtomValue(contentTransactionsAtom);

  return useMemo(() => feed, [feed]);
}
