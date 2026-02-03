import { useEffect, useState } from "react";

interface TopLoadingBarProps {
  isAnimating: boolean;
}

const TopLoadingBar = ({ isAnimating }: TopLoadingBarProps) => {
  const [width, setWidth] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      setIsExiting(false);
      setWidth(0);
      
      // Animate to 90% over 2 seconds
      const timer = setTimeout(() => setWidth(90), 50);
      return () => clearTimeout(timer);
    } else {
      // Quick animation to 100% then fade out
      setWidth(100);
      setIsExiting(true);
      
      const timer = setTimeout(() => setWidth(0), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (width === 0 && !isAnimating) return null;

  return (
    <div 
      className={`fixed top-0 left-0 right-0 h-[3px] bg-primary z-[9999] transition-all duration-300 ease-out ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        width: `${width}%`,
        boxShadow: '0 0 10px rgba(var(--primary-rgb), 0.5)',
        transitionDuration: isAnimating ? '2000ms' : '300ms'
      }}
    />
  );
};

export default TopLoadingBar;
