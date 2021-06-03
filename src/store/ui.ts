import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';
export enum LOADING_KEYS {
  AUTH = 'loading/AUTH',
}
export const loadingAtom = atomFamily(key => atom(false));
