# Bus Tracking Code Comparison: Admin Dashboard vs Student Web App

Two apps read from the same backend but render bus positions differently:

- **Admin** = this repo (`Transport Dashboard`), screen: `src/screens/Dashboard.tsx` → `src/components/map.tsx` → `src/components/AnimatedMQTTBus.tsx`
- **Student** = sibling repo `../shuttleAppTest` (deployed at shuttle-app-test.vercel.app), screen: `src/Screens/Home.tsx` → `src/components/MapGL.tsx` → `src/components/AnimatedMQTTBus.tsx`

(There's also `GASSS/StudentWebApp`, an older/stale clone of the same app — last commit March 2025 vs shuttleAppTest's June 2026 — not covered here.)

---

## 1. Data sources

| | Admin | Student |
|---|---|---|
| MQTT/live socket | `hooks/useMQTTBuses.ts` → Socket.IO `https://shuttleapp-api.thelocalgodd.me/`, event `mqtt-device-locations` | `hooks/useMQTTBuses.tsx` → same Socket.IO server/event |
| REST polling | `src/components/map.tsx` `useDriversData()` → one-shot fetch, `https://shuttle-backend-0.onrender.com/api/v1/drivers/drivers` | `hooks/useIntegratedDrivers.ts` → polls every **30s**, `${VITE_DRIVER_API_URL}/drivers/drivers` (defaults to `https://shuttleapp-api.thelocalgodd.me/api`) |
| Legacy WebSocket | `hooks/useShuttleSocket.tsx` → `wss://shuttle-backend-0.onrender.com`, event `shuttle-locations` | not used |

**Key difference:** Admin's REST and MQTT backend URLs are different from each other (`shuttle-backend-0.onrender.com` vs `shuttleapp-api.thelocalgodd.me`), while Student's REST and MQTT both point at `shuttleapp-api.thelocalgodd.me`. If `shuttle-backend-0.onrender.com` is stale/cold (Render free-tier sleep) or returns different driver IDs than `shuttleapp-api.thelocalgodd.me`, the two apps will legitimately see different bus rosters even before any rendering logic runs.

## 2. Merging / source priority

**Admin** (`src/components/map.tsx:228-241`) — picks **one source only**, in priority order, never merges them:
```ts
if (mqttDrivers.length > 0) { result = mqttDrivers; source = 'MQTT'; }
else if (processedDrivers.length > 0) { result = processedDrivers; source = 'WebSocket'; }
else if (staticDrivers.length > 0 && ...) { result = ...; source = 'REST API'; }
else { result = []; }
```
So if MQTT has even 1 device, the REST-only drivers (no live GPS) are dropped entirely, not blended.

**Student** (`hooks/useIntegratedDrivers.ts:103-211`) — always **merges** REST (driver identity/route) with MQTT (live position) per device, by matching `deviceId`:
```ts
const latitude  = mqttMatch?.position?.latitude  ?? apiDriver.coords?.latitude  ?? 0;
const longitude = mqttMatch?.position?.longitude ?? apiDriver.coords?.longitude ?? 0;
...
dataSource: mqttMatch ? 'both' : 'api',
```
Then filters to `visible = merged.filter(d => d.active && (lat !== 0 || lng !== 0))`.

**Why this matters:** Admin's "all or nothing" source selection means a driver with no MQTT signal simply vanishes once *any* other bus has MQTT. Student keeps every API-registered driver visible (using its last REST coordinate) even with no live GPS. This alone can produce different bus *counts* between the two apps for the same backend state.

## 3. Route-based filtering (Student only — this is the missing piece in Admin)

Admin has **no** on-route/off-route concept. `activeDrivers` (whatever the chosen source returns) is rendered unconditionally on every screen, route selected or not — see `map.tsx:484-505`.

Student computes this **only** once a route is selected, via `hooks/useDynamicRoute.ts`:

1. **Hard gate** (`useDynamicRoute.ts:186-210`) — a driver only counts as "on this route" if its `busRoute` stop list contains **both** the chosen start and destination stop names (string match, case/whitespace-normalized). Anyone who fails this is immediately pushed to `offRoute`, regardless of live position.
2. **Geofence + 60s grace** (`:218-237`) — drivers that pass the gate are further checked against `GeofencingService`; if they fall outside the route corridor, they get a 60s (`OFF_ROUTE_GRACE_MS`) grace window before being demoted to `offRoute`.
3. **Selection** (`:269-331`) — the "tracked" bus is whichever trackable driver is closest to the route's start stop, with a 30s (`LAST_VALID_HOLD_MS`) hold on the previous selection to avoid flicker if it briefly drops out.

