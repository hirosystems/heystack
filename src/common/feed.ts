export interface FeedItem {
  user: {
    address: string;
    name?: string;
  };
  heystack: {
    id: number;
    content: string;
    upvotes: number;
    uri?: string;
    timestamp?: number;
  };
}

export const feed: FeedItem[] = [
  {
    user: {
      address: 'SP3TMFBG2FSSEHA5Q81ZMVMRB9GK0METVDV7RENRC',
      name: 'j.btc',
    },
    heystack: {
      id: 0,
      content: 'upvote this and give me HEY',
      upvotes: 500,
    },
  },
  {
    user: {
      address: 'SPCTKKK7WHNX7HYKXW15GPNRHVV70DP1J0Z2M4CM',
      name: 'andy.btc',
    },
    heystack: {
      id: 1,
      content: 'wen stx moon ser pls',
      upvotes: 20,
    },
  },
  {
    user: {
      address: 'SP24MGQCNYEMQX33FB5BPM94RG3R972Q87BTM3X98',
      name: 'thomas.btc',
    },
    heystack: {
      id: 2,
      content: 'We discussed generally the trade-offs to showing raw parameter details by default.',
      upvotes: 999,
    },
  },
  {
    user: {
      address: 'SPCTKKK7WHNX7HYKXW15GPNRHVV70DP1J0Z2M4CM',
      name: 'mark.btc',
    },
    heystack: {
      id: 3,
      content: 'We discussed generally the trade-offs to showing raw parameter details by default.',
      upvotes: 2,
    },
  },
  {
    user: {
      address: 'SP3TMFBG2FSSEHA5Q81ZMVMRB9GK0METVDV7RENRC',
      name: 'j.btc',
    },
    heystack: {
      id: 4,
      content: 'Hey helllooo',
      upvotes: 0,
    },
  },
];
