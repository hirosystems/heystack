import { useAtom } from 'jotai';
import { booleanAtom } from '@store/ui';

export function useToggle(key: string) {
  const [toggle, setToggle] = useAtom(booleanAtom(key));
  const handleToggle = () => setToggle(s => !s);
  return {
    toggle,
    handleToggle,
    setToggle,
  };
}
