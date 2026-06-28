import { useState, useEffect, useRef, useCallback, useMemo, type MouseEvent, type Key } from 'react';
import Map, { Marker, Source, Layer, GeolocateControl, type ViewState, type MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useClosestBus } from '../screens/useClosestBus';
import { useShuttleSocket } from '../../hooks/useShuttleSocket';
import useMQTTBuses from '../../hooks/useMQTTBuses';
import { AnimatedMQTTBus } from './AnimatedMQTTBus';
import MarkerIcon from './icons/MarkerIcon';
import LocationIcon from './icons/LocationIcon';
import { VehicleHoverCard } from './VehicleHoverCard';
import { MOCK_MAP_BUSES } from '../mockData/index';

const HOVER_DELAY_MS = 2000;

// ── Stop name → coordinates lookup ───────────────────────────

const STOP_COORDS: Record<string, { lat: number; lng: number }> = {
  'Brunei': { lat: 6.6705, lng: -1.5742 },
  'Main Library': { lat: 6.6750, lng: -1.5724 },
  'Pentecost': { lat: 6.6745, lng: -1.5676 },
  'SRC': { lat: 6.6752, lng: -1.5679 },
  'KSB': { lat: 6.6693, lng: -1.5672 },
  'Commercial Area': { lat: 6.6828, lng: -1.5770 },
  'Hall 7': { lat: 6.6793, lng: -1.5728 },
  'Conti': { lat: 6.6796, lng: -1.5730 },
  'Gaza': { lat: 6.6866, lng: -1.5569 },
  'Medical Village': { lat: 6.6801, lng: -1.5497 },
  'Pharmacy': { lat: 6.6748, lng: -1.5664 },
};

// ── Constants ─────────────────────────────────────────────────

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const BASE_CUSTOMER_URL = 'https://shuttle-backend-0.onrender.com/api/v1';
const DEFAULT_LONGITUDE = -1.573568;
const DEFAULT_LATITUDE = 6.678045;
const DEFAULT_ZOOM = 14.95;
const MAX_MAP_ZOOM = 17;

type ConnectionState = 'connecting' | 'waiting_for_positions' | 'ready';
type BusLoadingToastProps = { state: ConnectionState };

// ── Types ─────────────────────────────────────────────────────

interface DropPoint {
  name: string;
  latitude: number;
  longitude: number;
}

interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  dropPoints: DropPoint[];
}

interface Coordinates {
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: number;
  heading?: number;
}

export interface Driver {
  busID: string;
  driverID?: string;
  active: boolean;
  busRoute: any[];
  coords: Coordinates;
  driverName?: string;
  fullName?: string;
  phoneNumber?: string;
}

interface MapComponentProps {
  pickUp: Location | null;
  dropOff: Location | null;
  onSelectBus?: (driver: Driver) => void;
}

// ── Loading Toast ─────────────────────────────────────────────

