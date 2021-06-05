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
    // init
    if (Object.keys(feed).length === 0) {
      apiData.forEach(item => {
        setFeed(draft => {
          draft[item.id] = item;
        });
      });
    } else {
      // find our new items that have yet to be added
      const newItems = apiData.filter(item => !feed[item.id] && item.isPending);

      if (newItems?.length) {
        // mutate state with new items
        void setFeed(draft => {
          newItems.forEach(item => {
            if (!draft[item.id]) draft[item.id] = item;
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
              ...draft[item.id],
              index: item.index,
              isPending: false,
            };
          });
        }
      });
    }
  }, [apiData, feed, setFeed]);

  return Object.values(feed);
}
