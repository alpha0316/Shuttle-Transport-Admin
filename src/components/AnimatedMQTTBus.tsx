import { useState, useEffect, useRef, useMemo, memo, type MouseEvent } from 'react';
import { Marker, useMap } from 'react-map-gl';
import { buildRouteDistances, projectToRoute, getPositionAtDistance, normalizeRouteCoords, type RouteCoord } from '../utils/routeProjection';
import BusIcon from './icons/BusIcon';

// ── Constants ─────────────────────────────────────────────────

const ZOOM_BREAKPOINTS: [number, number][] = [
  [11, 0.38], [12, 0.50], [13, 0.65], [14, 0.80], [15, 0.90], [16, 1.00],
];

function zoomToScale(zoom: number): number {
  const first = ZOOM_BREAKPOINTS[0];
  const last = ZOOM_BREAKPOINTS[ZOOM_BREAKPOINTS.length - 1];
  if (zoom <= first[0]) return first[1];
  if (zoom >= last[0]) return last[1];
  for (let i = 0; i < ZOOM_BREAKPOINTS.length - 1; i++) {
    const [z0, s0] = ZOOM_BREAKPOINTS[i];
    const [z1, s1] = ZOOM_BREAKPOINTS[i + 1];
    if (zoom >= z0 && zoom <= z1) {
      return s0 + (s1 - s0) * ((zoom - z0) / (z1 - z0));
    }
  }
  return 1;
}

function useMapZoom(defaultZoom = 14): number {
  const { current: map } = useMap();
  const [zoom, setZoom] = useState<number>(map ? map.getZoom() : defaultZoom);
  useEffect(() => {
    if (!map) return;
    setZoom(map.getZoom());
    const onZoom = () => setZoom(map.getZoom());
    map.on('zoom', onZoom);
    return () => { map.off('zoom', onZoom); };
  }, [map]);
  return zoom;
}

const MIN_MOVEMENT_THRESHOLD = 4;
const BASE_ANIMATION_DURATION = 1400;
const DURATION_PER_METRE = 3.8;
const MIN_DURATION = 700;
const MAX_DURATION = 2400;
const HEADING_SMOOTH_ALPHA = 0.35;
const POSITION_SMOOTH_ALPHA = 0.30;

function haversineMetres(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function wrapAngleDelta(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

// ── Props ─────────────────────────────────────────────────────

export interface AnimatedMQTTBusProps {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  deviceId?: string;
  valid?: boolean;
  isClosest?: boolean;
  isSelected?: boolean;
  isAtTurningPoint?: boolean;
  distanceToNext?: number;
  opacity?: number;
  onClick?: () => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  routePolyline?: any;
}

// ── Component ─────────────────────────────────────────────────

interface SmoothState { lat: number; lng: number; heading: number; }

export const AnimatedMQTTBus = memo(({
  latitude, longitude, heading = 0, speed,
  routePolyline, deviceId, opacity = 1, onClick,
  onMouseEnter, onMouseLeave,
  valid = true, isClosest = false, isSelected = false, isAtTurningPoint = false,
  distanceToNext,
}: AnimatedMQTTBusProps) => {

  const zoom = useMapZoom(14);
  const scale = zoomToScale(zoom);

  const routeCoords = useMemo<RouteCoord[] | null>(() => normalizeRouteCoords(routePolyline), [routePolyline]);
  const routeDistances = useMemo(() => routeCoords && routeCoords.length >= 2 ? buildRouteDistances(routeCoords) : null, [routeCoords]);

  // ── Smooth position animation ──────────────────────────────
  const currentRef = useRef<SmoothState>({ lat: latitude, lng: longitude, heading: heading % 360 });
  const startRef = useRef<SmoothState>({ lat: latitude, lng: longitude, heading: heading % 360 });
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>();
  const [displayPos, setDisplayPos] = useState<SmoothState>({ lat: latitude, lng: longitude, heading: heading % 360 });

  useEffect(() => {
    const moved = haversineMetres(currentRef.current.lat, currentRef.current.lng, latitude, longitude);
    if (moved < MIN_MOVEMENT_THRESHOLD) return;

    let duration = BASE_ANIMATION_DURATION;
    if (moved > 12) {
      duration = Math.min(MAX_DURATION, Math.max(MIN_DURATION, moved * DURATION_PER_METRE));
      if (speed && speed > 1) {
        duration = Math.min(MAX_DURATION, Math.max(MIN_DURATION, (moved / speed) * 1000 * 0.9));
      }
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = { ...currentRef.current };
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const rawT = Math.min((now - startTimeRef.current) / duration, 1);
      const t = rawT < 0.5 ? 4 * rawT ** 3 : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

      const lat = startRef.current.lat + (latitude - startRef.current.lat) * t;
      const lng = startRef.current.lng + (longitude - startRef.current.lng) * t;

      let hDiff = ((heading % 360) - startRef.current.heading + 540) % 360 - 180;
      if (Math.abs(hDiff) < 4) hDiff = 0;
      const newHeading = (startRef.current.heading + hDiff * t + 360) % 360;

      currentRef.current = { lat, lng, heading: newHeading };
      setDisplayPos({ lat, lng, heading: newHeading });
      if (rawT < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [latitude, longitude, heading, durationCalcKey(latitude, longitude, heading, speed)]);

  // Reset animation if device/route changes
  useEffect(() => {
    startRef.current = { lat: latitude, lng: longitude, heading: heading % 360 };
    currentRef.current = { lat: latitude, lng: longitude, heading: heading % 360 };
    setDisplayPos({ lat: latitude, lng: longitude, heading: heading % 360 });
  }, [deviceId, routePolyline]);

  const finalOpacity = valid ? opacity : opacity * 0.6;
  const isSlowing = isAtTurningPoint && distanceToNext != null && distanceToNext < 200;

  return (
    <Marker
      longitude={displayPos.lng}
      latitude={displayPos.lat}
      anchor="center"
      onClick={onClick}
      style={isSelected ? { zIndex: 9999 } : undefined}
    >
      <div
        style={{ position: 'relative', cursor: 'pointer' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          style={{
            transform: `rotate(${displayPos.heading}deg) scale(${scale})`,
            transition: 'transform 0.25s ease-out',
            transformOrigin: 'center center',
            willChange: 'transform',
            opacity: finalOpacity,
            filter: isSlowing ? 'brightness(1.2)' : 'none',
            pointerEvents: 'none',
          }}
        >
          {isClosest && (
            <div style={{
              position: 'absolute', width: 50, height: 50,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%', zIndex: 0,
              background: `radial-gradient(circle,
                rgba(52,168,83,0.60) 0%, rgba(52,168,83,0.60) 10%,
                rgba(30,120,60,0.40) 30%, rgba(30,120,60,0.40) 50%,
                rgba(15,60,30,0.22) 56%, transparent 56%)`,
              animation: 'closestPulse 2.8s infinite ease-in-out',
              pointerEvents: 'none',
            }} />
          )}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <BusIcon />
          </div>
          {!valid && (
            <div style={{
              position: 'absolute', top: -2, right: -2,
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: '#FF5722', border: '2px solid white',
            }} />
          )}
        </div>
      </div>
    </Marker>
  );
});

function durationCalcKey(lat: number, lng: number, heading: number, speed?: number): number {
  return Math.round(speed ?? 0) + Math.round(heading);
}

// Inject animation keyframes
if (typeof document !== 'undefined') {
  const id = '__animated-bus-styles';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes closestPulse {
        0%, 100% { opacity: 0.85; transform: translate(-50%,-50%) scale(1); }
        50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); }
      }
    `;
    document.head.appendChild(style);
  }
}
