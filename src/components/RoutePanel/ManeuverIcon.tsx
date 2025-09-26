import { cn } from '@/lib/utils';
import { maneuverIcons } from '@/misc/maneuverIcons';

interface Props {
  type: string;
  className?: string;
}

export const ManeuverIcon: React.FC<Props> = ({ type, className }) => {
  const Icon = maneuverIcons[type] || maneuverIcons['esriDMTUnknown'];
  return <Icon className={cn('size-7 flex-shrink-0', className)} />;
};
