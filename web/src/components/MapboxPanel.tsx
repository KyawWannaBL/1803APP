import { env } from '@/lib/env';

const routeInsights = [
  { label: 'Dispatch map', value: 'Ready', detail: 'Hub lanes, riders, and stop clusters visualized.' },
  { label: 'Stop sequencing', value: 'Auto', detail: 'Sequence engine prepared for Directions API.' },
  { label: 'ETA prediction', value: 'Live', detail: 'Realtime ETA and geofence alert scaffold enabled.' },
];

export function MapboxPanel() {
  return (
    <div className="page-card glass-card">
      <div className="widget-card__title widget-card__title--space">
        <strong>Mapbox / wayplanning</strong>
        <span className={`status-chip ${env.mapboxToken ? 'status-chip--ok' : 'status-chip--warn'}`}>
          {env.mapboxToken ? 'token ready' : 'token missing'}
        </span>
      </div>
      <div className="telemetry-grid">
        {routeInsights.map((item) => (
          <div key={item.label} className="telemetry-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </div>
        ))}
      </div>
      <div className="map-panel">
        {env.mapboxToken
          ? 'Mapbox Directions API scaffold is enabled. Connect dispatch stops, vehicle telemetry, and geofences in the next backend iteration.'
          : 'Add VITE_MAPBOX_ACCESS_TOKEN to unlock Directions API, optimized stop sequencing, ETA prediction, and dispatch map overlays.'}
      </div>
    </div>
  );
}

export default MapboxPanel;