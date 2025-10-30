import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  animated = true,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = (value / max) * 100;

  useEffect(() => {
    if (!animated) {
      setDisplayValue(percentage);
      return;
    }

    let current = 0;
    const increment = percentage / 50;
    const interval = setInterval(() => {
      current += increment;
      if (current >= percentage) {
        setDisplayValue(percentage);
        clearInterval(interval);
      } else {
        setDisplayValue(current);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [percentage, animated]);

  const getColor = () => {
    if (displayValue < 33) return 'from-red-500 to-orange-500';
    if (displayValue < 66) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-600';
  };

  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium mb-2 text-gray-700">{label}</p>}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${displayValue}%` }}
          />
        </div>
        {showPercentage && (
          <span className="text-sm font-semibold text-gray-700 w-12 text-right">
            {Math.round(displayValue)}%
          </span>
        )}
      </div>
    </div>
  );
}
