import { contentTransactionsAtom, Heystack } from '@store/hey';
import { useAtomValue } from 'jotai/utils';
import { useEffect } from 'react';
import { feedItemsAtom } from '@store/feed';
import { useImmerAtom } from 'jotai/immer';

export function useFeed() {
  const apiData = useAtomValue(contentTransactionsAtom);
  const [feed, setFeed] = useImmerAtom<Record<string, Heystack>>(feedItemsAtom);

  // this effect is to update our feed view without causing un-needed re-renders
  // @see https://docs.pmnd.rs/jotai/integrations/immer for immer docs
  useEffect(() => {
    // find our new items that have yet to be added
    const newItems = apiData.filter(item => !feed[item.id]);

    if (newItems?.length) {
      // mutate state with new items
      void setFeed(draft => {
        newItems.forEach(item => {
          draft[item.id] = item;
        });
      });
    }

    // this updates as items confirm
    const itemsNoLongerPending = apiData.filter(item => !item.isPending);

    // this is static unless we update it
    const feedItemsPending = Object.values(feed).filter(item => item.isPending);

    // for each item that is no longer pending
    itemsNoLongerPending.forEach(item => {
      // if we find it in currently pending items
      if (feedItemsPending.find(_item => item.id === _item.id)) {
        // update just this one
        setFeed(draft => {
          draft[item.id] = {
            ...item,
            timestamp: draft[item.id].timestamp, // to prevent layout shift, if a user refreshes it will use the confirmed time
          };
        });
      }
    });
  }, [apiData, feed, setFeed]);

  return Object.values(feed);
}
