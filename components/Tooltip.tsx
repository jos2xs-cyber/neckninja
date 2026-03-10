import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom';
}

export default function Tooltip({ content, children, position = 'bottom' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !triggerRef.current) return;
    const update = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const GAP = 6;
      setCoords({
        top: position === 'bottom'
          ? rect.bottom + GAP + window.scrollY
          : rect.top - GAP + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [visible, position]);

  const child = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onFocus: () => setVisible(true),
    onBlur: () => setVisible(false),
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <>
      {child}
      {visible && createPortal(
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'absolute',
            top: coords.top,
            left: coords.left,
            transform: position === 'bottom'
              ? 'translateX(-50%)'
              : 'translateX(-50%) translateY(-100%)',
            zIndex: 9999,
          }}
          className="max-w-[220px] px-2.5 py-1.5 rounded-md text-xs leading-snug text-white bg-slate-800 dark:bg-slate-950 shadow-lg pointer-events-none whitespace-normal text-center"
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}
