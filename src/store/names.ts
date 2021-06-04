import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { atomWithQuery } from 'jotai/query';
import { useNamesByAddress } from '@common/hooks/use-names-by-address';
import { useLocalNames } from '@common/hooks/use-local-names';
import { mainnetNetworkAtom } from '@store/ui';

const STALE_TIME = 30 * 60 * 1000;

const makeKey = (networkUrl: string, address: string): string => {
  return `${networkUrl}__${address}`;
};

interface NamesByAddressParam {
  networkUrl: string;
  address: string;
}

export const namesByAddressAtom = atomFamily<NamesByAddressParam, string[]>(
  (param: NamesByAddressParam) =>
    atomWithQuery(get => ({
      queryKey: 'names',
      queryFn: async (): Promise<string[]> => {
        const res = await fetch(param.networkUrl + `/v1/addresses/stacks/${param.address}`);
        const data = await res.json();
        return data?.names || [];
      },
    }))
);

interface LocalNamesParam {
  key: string;
  data?: [string[], number];
}

export const localNamesAtom = atomFamily((param: LocalNamesParam) =>
  atomWithStorage(param.key, param.data)
);

export const namesAtom = atomFamily((address: string) =>
  atom(get => {
    // We are temporarily forcing this to look for names on mainnet
    const network = get(mainnetNetworkAtom);
    if (!network) return null;
    const key = makeKey(network.coreApiUrl, address);
    const local = useLocalNames(key);

    if (local) {
      const [names, timestamp] = local;
      const now = Date.now();
      const isStale = now - timestamp > STALE_TIME;
      if (!isStale) return names;
    }

    try {
      const names = useNamesByAddress(network.coreApiUrl, address);
      if (names?.length) {
        useLocalNames(key, [names, Date.now()]);
      }
      return names || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  })
);
