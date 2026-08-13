'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { MOCK_CAPACITY } from '@/data/mockHospitalCapacity';
import { Search, BedDouble, ChevronRight, AlertTriangle } from 'lucide-react';

export default function AdminCapacityPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = MOCK_HOSPITALS.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--cr-border)] pb-6">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[var(--cr-primary)] mb-1">
            CAPACITY MANAGEMENT
          </h1>
          <h2 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight">
            Network Capacity
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cr-muted)]" size={18} />
        <input 
          type="text" 
          placeholder="Search by hospital name or ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-3 bg-white border border-[var(--cr-border)] rounded-lg focus:outline-none focus:border-[var(--cr-primary)] focus:ring-1 focus:ring-[var(--cr-primary)] transition-all text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-[var(--cr-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--cr-background)] border-b border-[var(--cr-border)]">
              <tr>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Hospital</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">ICU Available</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Gen. Beds Available</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Ventilators Available</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--cr-border)]">
              {filteredHospitals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--cr-muted)] font-medium">
                    No hospitals found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredHospitals.map(h => {
                  const caps = MOCK_CAPACITY[h.id] || [];
                  const icu = caps.find(c => c.name.toLowerCase().includes('icu'));
                  const beds = caps.find(c => c.name.toLowerCase().includes('general beds'));
                  const vents = caps.find(c => c.name.toLowerCase().includes('ventilator'));

                  const renderCap = (c: any) => {
                    if (!c) return <span className="text-gray-300">--</span>;
                    const pct = c.total > 0 ? (c.available / c.total) * 100 : 0;
                    const isLow = pct < 15 || c.available === 0;
                    return (
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isLow ? 'text-[var(--cr-danger)]' : 'text-[var(--cr-deep-text)]'}`}>
                          {c.available}
                        </span>
                        <span className="text-[var(--cr-muted)] text-xs">/ {c.total}</span>
                        {isLow && <AlertTriangle size={14} className="text-[var(--cr-danger)]" />}
                      </div>
                    );
                  };

                  return (
                    <tr key={h.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[var(--cr-deep-text)] uppercase flex items-center gap-2">
                          <BedDouble size={16} className="text-[var(--cr-muted)]" />
                          {h.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">{renderCap(icu)}</td>
                      <td className="px-6 py-4">{renderCap(beds)}</td>
                      <td className="px-6 py-4">{renderCap(vents)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/resources/${h.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--cr-primary)] bg-[var(--cr-primary)]/5 hover:bg-[var(--cr-primary)]/10 px-3 py-2 rounded transition-colors"
                        >
                          Manage <ChevronRight size={14}/>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
