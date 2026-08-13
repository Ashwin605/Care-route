"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { HospitalProfile } from '../../types/hospital';
import { Location } from '../../types/patient';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const createPatientIcon = () => {
  return L.divIcon({
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">
        <div style="position: absolute; width: 100%; height: 100%; background-color: #123B4A; border-radius: 50%; animation: pulse 2s infinite ease-out;"></div>
        <div style="position: relative; background-color: #123B4A; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    className: 'bg-transparent border-none',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const createDestinationIcon = () => {
  return L.divIcon({
    html: `
      <div style="background-color: #6F9690; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
    `,
    className: 'bg-transparent border-none',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Auto-zoom to fit route
const RouteFitter = ({ patientLoc, hospitalLoc, shouldFit }: { patientLoc: Location, hospitalLoc: Location, shouldFit: number }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || shouldFit === 0) return;
    try {
      const bounds = L.latLngBounds(
        [patientLoc.lat, patientLoc.lng],
        [hospitalLoc.lat, hospitalLoc.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } catch (e) {
      console.warn("Bounds error", e);
    }
  }, [patientLoc, hospitalLoc, map, shouldFit]);
  return null;
};

// Map controls overlay
const MapControls = ({ onRecenter }: { onRecenter: () => void }) => {
  const map = useMap();
  return (
    <div className="absolute right-4 bottom-8 z-[1000] flex flex-col gap-2">
      <button 
        onClick={() => map.zoomIn()}
        className="w-10 h-10 bg-white border border-[var(--cr-border)] rounded-full flex items-center justify-center text-[var(--cr-deep-text)] shadow-md hover:bg-gray-50"
      >
        <span className="text-xl leading-none font-medium">+</span>
      </button>
      <button 
        onClick={() => map.zoomOut()}
        className="w-10 h-10 bg-white border border-[var(--cr-border)] rounded-full flex items-center justify-center text-[var(--cr-deep-text)] shadow-md hover:bg-gray-50"
      >
        <span className="text-xl leading-none font-medium">-</span>
      </button>
      <button 
        onClick={onRecenter}
        className="w-10 h-10 bg-white border border-[var(--cr-border)] rounded-full flex items-center justify-center text-[var(--cr-primary)] shadow-md hover:bg-gray-50 mt-2"
        title="Route Overview"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
      </button>
    </div>
  );
};

interface ActiveRouteMapProps {
  patientLocation: Location;
  destination: HospitalProfile;
}


const hmrKey = Math.random().toString(36).substring(7);

export default function ActiveRouteMap({ patientLocation, destination }: ActiveRouteMapProps) {
  const [mountKey, setMountKey] = useState(0);
  const [fitTrigger, setFitTrigger] = useState(1);

  useEffect(() => {
    // Increment mountKey on every mount. This defeats React 18 StrictMode 
    // double-mounting by forcing a new key, and therefore a fresh DOM node.
    setMountKey(prev => prev + 1);
  }, []);

  if (mountKey === 0 || !destination.coordinates) {
    return <div className="w-full h-full bg-[var(--cr-background)] animate-pulse" />;
  }

  const routePositions: [number, number][] = [
    [patientLocation.lat, patientLocation.lng],
    [destination.coordinates.lat, destination.coordinates.lng]
  ];

  const finalKey = `route-map-${hmrKey}-${mountKey}`;

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        key={finalKey}
        center={[patientLocation.lat, patientLocation.lng]} 
        zoom={13} 
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        className="w-full h-full z-0"
      >
        <RouteFitter patientLoc={patientLocation} hospitalLoc={destination.coordinates} shouldFit={fitTrigger} />
        <MapControls onRecenter={() => setFitTrigger(prev => prev + 1)} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <Polyline 
        positions={routePositions} 
        color="#123B4A" 
        weight={4} 
        opacity={0.8}
        dashArray="10, 10"
        className="animate-pulse" // Simple hack for "moving" feel
      />

      <Marker position={[patientLocation.lat, patientLocation.lng]} icon={createPatientIcon()}>
        <Popup>En Route</Popup>
      </Marker>

      <Marker position={[destination.coordinates.lat, destination.coordinates.lng]} icon={createDestinationIcon()}>
        <Popup>Destination: {destination.name}</Popup>
      </Marker>
      </MapContainer>
    </div>
  );
}
