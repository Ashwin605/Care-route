'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { MOCK_CAPACITY } from '@/data/mockHospitalCapacity';
import { Search, Stethoscope, ChevronRight, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminResourcesPage() {
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
            RESOURCE MANAGEMENT
          </h1>
          <h2 className="text-3xl font-light text-[var(--cr-deep-text)] tracking-tight">
            Network Resources
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
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Blood Bank</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Dialysis</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-[var(--cr-muted)]">Cardiac Cath Lab</th>
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
                  const bloodBank = caps.find(c => c.name.toLowerCase().includes('blood'));
                  const dialysis = caps.find(c => c.name.toLowerCase().includes('dialysis'));
                  const cathLab = caps.find(c => c.name.toLowerCase().includes('cath'));

                  const getStatusBadge = (status?: string) => {
                    switch(status) {
                      case 'AVAILABLE': return <span className="text-[var(--cr-success)] flex items-center gap-1 font-bold"><CheckCircle2 size={14}/> Available</span>;
                      case 'LIMITED': return <span className="text-[var(--cr-warning)] flex items-center gap-1 font-bold"><AlertTriangle size={14}/> Limited</span>;
                      case 'UNAVAILABLE': return <span className="text-[var(--cr-danger)] flex items-center gap-1 font-bold"><XCircle size={14}/> Unavailable</span>;
                      default: return <span className="text-gray-300">--</span>;
                    }
                  };

                  return (
                    <tr key={h.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[var(--cr-deep-text)] uppercase flex items-center gap-2">
                          <Stethoscope size={16} className="text-[var(--cr-muted)]" />
                          {h.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(bloodBank?.status)}</td>
                      <td className="px-6 py-4">{getStatusBadge(dialysis?.status)}</td>
                      <td className="px-6 py-4">{getStatusBadge(cathLab?.status)}</td>
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
