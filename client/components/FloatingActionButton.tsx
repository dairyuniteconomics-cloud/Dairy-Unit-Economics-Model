import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FloatingActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

import { ReactNode } from 'react';

export function FloatingActionButton({
  icon,
  label,
  onClick,
  position = 'bottom-right',
}: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-40`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        onClick={onClick}
        className={`rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
        title={label}
      >
        {icon}
      </Button>
      {isHovered && (
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded text-sm whitespace-nowrap animate-pulse">
          {label}
        </div>
      )}
    </div>
  );
}
