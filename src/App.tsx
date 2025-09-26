import { MapContainer } from '@/components/MapContainer';
import { MapWidgets } from '@/components/MapWidgets/MapWidgets';
import { RoutePanel } from '@/components/RoutePanel/RoutePanel';
import { SearchBar } from '@/components/SearchBar';
import { AppUIProvider } from '@/providers/AppUIContext/AppUIProvider';
import { MapPopupProvider } from '@/providers/MapPopupContext/MapPopupProvider';
import { MapViewProvider } from '@/providers/MapViewContext/MapViewProvider';
import { RouteProvider } from '@/providers/RouteContext/RouteProvider';
import { UserPositionProvider } from '@/providers/UserPositionContext/UserPositionProvider';

function App() {
  return (
    <MapViewProvider>
      <UserPositionProvider>
        <RouteProvider>
          <AppUIProvider>
            <div className="h-[100dvh] w-screen relative">
              <MapContainer />

              <MapPopupProvider>
                <MapWidgets />
                <SearchBar />
              </MapPopupProvider>

              <RoutePanel />
            </div>
          </AppUIProvider>
        </RouteProvider>
      </UserPositionProvider>
    </MapViewProvider>
  );
}

export default App;
