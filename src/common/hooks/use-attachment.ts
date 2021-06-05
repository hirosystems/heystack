import { useAtom } from 'jotai';
import { attachmentUriAtom } from '@store/feed';

export function useAttachment() {
  const [state, setState] = useAtom(attachmentUriAtom);
  const updateAttachment = (value: string) => setState(value);
  const resetAttachment = () => updateAttachment('');
  const hasAttachment = state !== '';
  return {
    hasAttachment,
    attachment: state,
    updateAttachment,
    resetAttachment,
  };
}
