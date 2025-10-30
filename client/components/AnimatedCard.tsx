import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnimatedCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glow';
}

export function AnimatedCard({
  title,
  children,
  icon,
  className = '',
  variant = 'default',
}: AnimatedCardProps) {
  const variantClasses = {
    default: 'card-enhanced hover:shadow-2xl',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 card-enhanced hover:shadow-2xl',
    glow: 'card-enhanced shadow-lg hover:shadow-2xl hover:shadow-green-400/50',
  };

  return (
    <Card
      className={`${variantClasses[variant]} transition-all duration-300 transform hover:scale-105 ${className}`}
      style={{
        animation: 'slideIn 0.6s ease-out',
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-2xl">{icon}</div>}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
