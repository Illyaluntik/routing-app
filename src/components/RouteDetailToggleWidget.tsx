import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RouteResult } from '@/hooks/useRoute';
import { cn } from '@/lib/utils';

interface Props {
  routeResult: RouteResult | null;
  routeMinimized: boolean;
  setRouteMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}
export const RouteDetailToggleWidget: React.FC<Props> = ({
  routeResult,
  routeMinimized,
  setRouteMinimized,
  className,
}) => {
  if (!routeMinimized) {
    return (
      <Button
        className={cn(className)}
        size="icon"
        variant="ghost"
        onClick={() => setRouteMinimized(true)}
      >
        <Minimize2 />
      </Button>
    );
  }

  return (
    <div className={cn('bg-white/70 rounded-md shadow-md', className)}>
      <div className="flex flex-col backdrop-blur-sm rounded-md">
        <Button
          variant="ghost"
          className={cn(
            'cursor-pointer',
            routeResult ? 'h-[46px] gap-2.5 items-start' : 'size-10'
          )}
          onClick={() => setRouteMinimized(false)}
        >
          {routeMinimized && routeResult && (
            <div className="flex flex-col text-left">
              <span>{routeResult.summary.totalTimeFormatted}</span>
              <span className="text-[10px] leading-none text-stone-500">
                {routeResult.summary.totalLengthFormatted}
              </span>
            </div>
          )}

          <Maximize2 />
        </Button>
      </div>
    </div>
  );
};
