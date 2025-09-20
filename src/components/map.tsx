import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidGhlbG9jYWxnb2RkIiwiYSI6ImNtMm9ocHFhYTBmczQya3NnczhoampiZ3gifQ.lPNutwk6XRi_kH_1R1ebiw';

// Default values
const DEFAULT_LONGITUDE = -1.573568;
const DEFAULT_LATITUDE = 6.678045;
const DEFAULT_ZOOM = 16.95;
const TRANSITION_DURATION = 500;
const SELECTEDBUS_ZOOM = 16.95;

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const MapComponent = () => {
  const [center, setCenter] = useState<LatLngExpression>([DEFAULT_LATITUDE, DEFAULT_LONGITUDE]);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  const mapRef = useRef<L.Map | null>(null);

  // Sample locations from your screenshot
  const locations: Location[] = [
    { id: '1', name: 'MS O', latitude: 6.685, longitude: -1.582 },
    { id: '2', name: 'Bomso Road', latitude: 6.680, longitude: -1.575 },
    { id: '3', name: 'Tech Hospital', latitude: 6.678, longitude: -1.570 },
    { id: '4', name: 'JANUST Primary Road', latitude: 6.677, longitude: -1.565 },
    { id: '5', name: 'Werve', latitude: 6.673, longitude: -1.562 },
    { id: '6', name: 'KNUST Botanical Garden', latitude: 6.671, longitude: -1.558 },
    { id: '7', name: 'Kwame Nkrumah University of Science & Technology', latitude: 6.669, longitude: -1.553 },
    { id: '8', name: 'Paa Joe Stadium', latitude: 6.667, longitude: -1.560 },
    { id: '9', name: 'Ayeduase Road', latitude: 6.664, longitude: -1.565 },
    { id: '10', name: 'Obaapa R. Restaurant', latitude: 6.662, longitude: -1.570 },
    { id: '11', name: 'Frontline Inn Hostel', latitude: 6.660, longitude: -1.575 },
    { id: '12', name: 'Bells Kitchen', latitude: 6.658, longitude: -1.580 },
  ];

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

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
        (error) => {
          console.error('Geolocation error:', error);
        }
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

  // Component to handle map updates
  const MapUpdater: React.FC = () => {
    const map = useMap();
    mapRef.current = map;
    
    // Set initial view with smooth transition
    useEffect(() => {
      if (map) {
        map.setView([DEFAULT_LATITUDE, DEFAULT_LONGITUDE], DEFAULT_ZOOM, {
          animate: true,
          duration: TRANSITION_DURATION / 1000
        });
      }
    }, [map]);
    
    return null;
  };

  // Custom icon for markers
  const createCustomIcon = (color: string = 'green') => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  };

  const zoomToLocation = (location: Location) => {
    const newCenter: LatLngExpression = [location.latitude, location.longitude];
    setCenter(newCenter);
    if (mapRef.current) {
      mapRef.current.setView(newCenter, SELECTEDBUS_ZOOM, {
        animate: true,
        duration: TRANSITION_DURATION / 1000
      });
    }
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <MapUpdater />
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`}
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => zoomToLocation(location),
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{location.name}</strong>
                <button 
                  className="mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  onClick={() => zoomToLocation(location)}
                >
                  Zoom In
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Location Button */}
      <button
        onClick={goToMyLocation}
        className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition z-10"
        title="Go to my location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Reset View Button */}
      <button
        onClick={resetToDefaultView}
        className="absolute top-16 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition z-10"
        title="Reset to default view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Scale Control */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-md text-xs z-10">
        <div className="flex items-center">
          <div className="w-16 h-1 bg-gray-600 mr-2"></div>
          <span>1 km</span>
        </div>
      </div>

      {/* Compass */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md flex flex-col items-center z-10">
        <div className="text-xs text-gray-500 mb-1">N</div>
        <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-green-600"></div>
        </div>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow-md text-xs z-10">
        Zoom: {zoom.toFixed(1)}
      </div>
    </div>
  );
};

export default MapComponent;