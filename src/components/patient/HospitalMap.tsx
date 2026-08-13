"use client";

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HospitalProfile } from '../../types/hospital';
import { Location } from '../../types/patient';
import { HospitalCandidateState } from '../../types/intelligence';
import HospitalPreview from './HospitalPreview';
import { LucideCross, LucideActivity } from 'lucide-react';

// Fix for default Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Create custom icons based on CARE ROUTE aesthetic
const createCustomIcon = (status: string, isSelected: boolean) => {
  let color = '#123B4A'; // cr-primary
  let iconSvg = '<path d="M12 2v20M2 12h20"/>'; // Default Plus
  
  if (status === 'OPERATIONAL') {
    iconSvg = '<polyline points="20 6 9 17 4 12"></polyline>'; // Check
  } else if (status === 'LIMITED') {
    color = '#A98245'; // cr-warning
    iconSvg = '<line x1="5" y1="12" x2="19" y2="12"></line>'; // Minus
  } else if (status === 'DEGRADED') {
    color = '#A98245'; // cr-warning
    iconSvg = '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>'; // Triangle Warning
  } else if (status === 'MAINTENANCE' || status === 'UNAVAILABLE') {
    color = '#68757A'; // cr-muted
    iconSvg = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'; // Cross
  }
  
  const size = isSelected ? 36 : 28;
  const shadowClass = isSelected ? 'drop-shadow-lg' : 'drop-shadow-sm';
  const borderClass = isSelected ? 'border-2 border-white' : 'border border-white/50';

  const html = `
    <div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.2s ease;
    " class="${shadowClass} ${borderClass}">
      <svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        ${iconSvg}
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-hospital-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const createIntelligenceIcon = (state: HospitalCandidateState, isSelected: boolean) => {
  let color = '#68757A'; // INELIGIBLE / UNAVAILABLE / STALE (muted)
  if (state === 'RECOMMENDED') color = '#123B4A'; // cr-primary
  if (state === 'ELIGIBLE') color = '#6F9690'; // cr-secondary
  if (state === 'AT_RISK') color = '#A98245'; // cr-warning
  
  const size = isSelected ? 36 : (state === 'INELIGIBLE' ? 20 : 28);
  const opacity = state === 'INELIGIBLE' ? 0.4 : 1;
  const shadowClass = isSelected ? 'drop-shadow-lg' : 'drop-shadow-sm';
  const borderClass = isSelected ? 'border-2 border-white' : 'border border-white/50';

  const html = `
    <div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: ${opacity};
      transition: all 0.2s ease;
    " class="${shadowClass} ${borderClass}">
      ${state !== 'INELIGIBLE' ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${state === 'RECOMMENDED' ? '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' : '<path d="M12 2v20M2 12h20"/>'}
        </svg>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'intelligence-hospital-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const createPatientIcon = () => {
  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #6F9690;
        border-radius: 50%;
        animation: pulse 2s infinite ease-out;
      "></div>
      <div style="
        position: relative;
        background-color: #6F9690;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2.5); opacity: 0; }
      }
    </style>
  `;
  return L.divIcon({
    html,
    className: 'patient-location-marker bg-transparent border-none',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// Component to dynamically update map center
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    try {
      map.setView(center, map.getZoom(), { animate: false });
    } catch (e) {
      console.warn('MapUpdater suppressed an error (likely HMR/StrictMode related):', e);
    }
  }, [center, map]);
  return null;
};

interface HospitalMapProps {
  userLocation: Location | null;
  hospitals: HospitalProfile[];
  selectedHospitalId: string | null;
  onSelectHospital: (id: string) => void;
  radiusKm?: number;
  intelligenceStates?: Record<string, HospitalCandidateState>;
}

const hmrKey = Math.random().toString(36).substring(7);

export default function HospitalMap({
  userLocation,
  hospitals,
  selectedHospitalId,
  onSelectHospital,
  radiusKm,
  intelligenceStates
}: HospitalMapProps) {
  const [mountKey, setMountKey] = React.useState(0);

  React.useEffect(() => {
    // Increment mountKey on every mount. This defeats React 18 StrictMode 
    // double-mounting by forcing a new key, and therefore a fresh DOM node.
    setMountKey(prev => prev + 1);
  }, []);

  // Calculate map center based on selection or user location
  const center: [number, number] = useMemo(() => {
    if (selectedHospitalId) {
      const selected = hospitals.find(h => h.id === selectedHospitalId);
      if (selected?.coordinates) {
        return [selected.coordinates.lat, selected.coordinates.lng];
      }
    }
    return userLocation ? [userLocation.lat, userLocation.lng] : [37.7749, -122.4194];
  }, [selectedHospitalId, hospitals, userLocation]);

  if (mountKey === 0) {
    return (
      <div className="w-full h-full bg-[var(--cr-background)] rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-[var(--cr-primary)] border-t-transparent animate-spin opacity-50"></div>
      </div>
    );
  }

  const finalKey = `map-${hmrKey}-${mountKey}`;

  return (
    <div className="w-full h-full relative bg-[var(--cr-background)] z-0 rounded-xl overflow-hidden shadow-inner">
      <MapContainer 
        key={finalKey}
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false}
      >
        <MapUpdater center={center} />
        {/* Subtle, restrained map style (CartoDB Positron is light and unbranded) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {userLocation && (
          <>
            {radiusKm && (
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={radiusKm * 1000}
                pathOptions={{
                  color: '#6F9690',
                  fillColor: '#6F9690',
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: '4 4'
                }}
              />
            )}
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={createPatientIcon()}
            >
              <Popup className="patient-popup">
                <span className="text-sm font-medium text-[var(--cr-deep-text)]">Your Location</span>
              </Popup>
            </Marker>
          </>
        )}

        {hospitals.map((hospital) => {
          if (!hospital.coordinates) return null;
          const isSelected = selectedHospitalId === hospital.id;
          return (
            <Marker
              key={hospital.id}
              position={[hospital.coordinates.lat, hospital.coordinates.lng]}
              icon={intelligenceStates && intelligenceStates[hospital.id]
                ? createIntelligenceIcon(intelligenceStates[hospital.id], isSelected)
                : createCustomIcon(hospital.networkStatus, isSelected)
              }
              eventHandlers={{
                click: () => onSelectHospital(hospital.id),
              }}
            >
              {isSelected && (
                <Popup closeButton={false} autoPan={false}>
                  <HospitalPreview hospital={hospital} />
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
