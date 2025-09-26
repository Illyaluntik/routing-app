import { useRouteContext } from '@/providers/RouteContext/routeContext';

export const RouteSummary = () => {
  const { routeResult } = useRouteContext();

  if (!routeResult) {
    return null;
  }

  return (
    <div className="flex items-baseline-last gap-2.5 mt-5">
      <span className="font-bold text-3xl">
        {routeResult.summary.totalTimeFormatted}
      </span>
      -
      <span className="text-sm">
        {routeResult.summary.totalLengthFormatted}
      </span>
    </div>
  );
};
