import { cn } from '@/lib/utils';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
import { TriangleAlert } from 'lucide-react';

interface Props {
  className?: string;
}
export const RouteError: React.FC<Props> = ({ className }) => {
  const { error } = useRouteContext();

  if (!error) {
    return null;
  }

  return (
    <div className={cn('flex items-start gap-2.5 mt-5', className)}>
      <TriangleAlert className="size-5 shrink-0 mt-1" />
      {error}
    </div>
  );
};
