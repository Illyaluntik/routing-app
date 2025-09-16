import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cn from 'classnames';

interface Props {
  setRouteMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}
export const MaximizeRouteWidget: React.FC<Props> = ({
  setRouteMinimized,
  className,
}) => {
  const maximizeRoute = () => {
    setRouteMinimized(false);
  };

  return (
    <div className={cn('bg-white/70 rounded-md shadow-md', className)}>
      <div className="flex flex-col backdrop-blur-sm rounded-md">
        <Button
          variant="ghost"
          className="cursor-pointer size-10"
          onClick={maximizeRoute}
        >
          <Maximize2 />
        </Button>
      </div>
    </div>
  );
};
