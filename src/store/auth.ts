import { atom } from 'jotai';
import { AppConfig, UserData, UserSession } from '@stacks/auth';
import { atomWithDefault } from 'jotai/utils';

export const appConfig = new AppConfig(['store_write', 'publish_data'], document.location.href);
export const userSessionAtom = atom(() => new UserSession({ appConfig }));

export const authResponseAtom = atom(null);
export const appPrivateKeyAtom = atom(null);
export const userAtom = atomWithDefault(get => {
  const userSession = get(userSessionAtom);
  if (userSession.isUserSignedIn()) {
    return userSession.loadUserData();
  }
});
