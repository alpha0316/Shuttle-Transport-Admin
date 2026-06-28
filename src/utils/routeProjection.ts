// Route snapping & projection utilities

export interface RouteCoord {
  latitude: number;
  longitude: number;
}

export function buildRouteDistances(coords: RouteCoord[]): number[] {
  const cumDist: number[] = [0];
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const d = haversineMetres(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
    cumDist.push(cumDist[i - 1] + d);
  }
  return cumDist;
}

export function projectToRoute(
  pos: RouteCoord,
  coords: RouteCoord[],
  cumDist: number[],
): { progressMeters: number; segmentIndex: number; segmentHeading: number } | null {
  if (coords.length < 2 || cumDist.length < 2) return null;

  let bestDist = Infinity;
  let bestSegment = 0;
  let bestT = 0;

  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1];
    const b = coords[i];
    const segLen = cumDist[i] - cumDist[i - 1];
    if (segLen < 0.01) continue;

    const { t } = closestPointOnSegment(pos, a, b);
    const px = a.longitude + (b.longitude - a.longitude) * t;
    const py = a.latitude + (b.latitude - a.latitude) * t;
    const d = haversineMetres(pos.latitude, pos.longitude, py, px);

    if (d < bestDist) {
      bestDist = d;
      bestSegment = i;
      bestT = t;
    }
  }

  // Only snap if within 100m of route
  if (bestDist > 100) return null;

  const progressMeters = cumDist[bestSegment - 1] + (cumDist[bestSegment] - cumDist[bestSegment - 1]) * bestT;
  const a = coords[bestSegment - 1];
  const b = coords[bestSegment];
  const heading = bearing(a.latitude, a.longitude, b.latitude, b.longitude);

  return { progressMeters, segmentIndex: bestSegment, segmentHeading: heading };
}

export function getPositionAtDistance(
  coords: RouteCoord[],
  cumDist: number[],
  targetMetres: number,
): { latitude: number; longitude: number; heading: number } {
  const total = cumDist[cumDist.length - 1] ?? 0;
  const clamped = Math.max(0, Math.min(targetMetres, total));

  for (let i = 1; i < cumDist.length; i++) {
    if (cumDist[i] >= clamped) {
      const segLen = cumDist[i] - cumDist[i - 1];
      const t = segLen > 0 ? (clamped - cumDist[i - 1]) / segLen : 0;
      const a = coords[i - 1];
      const b = coords[i];
      return {
        latitude: a.latitude + (b.latitude - a.latitude) * t,
        longitude: a.longitude + (b.longitude - a.longitude) * t,
        heading: bearing(a.latitude, a.longitude, b.latitude, b.longitude),
      };
    }
  }

  const last = coords[coords.length - 1];
  return { latitude: last.latitude, longitude: last.longitude, heading: 0 };
}

export function normalizeRouteCoords(routePolyline: any): RouteCoord[] | null {
  if (!routePolyline) return null;

  if (routePolyline.geometry?.coordinates && Array.isArray(routePolyline.geometry.coordinates)) {
    return routePolyline.geometry.coordinates
      .filter((pair: unknown) => Array.isArray(pair) && pair.length >= 2)
      .map(([lng, lat]: number[]) => ({ latitude: lat, longitude: lng }));
  }

  if (Array.isArray(routePolyline)) {
    const first = routePolyline[0];
    if (Array.isArray(first) && first.length >= 2) {
      return routePolyline
        .filter((pair: unknown) => Array.isArray(pair) && pair.length >= 2)
        .map(([lng, lat]: number[]) => ({ latitude: lat, longitude: lng }));
    }
  }

  return null;
}

// ---- Math helpers ----

function haversineMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function closestPointOnSegment(
  p: RouteCoord,
  a: RouteCoord,
  b: RouteCoord,
): { t: number; lat: number; lng: number } {
  const dx = b.longitude - a.longitude;
  const dy = b.latitude - a.latitude;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-12) return { t: 0, lat: a.latitude, lng: a.longitude };
  let t = ((p.longitude - a.longitude) * dx + (p.latitude - a.latitude) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return { t, lat: a.latitude + dy * t, lng: a.longitude + dx * t };
}
