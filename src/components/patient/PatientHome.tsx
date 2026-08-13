"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ChevronUp, ChevronDown, Activity, Accessibility } from 'lucide-react';
import Link from 'next/link';

import { Location } from '../../types/patient';
import { HospitalProfile } from '../../types/hospital';
import { MOCK_HOSPITALS } from '../../data/mockHospitals';
import { MOCK_CAPACITY } from '../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../data/mockSpecialists';
import { getCurrentLocation } from '../../lib/location/geolocation';
import { calculateDistance, calculateETA } from '../../lib/intelligence/etaService';

import dynamic from 'next/dynamic';
import LocationStatus from './LocationStatus';
import NearbyHospitals from './NearbyHospitals';

const HospitalMap = dynamic(() => import('./HospitalMap'), { ssr: false });

type FilterType = 'All' | 'Emergency' | 'ICU' | 'Specialists' | 'Available' | 'Accessibility';

export default function PatientHome() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationStatus, setLocationStatus] = useState<'LOADING' | 'GRANTED' | 'DENIED'>('LOADING');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  useEffect(() => {
    async function fetchLocation() {
      try {
        const loc = await getCurrentLocation();
        setUserLocation(loc);
        setLocationStatus('GRANTED');
      } catch (err) {
        setLocationStatus('DENIED');
        setUserLocation({ lat: 37.7749, lng: -122.4194 });
      }
    }
    fetchLocation();
  }, []);

  const filteredHospitals = useMemo(() => {
    let result = [...MOCK_HOSPITALS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h => {
        if (h.name.toLowerCase().includes(q)) return true;
        
        const specs = MOCK_SPECIALISTS[h.id] || [];
        if (specs.some(s => s.specialty.toLowerCase().includes(q))) return true;

        const cap = MOCK_CAPACITY[h.id] || [];
        if (cap.some(c => c.name.toLowerCase().includes(q))) return true;

        return false;
      });
    }

    if (activeFilter !== 'All') {
      result = result.filter(h => {
        const cap = MOCK_CAPACITY[h.id] || [];
        const specs = MOCK_SPECIALISTS[h.id] || [];

        switch (activeFilter) {
          case 'Emergency':
            return cap.some(c => c.name === 'Emergency' && c.status === 'AVAILABLE');
          case 'ICU':
            return cap.some(c => c.name === 'ICU' && c.available > 0);
          case 'Specialists':
            return specs.some(s => s.availableCount > 0);
          case 'Available':
            return h.networkStatus === 'OPERATIONAL';
          case 'Accessibility':
            return h.accessibilityFeatures && h.accessibilityFeatures.length > 0;
          default:
            return true;
        }
      });
    }

    if (userLocation) {
      result.sort((a, b) => {
        if (!a.coordinates || !b.coordinates) return 0;
        return calculateDistance(userLocation, a.coordinates) - calculateDistance(userLocation, b.coordinates);
      });
    }
    return result;
  }, [userLocation, searchQuery, activeFilter]);

  const SidebarContent = () => (
    <>
      <div className="p-6 pb-4 border-b border-[var(--cr-border)] bg-[var(--cr-background)]/50 shrink-0">
        <h2 className="text-2xl lg:text-3xl font-light text-editorial text-[var(--cr-primary)] mb-6">
          FIND THE RIGHT CARE,<br />NEAR YOU.
        </h2>
        
        <div className="flex flex-col gap-3">
          <Link 
            href="/find-care" 
            className="w-full flex items-center justify-center gap-2 bg-[var(--cr-primary)] hover:bg-[var(--cr-secondary)] text-white py-3.5 px-4 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Search size={18} />
            <span>Find the right hospital</span>
          </Link>
          
          <Link 
            href="/find-care" 
            className="w-full flex items-center justify-center gap-2 bg-white border border-[var(--cr-border)] hover:border-[var(--cr-sage)] hover:bg-[var(--cr-background)] text-[var(--cr-primary)] py-3 px-4 rounded-lg font-medium transition-colors"
          >
            <Activity size={18} className="text-[var(--cr-muted)]" />
            <span>I'm not sure what I need</span>
          </Link>
        </div>
      </div>

      <div className="p-6 pb-2 border-b border-[var(--cr-border)] bg-white shrink-0">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cr-muted)]" />
          <input 
            type="text" 
            placeholder="Search hospitals, specialties..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--cr-background)] border-none rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--cr-sage)] outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(['All', 'Emergency', 'ICU', 'Specialists', 'Available', 'Accessibility'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === f 
                ? 'bg-[var(--cr-primary)] text-white' 
                : 'bg-[var(--cr-background)] text-[var(--cr-muted)] hover:bg-[var(--cr-border)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-light text-[var(--cr-primary)] leading-none">{filteredHospitals.length}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--cr-muted)]">Suitable</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-light text-[var(--cr-primary)] leading-none">{MOCK_HOSPITALS.length}</span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--cr-muted)]">Nearby Network</span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 bg-[var(--cr-background)]">
        <NearbyHospitals 
          hospitals={filteredHospitals}
          userLocation={userLocation}
          selectedId={selectedHospitalId}
          onSelect={setSelectedHospitalId}
        />
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--cr-background)] text-[var(--cr-deep-text)]">
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-[var(--cr-border)] z-20 relative shadow-sm"
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold tracking-tight text-[var(--cr-primary)]">CARE ROUTE</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-[var(--cr-muted)]">
            <Link href="/care" className="text-[var(--cr-primary)]">Explore</Link>
            <Link href="/find-care" className="hover:text-[var(--cr-primary)] transition-colors">Find Care</Link>
            <Link href="/admin/dashboard" className="hover:text-[var(--cr-primary)] transition-colors">Referrals</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LocationStatus status={locationStatus} />
          <Link href="/login" className="text-sm font-medium hover:text-[var(--cr-primary)] transition-colors">Sign in</Link>
        </div>
      </motion.header>

      <main className="flex-grow flex relative overflow-hidden">
        
        {/* Desktop Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="hidden md:flex flex-col w-[450px] xl:w-[500px] flex-shrink-0 bg-white/80 backdrop-blur-xl border-r border-[var(--cr-border)] z-10 shadow-2xl overflow-hidden"
        >
          <SidebarContent />
        </motion.div>

        {/* Map Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-grow relative h-full bg-[var(--cr-background)]"
        >
          <HospitalMap 
            userLocation={userLocation}
            hospitals={filteredHospitals}
            selectedHospitalId={selectedHospitalId}
            onSelectHospital={setSelectedHospitalId}
            radiusKm={20}
          />
        </motion.div>

        {/* Mobile Bottom Sheet */}
        <AnimatePresence>
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: isMobileSheetOpen ? "0%" : "calc(100% - 60px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
            className="md:hidden absolute bottom-0 left-0 right-0 z-[400] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Drag Handle Area */}
            <div 
              className="flex-shrink-0 pt-4 pb-2 px-4 flex items-center justify-between border-b border-[var(--cr-border)] cursor-pointer bg-white z-10"
              onClick={() => setIsMobileSheetOpen(!isMobileSheetOpen)}
            >
              <div className="w-12 h-1.5 bg-[var(--cr-border)] rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3" />
              <span className="text-sm font-bold text-[var(--cr-primary)] pl-2 pt-2">{filteredHospitals.length} Hospitals</span>
              <button className="p-2 text-[var(--cr-muted)]">
                {isMobileSheetOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            </div>
            
            {/* Sheet Scrollable Content */}
            <div className="flex-grow overflow-y-auto bg-white">
              <SidebarContent />
            </div>
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
}
