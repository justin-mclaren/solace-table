import { useState, useEffect } from "react";

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check once on mount only - no resize listener
    // This ensures zero overhead during scrolling
    setIsMobile(window.innerWidth < breakpoint);
  }, [breakpoint]);

  return isMobile;
}
