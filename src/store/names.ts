import { atom } from 'jotai';
import { atomFamily, atomWithStorage } from 'jotai/utils';
import { useFetch } from '@common/hooks/use-fetch';
import { networkAtom } from './ui';

const STALE_TIME = 30 * 60 * 1000;

async function fetchNamesByAddress(networkUrl: string, address: string): Promise<string[]> {
  const res = await useFetch(networkUrl + `/v1/addresses/stacks/${address}`);
  const data = await res.json();
  return data?.names || [];
}

function makeKey(networkUrl: string, address: string): string {
  return `${networkUrl}__${address}`;
}

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
  atom(async get => {
    const network = get(networkAtom);
    if (!network) return null;

    const local = getLocalNames(network.coreApiUrl, address);

    if (local) {
      const [names, timestamp] = local;
      const now = Date.now();
      const isStale = now - timestamp > STALE_TIME;
      if (!isStale) return names;
    }

    try {
      const names = await fetchNamesByAddress(network.coreApiUrl, address);
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
