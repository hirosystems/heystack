import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { atomWithQuery } from 'jotai/query';
import { mainnetNetworkAtom } from '@store/ui';

const STALE_TIME = 30 * 60 * 1000;

const makeKey = (networkUrl: string, address: string): string => {
  return `${networkUrl}__${address}`;
};
interface Param {
  networkUrl: string;
  address: string;
}

export const namesByAddressAtom = atomFamily<Param, string[]>((param: Param) =>
  atomWithQuery(get => ({
    queryKey: 'names',
    queryFn: async (): Promise<string[]> => {
      const res = await fetch(param.networkUrl + `/v1/addresses/stacks/${param.address}`);
      const data = await res.json();
      return data?.names || [];
    },
  }))
);

function getLocalNames(networkUrl: string, address: string): [string[], number] | null {
  const key = makeKey(networkUrl, address);
  const value = localStorage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
}

function setLocalNames(networkUrl: string, address: string, data: [string[], number]): void {
  const key = makeKey(networkUrl, address);
  return localStorage.setItem(key, JSON.stringify(data));
}

export const namesAtom = atomFamily((address: string) =>
  atom(get => {
    // We are temporarily forcing this to look for names on mainnet
    const network = get(mainnetNetworkAtom);
    if (!network) return null;

    const local = getLocalNames(network.coreApiUrl, address);

    if (local) {
      const [names, timestamp] = local;
      const now = Date.now();
      const isStale = now - timestamp > STALE_TIME;
      if (!isStale) return names;
    }

    try {
      const names = get(
        namesByAddressAtom({
          networkUrl: network.coreApiUrl,
          address,
        })
      );
      if (names?.length) {
        setLocalNames(network.coreApiUrl, address, [names, Date.now()]);
      }
      return names || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  })
);
