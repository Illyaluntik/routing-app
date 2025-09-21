import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppUIContext } from '@/providers/AppUIContext/appUIContext';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  className?: string;
}
export const RouteDetailToggleWidget: React.FC<Props> = ({ className }) => {
  const { routeResult } = useRouteContext();
  const { routeMinimized, setRouteMinimized } = useAppUIContext();

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