const BusLoadingToast = ({ state }: BusLoadingToastProps) => (
  <div style={{
    position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '10px 12px',
    borderRadius: 12, fontSize: 14, zIndex: 10000,
    display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
  }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="#34A853" strokeWidth="2" strokeLinecap="round" />
    </svg>
    {state === 'connecting'
      ? 'Loading Available Shuttles...'
      : 'Receiving live bus locations...'}
  </div>
);

// ── Custom Hooks ──────────────────────────────────────────────

const useDriversData = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [busRoute, setBusRoute] = useState<Array<{ busID: string; busRoute: any[] }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_CUSTOMER_URL}/drivers/drivers`);
        if (!response.ok) throw new Error('Failed to fetch drivers');
        const data = await response.json();
        const driversData = data.drivers || [];
        setDrivers(driversData);
        if (Array.isArray(driversData)) {
          setBusRoute(driversData.map((d: any) => ({ busID: d.busID, busRoute: d.busRoute })));
        }
      } catch (err) {
        console.error('Error fetching drivers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  return { drivers, busRoute, loading };
};

const useProcessedDrivers = (shuttles: any[], busRoute: Array<{ busID: string; busRoute: any[] }>) => {
  return useMemo(() => {
    if (!Array.isArray(shuttles) || shuttles.length === 0) return [];
    return shuttles
      .map((shuttle: any) => {
        const innerLocation = shuttle.location?.location || {};
        const matchedRoute = busRoute.find((route) => {
          const shuttleId = shuttle.driverId || shuttle.shuttleId || shuttle.id;
          if (!route.busID || !shuttleId) return false;
          return route.busID.replace(/\D/g, '') === shuttleId.replace(/\D/g, '');
        });

        let stops: any[] = [];
        if (matchedRoute?.busRoute?.[0]?.stops) stops = matchedRoute.busRoute[0].stops;

        return {
          busID: shuttle.driverId || shuttle.shuttleId || shuttle.id || '',
          driverID: shuttle.driverId || shuttle.shuttleId || shuttle.id || '',
          active: shuttle.isActive ?? true,
          busRoute: stops,
          coords: {
            latitude: innerLocation.latitude ?? 0,
            longitude: innerLocation.longitude ?? 0,
            speed: innerLocation.speed ?? 0,
            heading: innerLocation.heading ?? 0,
            timestamp: innerLocation.timestamp ? new Date(innerLocation.timestamp).getTime() : Date.now(),
          },
        };
      })
      .filter((d: Driver) => d.coords.latitude !== 0 || d.coords.longitude !== 0)
      .reduce((unique: Driver[], driver: Driver) => {
        const numericId = driver.busID.replace(/\D/g, '');
        const existing = unique.find(d => d.busID.replace(/\D/g, '') === numericId);
        if (!existing) unique.push(driver);
        else if (driver.coords.timestamp && existing.coords.timestamp && driver.coords.timestamp > existing.coords.timestamp)
          unique[unique.indexOf(existing)] = driver;
        return unique;
      }, []);
  }, [shuttles, busRoute]);
};

// ── Main Component ────────────────────────────────────────────

const MapComponent: React.FC<MapComponentProps> = ({ pickUp, dropOff, onSelectBus }) => {
  const mapRef = useRef<MapRef | null>(null);
  const geolocateControlRef = useRef<any>(null);
  const hasEverBeenReadyRef = useRef(false);

  const [viewState, setViewState] = useState<ViewState>({
    longitude: DEFAULT_LONGITUDE, latitude: DEFAULT_LATITUDE,
    zoom: DEFAULT_ZOOM, bearing: 0, pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  const [storedDropPoints, setStoredDropPoints] = useState<DropPoint[]>([]);
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const [selectedBusRoute, setSelectedBusRoute] = useState<any>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [] = useState<{
    busID: string; driverName: string; driverPhone: string;
    startPoint: string; endPoint: string; latitude: number; longitude: number;
  } | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{ driver: any; x: number; y: number } | null>(null);
  const hoverTimerRef = useRef<number | null>(null);

  // Data sources
  const { drivers: staticDrivers, busRoute } = useDriversData();
  const shuttles = useShuttleSocket();
  const processedDrivers = useProcessedDrivers(shuttles, busRoute);
  const { devices: mqttDevices, isConnected: mqttConnected } = useMQTTBuses();
  const { closest } = useClosestBus();

  // Merge MQTT devices into drivers format
  const mqttDrivers: Driver[] = useMemo(() => {
    return Object.values(mqttDevices).map(device => ({
      busID: device.deviceId,
      driverID: device.deviceId,
      active: device.deviceStatus !== 'offline',
      busRoute: [],
      coords: {
        latitude: device.position.latitude,
        longitude: device.position.longitude,
        heading: device.position.course,
        speed: device.position.speed,
        timestamp: new Date(device.position.serverTime).getTime(),
      },
    }));
  }, [mqttDevices]);

  // Determine active drivers: prefer MQTT > WebSocket > API > Mock
  const activeDrivers = useMemo(() => {
    if (mqttDrivers.length > 0) return mqttDrivers;
    if (processedDrivers.length > 0) return processedDrivers;
    if (staticDrivers.length > 0 && staticDrivers.some(d => d.coords?.latitude !== 0)) {
      return staticDrivers.map(d => ({
        ...d, busID: d.busID, active: true, busRoute: [],
        coords: { latitude: d.coords?.latitude ?? 0, longitude: d.coords?.longitude ?? 0 },
      }));
    }
    // Fallback to mock data
    return MOCK_MAP_BUSES.map(m => ({
      busID: m.busID,
      driverID: m.driverID,
      active: m.active,
      busRoute: m.busRoute,
      coords: {
        latitude: m.coords.latitude,
        longitude: m.coords.longitude,
        heading: m.coords.heading,
        speed: m.coords.speed,
        timestamp: m.coords.timestamp,
      },
      driverName: m.driverName,
      fullName: m.driverName,
      _mock: true as const,
    })) as any;
  }, [mqttDrivers, processedDrivers, staticDrivers]);

  // Connection state
  useEffect(() => {
    if (mqttConnected && mqttDrivers.length > 0) {
      hasEverBeenReadyRef.current = true;
      setConnectionState('ready');
    } else if (mqttConnected) {
      setConnectionState(hasEverBeenReadyRef.current ? 'ready' : 'waiting_for_positions');
    } else if (shuttles.length > 0) {
      hasEverBeenReadyRef.current = true;
      setConnectionState('ready');
    } else if (staticDrivers.length > 0) {
      hasEverBeenReadyRef.current = true;
      setConnectionState('ready');
    } else {
      setConnectionState(hasEverBeenReadyRef.current ? 'ready' : 'connecting');
    }

    // Timeout after 8s
    const t = setTimeout(() => {
      if (!hasEverBeenReadyRef.current) {
        hasEverBeenReadyRef.current = true;
        setConnectionState('ready');
      }
    }, 8000);
    return () => clearTimeout(t);
  }, [mqttConnected, mqttDrivers.length, shuttles.length, staticDrivers.length]);

  // Drop points from pickup location
  useEffect(() => {
    if (pickUp?.dropPoints?.length) {
      setStoredDropPoints(pickUp.dropPoints.map(dp => ({
        name: dp.name, latitude: dp.latitude, longitude: dp.longitude,
      })));
    } else {
      setStoredDropPoints([]);
    }
  }, [pickUp]);

  // Fetch route from start to end points
  const routeCoords = useMemo(() => {
    if (storedDropPoints.length === 0) return null;
    const pts: { lat: number; lng: number }[] = [];
    if (pickUp) pts.push({ lat: pickUp.latitude, lng: pickUp.longitude });
    storedDropPoints.forEach(dp => pts.push({ lat: dp.latitude, lng: dp.longitude }));
    if (dropOff) pts.push({ lat: dropOff.latitude, lng: dropOff.longitude });
    return pts.length >= 2 ? pts : null;
  }, [pickUp, storedDropPoints, dropOff]);

  useEffect(() => {
    if (!routeCoords || routeCoords.length < 2) {
      setRouteGeoJSON(null);
      return;
    }

    let cancelled = false;
    const fetchRoute = async () => {
      try {
        const coords = routeCoords.map(p => `${p.lng},${p.lat}`).join(';');
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}&overview=full`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled && data.routes?.length > 0) {
          setRouteGeoJSON({
            type: 'Feature', properties: {},
            geometry: data.routes[0].geometry,
          });
        }
      } catch (err) {
        console.error('Route fetch error:', err);
      }
    };
    fetchRoute();
    return () => { cancelled = true; };
  }, [routeCoords]);

  // Memo: fallback route line
  const routeGeoJSONforLine = useMemo(() => {
    if (routeGeoJSON) return routeGeoJSON;
    if (routeCoords && routeCoords.length >= 2) {
      return {
        type: 'Feature', properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoords.map(p => [p.lng, p.lat]),
        },
      };
    }
    return null;
  }, [routeGeoJSON, routeCoords]);

  // Handlers
  const handleViewStateChange = useCallback((evt: { viewState: ViewState }) => {
    setViewState(prev => ({
      ...prev,
      longitude: evt.viewState.longitude,
      latitude: evt.viewState.latitude,
      zoom: Math.min(evt.viewState.zoom, MAX_MAP_ZOOM),
    }));
  }, []);

  const zoomToBusAndFetchRoute = useCallback(async (driver: any) => {
    // Fly map to bus
    mapRef.current?.flyTo({
      center: [driver.coords.longitude, driver.coords.latitude],
      zoom: 15.5,
      duration: 800,
    });
    setSelectedBus(driver.busID);

    // Fetch route polyline from stop names
    const route = driver.busRoute || [];
    if (route.length >= 2) {
      const coords = route
        .map((name: string) => STOP_COORDS[name])
        .filter(Boolean);
      if (coords.length >= 2) {
        try {
          const coordStr = coords.map((c: { lng: any; lat: any; }) => `${c.lng},${c.lat}`).join(';');
          const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordStr}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}&overview=full`;
          const res = await fetch(url);
          const data = await res.json();
          if (data.routes?.length > 0) {
            setSelectedBusRoute({
              type: 'Feature', properties: {},
              geometry: data.routes[0].geometry,
            });
          }
        } catch {
          // Fallback: straight lines
          setSelectedBusRoute({
            type: 'Feature', properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords.map((c: { lng: any; lat: any; }) => [c.lng, c.lat]),
            },
          });
        }
      }
    } else {
      setSelectedBusRoute(null);
    }

    // Notify parent
    onSelectBus?.(({
      busID: driver.busID,
      driverID: (driver as any).driverID || driver.busID,
      driverName: (driver as any).driverName || (driver as any).fullName || `Bus ${driver.busID}`,
      active: driver.active,
      busRoute: driver.busRoute || [],
      coords: driver.coords,
      _mock: (driver as any)._mock,
    }) as any);
  }, [onSelectBus]);

  // Clear selected route when bus deselected
  useEffect(() => {
    if (!selectedBus) setSelectedBusRoute(null);
  }, [selectedBus]);

  // Hover card: appears after a sustained hover, persists while on card itself
  const handleBusMouseEnter = useCallback((driver: any) => (e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => {
      setHoverInfo({ driver, x, y });
    }, HOVER_DELAY_MS);
  }, []);

  const handleBusMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    // Use a small delay to allow the cursor to reach the card
    hoverTimerRef.current = window.setTimeout(() => {
      setHoverInfo(null);
    }, 300);
  }, []);

  const handleCardMouseEnter = useCallback(() => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Inject animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@keyframes spin {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
    document.head.append(style);
    return () => style.remove();
  }, []);

  // ── Render ──────────────────────────────────────────────────

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      {...viewState}
      maxZoom={MAX_MAP_ZOOM}
      style={{ width: '100%', height: '100%', position: 'absolute' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMove={handleViewStateChange}
    >
      {/* Route line (pickup→dropoff) */}
      {routeGeoJSONforLine && (
        <Source id="route" type="geojson" data={routeGeoJSONforLine}>
          <Layer
            id="route-layer"
            type="line"
            paint={{ 'line-color': '#34A853', 'line-width': 4, 'line-opacity': 0.85 }}
          />
        </Source>
      )}

      {/* Selected bus route line */}
      {selectedBusRoute && (
        <Source id="selected-bus-route" type="geojson" data={selectedBusRoute}>
          <Layer
            id="selected-bus-route-layer"
            type="line"
            paint={{ 'line-color': '#2563EB', 'line-width': 5, 'line-opacity': 0.9, 'line-dasharray': [3, 1.5] }}
          />
        </Source>
      )}

      {/* Bus markers */}
      {activeDrivers.map((driver: { coords: { latitude: number; longitude: number; heading: any; speed: number | undefined; }; busID: Key | null | undefined; active: boolean | undefined; }) => {
        if (!driver.coords?.latitude || !driver.coords?.longitude) return null;
        return (
          <AnimatedMQTTBus
            key={driver.busID}
            deviceId={String(driver.busID)}
            latitude={driver.coords.latitude}
            longitude={driver.coords.longitude}
            heading={driver.coords.heading || 0}
            speed={driver.coords.speed}
            valid={driver.active}
            isClosest={closest?.driver?.busID === driver.busID}
            isSelected={selectedBus === driver.busID}
            onClick={() => {
              zoomToBusAndFetchRoute(driver);
            }}
            onMouseEnter={handleBusMouseEnter(driver)}
            onMouseLeave={handleBusMouseLeave}
          />
        );
      })}

      {/* Loading toast */}
      {!hasEverBeenReadyRef.current && (
        <BusLoadingToast state={connectionState} />
      )}

      {/* Pickup marker */}
      {pickUp && (
        <Marker longitude={pickUp.longitude} latitude={pickUp.latitude} anchor="bottom">
          <MarkerIcon color="#34A853" />
        </Marker>
      )}

      {/* Drop point markers */}
      {storedDropPoints.map((dp, i) => (
        <Marker key={`dp-${i}`} longitude={dp.longitude} latitude={dp.latitude} anchor="center">
          <div style={{
            background: i === 0 ? '#3F51B5' : '#3F51B5',
            width: 14, height: 14, borderRadius: '50%',
            border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }} />
        </Marker>
      ))}

      {/* Dropoff marker */}
      {dropOff && (
        <Marker longitude={dropOff.longitude} latitude={dropOff.latitude} anchor="bottom">
          <MarkerIcon color="#EF4444" />
        </Marker>
      )}

      {/* Geolocate control */}
      <GeolocateControl
        ref={geolocateControlRef}
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation
        showUserLocation
        style={{ display: 'none' }}
      />

      {/* Locate me button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => geolocateControlRef.current?.trigger()}
          style={{
            backgroundColor: 'white', border: 'none', borderRadius: '50%',
            padding: 10, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48,
          }}
        >
          <LocationIcon />
        </button>
      </div>

      {hoverInfo && (() => {
        const driver = hoverInfo.driver;
        const stops: string[] = Array.isArray(driver.busRoute) ? driver.busRoute : [];
        const mockBus = MOCK_MAP_BUSES.find(b => b.busID === driver.busID || b.driverID === (driver.driverID || driver.busID));
        const phone = driver.phoneNumber || mockBus?.phoneNumber;
        return (
          <VehicleHoverCard
            x={hoverInfo.x}
            y={hoverInfo.y}
            driverName={driver.driverName || driver.fullName || mockBus?.driverName || `Bus ${driver.busID}`}
            phone={phone}
            routeFrom={stops[0] ?? 'Start'}
            routeTo={stops[stops.length - 1] ?? 'Destination'}
            progress={50}
            onTrack={() => {
              zoomToBusAndFetchRoute(driver);
              setHoverInfo(null);
            }}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          />
        );
      })()}
    </Map>
  );
};

export default MapComponent;
