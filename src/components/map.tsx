import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidGhlbG9jYWxnb2RkIiwiYSI6ImNtMm9ocHFhYTBmczQya3NnczhoampiZ3gifQ.lPNutwk6XRi_kH_1R1ebiw';

const DEFAULT_LONGITUDE = -1.573568;
const DEFAULT_LATITUDE = 6.678045;
const DEFAULT_ZOOM = 16.95;
const TRANSITION_DURATION = 500;
const SELECTEDBUS_ZOOM = 16.95;

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
interface MapComponentProps {
  pickUp: Location | null;
  dropOff: Location | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ pickUp, dropOff }) => {
  const [center, setCenter] = useState<LatLngExpression>([DEFAULT_LATITUDE, DEFAULT_LONGITUDE]);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  const mapRef = useRef<L.Map | null>(null);

  // Build list of markers
  const getMarkersToShow = () => {
    const pickUpMarker = pickUp ? [{
      id: pickUp.id,
      name: pickUp.name,
      latitude: pickUp.latitude,
      longitude: pickUp.longitude,
      type: 'pickup' as const
    }] : [];

    const dropPointMarkers = pickUp?.dropPoints?.map((dp, index) => ({
      id: `dp-${index}`,
      name: dp.name,
      latitude: dp.latitude,
      longitude: dp.longitude,
      type: 'droppoint' as const
    })) ?? [];

    const dropOffMarker = dropOff ? [{
      id: dropOff.id,
      name: dropOff.name,
      latitude: dropOff.latitude,
      longitude: dropOff.longitude,
      type: 'dropoff' as const
    }] : [];

    return [...pickUpMarker, ...dropPointMarkers, ...dropOffMarker];
  };
  const markersToShow = getMarkersToShow();

  // Fit map to show all markers
  useEffect(() => {
    if (mapRef.current && markersToShow.length > 0) {
      const bounds = L.latLngBounds(
        markersToShow.map(m => [m.latitude, m.longitude] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickUp, dropOff]);

  // Set user location as map center on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setCenter([pos.coords.latitude, pos.coords.longitude]),
        err => console.error('Geolocation error:', err)
      );
    }
  }, []);

  // Routing effect
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old routing control if exists
    const map = mapRef.current;
    if ((map as any)._routingControl) {
      (map as any).removeControl((map as any)._routingControl);
    }

    // Only build route if pickup exists
    if (pickUp) {
      const waypoints: L.LatLng[] = [
        L.latLng(pickUp.latitude, pickUp.longitude),
        ...(pickUp.dropPoints || []).map(dp => L.latLng(dp.latitude, dp.longitude)),
      ];

      if (dropOff) {
        waypoints.push(L.latLng(dropOff.latitude, dropOff.longitude));
      }

      if (waypoints.length > 1) {
        const routingControl = (L as any).Routing.control({
          waypoints,
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
          show: false,
          lineOptions: {
            styles: [{ color: '#8B5CF6', weight: 4, opacity: 0.7 }]
          },
          
          // you can change this to your own OSRM server or Mapbox Directions API
          router: (L as any).Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' })
        }).addTo(map);

        (map as any)._routingControl = routingControl;
      }
    }
  }, [pickUp, dropOff]);

  const goToMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: LatLngExpression = [position.coords.latitude, position.coords.longitude];
          setCenter(newCenter);
          if (mapRef.current) {
            mapRef.current.setView(newCenter, SELECTEDBUS_ZOOM, {
              animate: true,
              duration: TRANSITION_DURATION / 1000
            });
          }
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  };

  const resetToDefaultView = () => {
    const defaultCenter: LatLngExpression = [DEFAULT_LATITUDE, DEFAULT_LONGITUDE];
    setCenter(defaultCenter);
    setZoom(DEFAULT_ZOOM);
    if (mapRef.current) {
      mapRef.current.setView(defaultCenter, DEFAULT_ZOOM, {
        animate: true,
        duration: TRANSITION_DURATION / 1000
      });
    }
  };

  const MapUpdater: React.FC = () => {
    const map = useMap();
    mapRef.current = map;
    useEffect(() => {
      map.setView([DEFAULT_LATITUDE, DEFAULT_LONGITUDE], DEFAULT_ZOOM);
    }, [map]);
    return null;
  };

  // Marker icon
  const createCustomIcon = (type: 'pickup' | 'droppoint' | 'dropoff') => {
    const colors = {
      pickup: '#10B981',
      droppoint: '#3B82F6',
      dropoff: '#EF4444'
    };
    const sizes = {
      pickup: 16,
      droppoint: 12,
      dropoff: 16
    };
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${colors[type]}; 
        width:${sizes[type]}px;height:${sizes[type]}px;
        border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);
      "></div>`,
      iconSize: [sizes[type]+4, sizes[type]+4],
      iconAnchor: [(sizes[type]+4)/2, (sizes[type]+4)/2]
    });
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <MapUpdater />
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
          attribution='&copy; Mapbox &copy; OpenStreetMap'
        />

        {markersToShow.map(marker => (
          <Marker
            key={marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={createCustomIcon(marker.type)}
          >
            <Popup>
              <strong>{marker.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <button
        onClick={goToMyLocation}
        className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg"
      >
        📍
      </button>
      <button
        onClick={resetToDefaultView}
        className="absolute top-16 right-4 bg-white rounded-full p-3 shadow-lg"
      >
        🔄
      </button>
    </div>
  );
};

export default MapComponent;
