import { useEffect, useState } from 'react';

export const useIsMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth < breakpoint
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [breakpoint]);

  return isMobile;
};
