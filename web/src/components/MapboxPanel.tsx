import { env } from '@/lib/env';

export function MapboxPanel() {
  return (
    <div className="page-card">
      <div className="widget-card__title">Route Visibility</div>
      <div className="map-panel">
        {env.mapboxToken ? 'Mapbox token detected. Replace this panel with the live map widget.' : 'Demo route map placeholder. Add VITE_MAPBOX_ACCESS_TOKEN to enable live map integration.'}
      </div>
    </div>
  );
}