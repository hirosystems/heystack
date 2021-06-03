import { useAtom } from 'jotai';
import { feedAtom } from '@store/feed';

export function useFeed() {
  const [feed, setFeed] = useAtom(feedAtom);
  const handleAddItemToFeed = (content: string) =>
    setFeed(s => [
      ...s,
      {
        user: {
          address: 'SP3TMFBG2FSSEHA5Q81ZMVMRB9GK0METVDV7RENRC',
          name: 'j.btc',
        },
        heystack: {
          id: s[s.length - 1].heystack.id + 1,
          content,
          upvotes: 0,
        },
      },
    ]);

  return {
    feed,
    handleAddItemToFeed,
  };
}
