import { ManeuverIcon } from '@/components/RoutePanel/ManeuverIcon';
import { useRouteDirection } from '@/hooks/useRouteDirection';
import { cn } from '@/lib/utils';
import { useMapViewContext } from '@/providers/MapViewContext/mapViewContext';
import { useRouteContext } from '@/providers/RouteContext/routeContext';

export const DirectionsList = () => {
  const { view } = useMapViewContext();
  const { routeResult } = useRouteContext();
  const { selectedDirectionIndex, onSelectDirection } = useRouteDirection(
    view,
    routeResult
  );

  if (!routeResult) {
    return null;
  }

  return (
    <>
      {routeResult.directions.map((dir, index) => (
        <div
          key={index}
          className={cn(
            'mb-2.5 flex justify-between items-center gap-2 cursor-pointer hover:bg-stone-200 px-2.5 py-1 rounded-md',
            selectedDirectionIndex === index
              ? '!bg-stone-300'
              : 'bg-transparent'
          )}
          onClick={() => onSelectDirection(index, dir)}
        >
          <div className="flex flex-col">
            <span className="font-medium">{dir.attributes.text}</span>
            {dir.attributes.length !== 0 && dir.attributes.time !== 0 && (
              <span className="text-xs">
                {(dir.attributes.length * 0.62137).toFixed(2)} mi -{' '}
                {dir.attributes.time < 1
                  ? `${(dir.attributes.time * 60).toFixed(0)} sec`
                  : `${dir.attributes.time.toFixed(0)} min`}
              </span>
            )}
          </div>
          <ManeuverIcon type={dir.attributes.maneuverType} />
        </div>
      ))}
    </>
  );
};
