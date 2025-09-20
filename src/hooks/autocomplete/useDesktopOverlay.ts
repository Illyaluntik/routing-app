import { useEffect, useState } from 'react';

export const useDesktopOverlay = (
  isOpen: boolean,
  inputRef: React.RefObject<HTMLElement | null>
) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width?: number;
  }>({
    top: 0,
    left: 0,
    width: undefined,
  });

  useEffect(() => {
    const calculate = () => {
      if (!inputRef.current) {
        return;
      }

      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    calculate();
    window.addEventListener('resize', calculate);

    return () => {
      window.removeEventListener('resize', calculate);
    };
  }, [inputRef, isOpen]);

  return position;
};