This is exactly the source of the `"1 bus on route · 2 off route"` text and panel in `src/Screens/Home.tsx:1059-1061`.

**Rendering difference before vs after selecting a route** (`src/components/MapGL.tsx`):
- Before selection → `renderAllDrivers()` (`:528-548`): plots every merged driver at its raw `driver.coords`, no route-snapping, no fallback.
- After selection → `renderTrackableDrivers()` (`:550-635`): plots `trackableDrivers` (which may be route-snapped/dead-reckoned, see §4) and `offRouteDrivers` separately, each with **last-known-position fallback** (`lastKnownCoordsRef`) when current coords are momentarily missing — so a bus that just went stale is drawn at its last seen spot, frozen, at `opacity: 0.4`.

This explains what you saw: the *same* bus can appear at a different pixel before vs. after selecting a route, because the two code paths use different position sources (raw vs. snapped/held-last-known), not because the backend reported a new location.

## 4. Bus marker animation (`AnimatedMQTTBus.tsx`)

| | Admin (196 lines) | Student (779 lines) |
|---|---|---|
| Movement threshold | 4 m | 2 m |
| Base duration | 1400 ms | 600 ms |
| Duration/metre | 3.8 ms | 2.0 ms |
| Duration range | 700–2400 ms | 300–2400 ms |
| Easing | cubic in-out, plain lerp between last and new GPS point | same cubic in-out, but the *target* point isn't raw GPS — see below |
| Extra stages | none — straight GPS → lerp → render | GPS → **EMA pre-smooth** (`useSmoothedIncoming`, α 0.30 pos / 0.35 heading) → **route projection/snap** (`projectToRoute`) → **dead reckoning** during gaps >5s (`useDeadReckoning`, decays over 60s) → **speed-guided blend** between snapped and predicted point → cubic-eased rAF lerp (`useSmoothPosition`) → render |

**Admin's animation** (`src/components/AnimatedMQTTBus.tsx:97-131`): one `useEffect` that, on every new `(latitude, longitude, heading)` prop, lerps from the last displayed point to the new one over a duration derived from haversine distance (and reported speed if present). That's the whole pipeline — short, direct, and exactly why it looks smoother to you: there's exactly one interpolation layer, always tracking real GPS.

**Student's animation** stacks four layers (EMA smoothing → route snapping → dead reckoning → cubic lerp) intended to hide GPS noise and gaps, but each layer changes the *target* the final lerp chases. If route-snapping pulls the target onto the polyline while raw GPS is slightly off it, or dead reckoning kicks in then a real fix arrives and snaps back, the visible marker can jump/correct in ways the simpler Admin pipeline never does — which lines up with it looking "choppier" despite being the more elaborate implementation.

## 5. File map for side-by-side diffing

| Concern | Admin | Student |
|---|---|---|
| Map root | `src/components/map.tsx` | `src/components/MapGL.tsx` (961 lines) |
| Bus marker/animation | `src/components/AnimatedMQTTBus.tsx` | `src/components/AnimatedMQTTBus.tsx` (+ `.google.tsx` variant) |
| MQTT hook | `hooks/useMQTTBuses.ts` | `hooks/useMQTTBuses.tsx` |
| REST driver fetch | inline `useDriversData()` in `map.tsx` | `hooks/useIntegratedDrivers.ts` |
| Route membership / on-off-route | — (none) | `hooks/useDynamicRoute.ts` |
| Closest-bus state | `src/screens/useClosestBus.tsx` (React Context, arrival thresholds 100m/500m) | `src/Screens/useClosestBus.tsx` (181 lines, different shape) + `src/Screens/ClosestStopContext.tsx` |
| Route polyline rendering | inline `<Source>/<Layer>` in `map.tsx` | `src/components/MapRoute.tsx` |
| Drop-point markers | inline in `map.tsx` | `src/components/MapMarkers.tsx` |
| Screen that mounts the map | `src/screens/Dashboard.tsx` | `src/Screens/Home.tsx` (1315 lines) |

## 6. Suggested next steps

- Confirm whether `shuttle-backend-0.onrender.com` (admin's REST+WS) and `shuttleapp-api.thelocalgodd.me` (student's REST+MQTT, admin's MQTT) are actually the same backend or have drifted — this is the simplest explanation for different bus *rosters*.
- Decide whether Admin should adopt Student's merge-don't-replace strategy (§2) so a bus without live MQTT doesn't disappear outright.
- If you want Admin's animation feel in Student, the EMA/dead-reckoning/route-snap layers in Student's `AnimatedMQTTBus.tsx` are the ones to simplify or tune down, not the final cubic-lerp (which is already nearly identical to Admin's).
