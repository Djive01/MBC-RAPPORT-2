import React, { useState } from 'react';
import { Calendar, CalendarDays, X, ArrowRight, Clock, Check, Filter } from 'lucide-react';
import { formatDateToFr, parseDateToISO } from '../utils/monthUtils';

interface DateRangePickerProps {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  onDateRangeChange: (startDate: string, endDate: string) => void;
  onClearDateRange: () => void;
  compact?: boolean; // For header or tight toolbar layouts
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate = '',
  endDate = '',
  onDateRangeChange,
  onClearDateRange,
  compact = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasRangeActive = Boolean(startDate || endDate);

  // Quick preset helper
  const handlePreset = (preset: 'today' | 'last7' | 'last30' | 'thisMonth') => {
    const now = new Date();
    const toISO = (d: Date) => d.toISOString().split('T')[0];

    if (preset === 'today') {
      const today = toISO(now);
      onDateRangeChange(today, today);
    } else if (preset === 'last7') {
      const start = new Date();
      start.setDate(now.getDate() - 6);
      onDateRangeChange(toISO(start), toISO(now));
    } else if (preset === 'last30') {
      const start = new Date();
      start.setDate(now.getDate() - 29);
      onDateRangeChange(toISO(start), toISO(now));
    } else if (preset === 'thisMonth') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      onDateRangeChange(toISO(start), toISO(end));
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button or Display Pill */}
      {hasRangeActive ? (
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border border-indigo-500 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs animate-fadeIn">
          <CalendarDays className="w-3.5 h-3.5 text-indigo-200 shrink-0" />
          <span>
            {startDate && endDate
              ? `Du ${formatDateToFr(startDate)} au ${formatDateToFr(endDate)}`
              : startDate
              ? `Dès le ${formatDateToFr(startDate)}`
              : `Jusqu'au ${formatDateToFr(endDate)}`}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClearDateRange();
            }}
            className="p-0.5 hover:bg-indigo-500 rounded text-indigo-200 hover:text-white transition-colors cursor-pointer"
            title="Effacer le filtre par plage de dates"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
            compact ? 'text-[11px] py-1' : ''
          }`}
          title="Filtrer les rapports par plage de dates personnalisée (du jour X au jour Y)"
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>Plage de Dates</span>
          <Filter className="w-3 h-3 text-slate-400 ml-0.5" />
        </button>
      )}

      {/* Popover Card */}
      {(isOpen || hasRangeActive) && (
        <div
          className={`mt-2 ${
            hasRangeActive ? 'block' : isOpen ? 'absolute left-0 z-40' : 'hidden'
          } bg-white border border-slate-200 rounded-xl shadow-xl p-3.5 w-72 sm:w-80 space-y-3 font-sans text-slate-800 text-xs`}
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <span>Période Personnalisée (Du... Au...)</span>
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => handlePreset('today')}
              className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded border border-slate-200 text-center transition-colors cursor-pointer"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => handlePreset('last7')}
              className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded border border-slate-200 text-center transition-colors cursor-pointer"
            >
              7 Derniers Jours
            </button>
            <button
              type="button"
              onClick={() => handlePreset('last30')}
              className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded border border-slate-200 text-center transition-colors cursor-pointer"
            >
              30 Derniers Jours
            </button>
            <button
              type="button"
              onClick={() => handlePreset('thisMonth')}
              className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded border border-slate-200 text-center transition-colors cursor-pointer"
            >
              Mois en Cours
            </button>
          </div>

          {/* Custom Date Inputs */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2">
              <label className="font-semibold text-slate-600 shrink-0">Du (Date X) :</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onDateRangeChange(e.target.value, endDate)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <label className="font-semibold text-slate-600 shrink-0">Au (Date Y) :</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onDateRangeChange(startDate, e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {hasRangeActive && (
              <button
                type="button"
                onClick={() => {
                  onClearDateRange();
                  setIsOpen(false);
                }}
                className="text-rose-600 hover:text-rose-700 font-semibold text-[11px] underline cursor-pointer"
              >
                Réinitialiser
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-auto px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Appliquer le filtre
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
