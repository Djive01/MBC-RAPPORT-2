import React from 'react';
import { 
  TrendingUp, 
  BarChart, 
  PieChart as PieIcon, 
  Calendar, 
  DollarSign, 
  Coins, 
  Zap,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DailyReportItem, ExpenseCategoryItem } from '../types';
import { formatFC, formatUSD } from '../utils/formatters';
import { formatMonthLabel, getDateRangeLabel } from '../utils/monthUtils';
import { DateRangePicker } from './DateRangePicker';

interface AnalyticsViewProps {
  reports: DailyReportItem[];
  categories: ExpenseCategoryItem[];
  exchangeRate: number;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  availableMonths?: string[];
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (start: string, end: string) => void;
  onClearDateRange?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  reports,
  categories,
  exchangeRate,
  selectedMonth = '07/2026',
  onMonthChange,
  availableMonths = ['07/2026', '08/2026'],
  startDate = '',
  endDate = '',
  onDateRangeChange,
  onClearDateRange,
}) => {
  const periodLabel = getDateRangeLabel(startDate, endDate, selectedMonth);
  // Daily evolution data
  const chartData = reports.map((r) => {
    const safeRate = exchangeRate > 0 ? exchangeRate : 2850;
    const recettesCombUSD = (r.recettesUSD || 0) + (r.recettesFC || 0) / safeRate;
    const depensesCombUSD = (r.depensesUSD || 0) + (r.depensesFC || 0) / safeRate;
    const dayLabel = r.date ? (r.date.includes('/') ? r.date.split('/')[0] : r.date.split('-').slice(-1)[0]) : '';

    return {
      day: dayLabel,
      date: r.date || '',
      recettesFC: r.recettesFC || 0,
      recettesUSD: r.recettesUSD || 0,
      depensesFC: r.depensesFC || 0,
      depensesUSD: r.depensesUSD || 0,
      recettesCombUSD,
      depensesCombUSD,
      soldeCombUSD: recettesCombUSD - depensesCombUSD,
    };
  });

  // Calculate top performing revenue days
  const topDays = [...reports]
    .map((r) => ({
      ...r,
      totalUSD: r.recettesUSD + r.recettesFC / exchangeRate,
    }))
    .sort((a, b) => b.totalUSD - a.totalUSD)
    .slice(0, 5);

  const activeDaysCount = reports.filter((r) => !r.isRestDay).length;
  const totalRecettesFC = reports.reduce((acc, r) => acc + r.recettesFC, 0);
  const totalRecettesUSD = reports.reduce((acc, r) => acc + r.recettesUSD, 0);
  const avgDailyFC = activeDaysCount > 0 ? totalRecettesFC / activeDaysCount : 0;
  const avgDailyUSD = activeDaysCount > 0 ? totalRecettesUSD / activeDaysCount : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
            Synthèse Financière & Graphiques de Performance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyse comparative des flux de trésorerie — Période : <strong>{periodLabel}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center space-x-3 text-xs">
          {/* Month Selector */}
          <div className="flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg font-semibold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>Mois :</span>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange && onMonthChange(e.target.value)}
              className="bg-transparent font-extrabold text-indigo-900 focus:outline-none cursor-pointer pr-1"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {formatMonthLabel(m)}
                </option>
              ))}
              <option value="all">Tous les mois</option>
            </select>
          </div>

          {/* Date Range Selector */}
          {onDateRangeChange && onClearDateRange && (
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={onDateRangeChange}
              onClearDateRange={onClearDateRange}
            />
          )}

          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
            Moyenne/Jour (Ouvré): <strong className="text-slate-900">{formatFC(avgDailyFC)}</strong> / <strong className="text-indigo-600">{formatUSD(avgDailyUSD)}</strong>
          </div>
        </div>
      </div>

      {/* Main Evolution Area Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
          <BarChart className="w-4 h-4 mr-2 text-indigo-600" />
          Évolution Quotidienne des Recettes vs Dépenses (Equiv. USD)
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRecettes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
              <Tooltip formatter={(val: number) => formatUSD(val)} labelFormatter={(label) => `Jour ${label}`} />
              <Legend />
              <Area type="monotone" dataKey="recettesCombUSD" name="Recettes Globale ($)" stroke="#6366f1" fillOpacity={1} fill="url(#colorRecettes)" />
              <Area type="monotone" dataKey="depensesCombUSD" name="Dépenses Globale ($)" stroke="#e11d48" fillOpacity={1} fill="url(#colorDepenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of Secondary Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 5 High Revenue Days */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
            <Award className="w-4 h-4 mr-2 text-amber-500" />
            Top 5 Meilleures Journées de Recette
          </h3>
          <div className="space-y-3">
            {topDays.map((day, idx) => (
              <div key={day.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs sm:text-sm">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{day.date}</div>
                    <div className="text-xs text-slate-500">
                      Recette FC: {formatFC(day.recettesFC)} | USD: {formatUSD(day.recettesUSD)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-600">
                    {formatUSD(day.totalUSD)}
                  </div>
                  <div className="text-[11px] text-slate-400">Total Equiv.</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency Split Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-purple-600" />
              Ventilation par Devise (Francs vs Dollars)
            </h3>
            
            <div className="space-y-4">
              {/* Recettes Split */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Part des Recettes</span>
                  <span>4 486 800 FC / $1 298.50</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-600 h-full" style={{ width: '55%' }} title="Francs Congolais"></div>
                  <div className="bg-blue-600 h-full" style={{ width: '45%' }} title="Dollars USD"></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1"></span> FC (~55% val)
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mr-1"></span> USD (~45% val)
                  </span>
                </div>
              </div>

              {/* Dépenses Split */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Part des Dépenses</span>
                  <span>488 000 FC / $1 162.50</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-rose-500 h-full" style={{ width: '13%' }} title="Francs Congolais"></div>
                  <div className="bg-amber-500 h-full" style={{ width: '87%' }} title="Dollars USD"></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-1"></span> FC (13% val)
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> USD (87% val)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-purple-50 rounded-lg border border-purple-100 text-xs text-purple-900">
            <strong>Note Analytique:</strong> La majorité des dépenses d'équipements et consommables (toner, DTF, maintenance) s'effectue en USD ($), tandis que les encaissements s'équilibrent entre FC et USD.
          </div>
        </div>

      </div>

    </div>
  );
};
