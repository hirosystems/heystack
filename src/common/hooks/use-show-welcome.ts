import { useAtom } from 'jotai';
import { showAboutAtom } from '@store/ui';

export function useShowWelcome() {
  const [isShowing, setIsShowing] = useAtom(showAboutAtom);
  const toggleIsShowing = () => setIsShowing(s => !s);
  return {
    isShowing,
    toggleIsShowing,
  };
}
