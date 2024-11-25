import { useState, useEffect } from 'react';

export function usePlatform() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    };

    setIsMobile(checkMobile());
  }, []);

  return {
    isMobile,
    platform: isMobile ? 'mobile' : 'web',
    isIOS: /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()),
    isAndroid: /android/i.test(navigator.userAgent.toLowerCase()),
    isWeb: !isMobile
  };
}