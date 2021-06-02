import { atom } from 'jotai';
import { AppConfig, UserData, UserSession } from '@stacks/auth';

export const appConfig = new AppConfig(['store_write', 'publish_data'], document.location.href);
export const userSession = new UserSession({ appConfig });

export const defaultUser = (): UserData | null => {
  if (userSession.isUserSignedIn()) {
    return userSession.loadUserData();
  }
  return null;
};

export const authResponseAtom = atom('');
export const appPrivateKeyAtom = atom('');
export const userAtom = atom(defaultUser());
