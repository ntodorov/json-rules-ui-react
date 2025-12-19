import * as React from 'react';
import { cn } from '../../lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
}

export function Tooltip({
  content,
  children,
  className,
  side = 'auto',
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState<
    'top' | 'bottom' | 'left' | 'right'
  >('bottom');
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const calculatePosition = React.useCallback(() => {
    if (side !== 'auto') {
      setPosition(side);
      return;
    }

    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Estimate tooltip size (approximate)
    const tooltipHeight = 32;
    const tooltipWidth = 120;

    const spaceTop = rect.top;
    const spaceBottom = viewportHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = viewportWidth - rect.right;

    // Prefer bottom, then top, then left, then right
    if (spaceBottom >= tooltipHeight + 8) {
      setPosition('bottom');
    } else if (spaceTop >= tooltipHeight + 8) {
      setPosition('top');
    } else if (spaceLeft >= tooltipWidth + 8) {
      setPosition('left');
    } else if (spaceRight >= tooltipWidth + 8) {
      setPosition('right');
    } else {
      // Default to bottom if no space
      setPosition('bottom');
    }
  }, [side]);

  const handleMouseEnter = () => {
    calculatePosition();
    setIsVisible(true);
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-[100] whitespace-nowrap rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95 dark:bg-slate-100 dark:text-slate-900',
            positionClasses[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
