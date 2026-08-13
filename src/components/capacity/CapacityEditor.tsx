'use client';

import { useHospital } from '@/contexts/HospitalContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { CapacityMetric } from '@/types/hospital';

// ============================================================
// CARE ROUTE — Capacity Editor
// ============================================================

export default function CapacityEditor() {
  const { capacity, updateCapacity } = useHospital();
  const [localCapacity, setLocalCapacity] = useState<Record<string, CapacityMetric>>(
    capacity.reduce((acc, curr) => ({ ...acc, [curr.id]: { ...curr } }), {})
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleNumberChange = (id: string, field: 'total' | 'occupied', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    setLocalCapacity(prev => {
      const updated = { ...prev[id], [field]: numValue };
      updated.available = updated.total - updated.occupied;
      return { ...prev, [id]: updated };
    });
  };

  const handleStatusChange = (id: string, status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE') => {
    setLocalCapacity(prev => ({
      ...prev,
      [id]: { ...prev[id], status }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate network delay
    setTimeout(() => {
      Object.values(localCapacity).forEach(metric => {
        updateCapacity(metric.id, metric);
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleReset = () => {
    setLocalCapacity(capacity.reduce((acc, curr) => ({ ...acc, [curr.id]: { ...curr } }), {}));
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {Object.values(localCapacity).map((metric) => (
          <div key={metric.id} className="p-6 border border-border/50 bg-background rounded-lg">
            <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-primary mb-4">
              {metric.name}
            </h3>

            {!metric.status ? (
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <label className="block text-[0.75rem] font-medium text-muted mb-1.5">Total Beds</label>
                  <input
                    type="number"
                    value={metric.total}
                    onChange={(e) => handleNumberChange(metric.id, 'total', e.target.value)}
                    className="w-full bg-white border border-border rounded-md px-3 py-2 text-[0.9375rem] text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/5 transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[0.75rem] font-medium text-muted mb-1.5">Occupied</label>
                  <input
                    type="number"
                    value={metric.occupied}
                    onChange={(e) => handleNumberChange(metric.id, 'occupied', e.target.value)}
                    className="w-full bg-white border border-border rounded-md px-3 py-2 text-[0.9375rem] text-primary focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/5 transition-all"
                  />
                </div>
                <div className="flex-1 pt-6 text-center">
                  <span className={`text-xl font-semibold ${metric.available > 0 ? 'text-success' : 'text-critical'}`}>
                    {metric.available}
                  </span>
                  <p className="text-[0.6875rem] text-muted">Available</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                {(['AVAILABLE', 'LIMITED', 'UNAVAILABLE'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(metric.id, status)}
                    className={`flex-1 py-2 text-[0.8125rem] font-medium rounded-md border transition-all ${
                      metric.status === status
                        ? status === 'AVAILABLE' ? 'bg-success/10 border-success/30 text-success' :
                          status === 'LIMITED' ? 'bg-warning/10 border-warning/30 text-warning' :
                          'bg-critical/10 border-critical/30 text-critical'
                        : 'bg-white border-border text-muted hover:border-primary/20 hover:text-primary'
                    }`}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex-1">
          {saveSuccess && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[0.875rem] font-medium text-success"
            >
              Capacity updated successfully.
            </motion.p>
          )}
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={handleReset} disabled={isSaving}>
            Reset
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
