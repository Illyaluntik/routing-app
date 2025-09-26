import { WalkingPerson } from '@/components/icons/WalkingPerson';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useRouteContext } from '@/providers/RouteContext/routeContext';
import TravelMode from '@arcgis/core/rest/support/TravelMode';
import { Car, Truck } from 'lucide-react';

interface Props {
  className?: string;
}
export const TravelModeSwitch: React.FC<Props> = ({ className }) => {
  const { travelMode, setTravelMode } = useRouteContext();

  return (
    <Tabs
      defaultValue={travelMode}
      className={cn(className)}
      onValueChange={(value) => setTravelMode(value as TravelMode['type'])}
    >
      <TabsList className="text-white shadow-sm">
        <TabsTrigger value="automobile">
          <Car />
        </TabsTrigger>
        <TabsTrigger value="walk">
          <WalkingPerson />
        </TabsTrigger>
        <TabsTrigger value="truck">
          <Truck />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
