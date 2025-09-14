import { maneuverIcons } from '@/misc/maneuverIcons';

interface Props {
  type: string;
}

export const ManeuverIcon: React.FC<Props> = ({ type }) => {
  const Icon = maneuverIcons[type] || maneuverIcons['esriDMTUnknown'];
  return <Icon className="size-7 text-white flex-shrink-0" />;
};
