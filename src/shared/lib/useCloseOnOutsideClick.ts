import { useEffect, type RefObject } from 'react';

type UseCloseOnOutsideClickParams = {
  ref: RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
};

export const useCloseOnOutsideClick = ({
  ref,
  isOpen,
  onClose,
}: UseCloseOnOutsideClickParams) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, ref]);
};
