import { atom } from 'jotai';
import { AppConfig, UserData, UserSession } from '@stacks/auth';

export interface User {
  userData: UserData | null;
}

export const defaultUser = (): User => {
  const appConfig = new AppConfig(['store_write', 'publish_data'], document.location.href);
  const userSession = new UserSession({ appConfig });

  if (userSession.isUserSignedIn()) {
    return {
      userData: userSession.loadUserData(),
    };
  }
  return { userData: null };
};

export const authResponseAtom = atom('');
export const appPrivateKeyAtom = atom('');
export const userAtom = atom(defaultUser);
