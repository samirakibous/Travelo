'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Coords = { lat: number; lng: number };

const markerIcon = L.divIcon({
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  html: `<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="#1a73e8" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  </div>`,
});

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 50);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function GeolocationController({ onLocated }: { onLocated: (c: Coords) => void }) {
  const map = useMap();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const c = { lat: coords.latitude, lng: coords.longitude };
        map.setView([c.lat, c.lng], 13);
        onLocated(c);
      },
      () => {},
    );
  }, [map, onLocated]);
  return null;
}

function ClickHandler({ onChange }: { onChange: (c: Coords) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

type Props = {
  value: Coords | null;
  onChange: (coords: Coords) => void;
};

export default function LocationPickerMap({ value, onChange }: Props) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResizer />
      <GeolocationController onLocated={onChange} />
      <ClickHandler onChange={onChange} />
      {value && <Marker position={[value.lat, value.lng]} icon={markerIcon} />}
    </MapContainer>
  );
}
