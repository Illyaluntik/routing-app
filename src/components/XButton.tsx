import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React from 'react';

interface Props {
  className?: string;
  onClick: () => void;
}

export const XButton: React.FC<Props> = ({ onClick, className, ...props }) => {
  return (
    <Button
      className={cn('cursor-pointer', className)}
      size="icon"
      variant="ghost"
      onClick={onClick}
      {...props}
    >
      <X />
    </Button>
  );
};
