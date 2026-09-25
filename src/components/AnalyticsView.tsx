import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart, 
  Calendar, 
  DollarSign, 
  Coins, 
  Zap,
  Award,
  ArrowUpRight,
  Flame,
  Activity,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Printer
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { DailyReportItem, ExpenseCategoryItem } from '../types';
import { formatFC, formatUSD } from '../utils/formatters';
import { formatMonthLabel, getDateRangeLabel } from '../utils/monthUtils';
import { calculateAnalyticsData, EnrichedDailyChartItem } from '../utils/analyticsUtils';
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
  onPrintCharts?: () => void;
}

type ChartMetricMode = 'combUSD' | 'bidevise' | 'fc' | 'usd';

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
  onPrintCharts,
}) => {
  const periodLabel = getDateRangeLabel(startDate, endDate, selectedMonth);
  const safeRate = exchangeRate > 0 ? exchangeRate : 2850;

  // Chart configuration state
  const [metricMode, setMetricMode] = useState<ChartMetricMode>('combUSD');
  const [showAverageLine, setShowAverageLine] = useState<boolean>(true);
  const [showPeaks, setShowPeaks] = useState<boolean>(true);
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);
  const [showComparativeCashflow, setShowComparativeCashflow] = useState<boolean>(true);

  // Calculate rich analytics and peak metrics
  const {
    chartData,
    maxPeakDay,
    peakDaysCount,
    avgDailyUSD,
    avgDailyFC,
    totalRecettesCombUSD,
    totalRecettesFC,
    totalRecettesUSD,
    totalDepensesFC,
    totalDepensesUSD,
    totalDepensesCombUSD,
    topPeakDays,
    pctRecettesFC,
    pctRecettesUSD,
    pctDepensesFC,
    pctDepensesUSD,
  } = useMemo(() => {
    return calculateAnalyticsData(reports, safeRate, selectedMonth, startDate, endDate);
  }, [reports, safeRate, selectedMonth, startDate, endDate]);

  // Custom Dot component with peak visualization
  const renderCustomPeakDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || isNaN(cx) || isNaN(cy) || !payload) return null;

    const isSelected = highlightedDate === payload.date;

    // Absolute Maximum Peak of the month
    if (payload.isMaxPeak && showPeaks) {
      return (
        <g key={`max-peak-${payload.date}`} className="cursor-pointer" onClick={() => setHighlightedDate(payload.date)}>
          <circle cx={cx} cy={cy} r={14} fill="#f59e0b" fillOpacity={0.25} className="animate-pulse" />
          <circle cx={cx} cy={cy} r={8} fill="#f59e0b" stroke="#ffffff" strokeWidth={2.5} />
          <circle cx={cx} cy={cy} r={3.5} fill="#ffffff" />
        </g>
      );
    }

    // High Activity Peak
    if (payload.isPeak && showPeaks) {
      return (
        <g key={`peak-${payload.date}`} className="cursor-pointer" onClick={() => setHighlightedDate(payload.date)}>
          <circle cx={cx} cy={cy} r={10} fill="#6366f1" fillOpacity={0.25} />
          <circle cx={cx} cy={cy} r={6} fill="#6366f1" stroke="#ffffff" strokeWidth={2} />
          <circle cx={cx} cy={cy} r={2} fill="#ffffff" />
        </g>
      );
    }

    // Highlighted via chip click
    if (isSelected) {
      return (
        <g key={`selected-${payload.date}`}>
          <circle cx={cx} cy={cy} r={10} fill="#ec4899" fillOpacity={0.3} />
          <circle cx={cx} cy={cy} r={6} fill="#ec4899" stroke="#ffffff" strokeWidth={2} />
        </g>
      );
    }

    // Rest Day
    if (payload.isRestDay) {
      return <circle key={`rest-${payload.date}`} cx={cx} cy={cy} r={2.5} fill="#cbd5e1" stroke="#ffffff" strokeWidth={1} />;
    }

    // Standard day dot
    return <circle key={`dot-${payload.date}`} cx={cx} cy={cy} r={3.5} fill="#818cf8" stroke="#ffffff" strokeWidth={1.5} />;
  };

  // Custom Rich Tooltip for Line Chart
  const CustomLineTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0]?.payload;
    if (!data) return null;

    const isPeak = data.isPeak && showPeaks;
    const isMax = data.isMaxPeak && showPeaks;

    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-slate-700/80 text-xs min-w-[240px] z-50 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2.5">
          <div>
            <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
              <span>{data.dayOfWeek}</span>
              <span className="text-slate-400 font-normal">{data.date}</span>
            </div>
          </div>
          {isMax ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-extrabold flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              RECORD MOIS
            </span>
          ) : isPeak ? (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-extrabold flex items-center gap-1">
              <Flame className="w-3 h-3 text-indigo-400" />
              PIC D'ACTIVITÉ
            </span>
          ) : data.isRestDay ? (
            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px]">
              Repos
            </span>
          ) : null}
        </div>

        {/* Breakdown metrics */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center bg-slate-800/80 px-2 py-1 rounded">
            <span className="text-slate-400 font-medium">Recette Totale ($ Equiv) :</span>
            <span className="font-extrabold text-emerald-400 text-sm">{formatUSD(data.recettesCombUSD)}</span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
            <div className="bg-slate-800/50 p-1.5 rounded">
              <div className="text-slate-400 text-[10px]">Francs Congolais</div>
              <div className="font-semibold text-emerald-300">{formatFC(data.recettesFC)}</div>
            </div>
            <div className="bg-slate-800/50 p-1.5 rounded">
              <div className="text-slate-400 text-[10px]">Dollars USD</div>
              <div className="font-semibold text-blue-300">{formatUSD(data.recettesUSD)}</div>
            </div>
          </div>

          {/* Comparison vs average */}
          {avgDailyUSD > 0 && !data.isRestDay && (
            <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-700/50">
              <span className="text-slate-400">Écart vs Moyenne :</span>
              <span className={`font-bold flex items-center gap-0.5 ${data.percentAboveAvg >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {data.percentAboveAvg >= 0 ? `+${data.percentAboveAvg}%` : `${data.percentAboveAvg}%`}
                {data.percentAboveAvg >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : null}
              </span>
            </div>
          )}

          {data.notes && (
            <div className="pt-1 text-[10px] text-slate-400 italic line-clamp-2">
              Note : {data.notes}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Period, Filters & Separate Print Button */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Analytics & Suivi Quotidien des Recettes
              </h2>
              <p className="text-xs text-slate-500">
                Visualisation chronologique des flux d'encaissement et détection des pics d'activité — <strong>{periodLabel}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Dedicated Chart Print Button */}
          {onPrintCharts && (
            <button
              onClick={onPrintCharts}
              className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              title="Ouvrir l'aperçu et imprimer les graphiques et pics d'activité à part (A4 / PDF)"
            >
              <Printer className="w-4 h-4 text-indigo-200" />
              <span>Imprimer les graphiques à part</span>
            </button>
          )}

          {/* Month Selector */}
          <div className="flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg font-semibold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="text-slate-600">Mois :</span>
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

          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-700">
            Taux : <strong className="text-slate-900">1$ = {safeRate} FC</strong>
          </div>
        </div>
      </div>

      {/* KPI Cards: Activity Peaks & Revenue Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Peak Record Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-white rounded-xl border border-amber-200 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-amber-200/40 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Pic Record du Mois
            </span>
            {maxPeakDay && (
              <span className="text-[10px] bg-amber-500 text-white font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                {maxPeakDay.date}
              </span>
            )}
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-amber-900 tracking-tight">
              {maxPeakDay ? formatUSD(maxPeakDay.recettesCombUSD) : '$0.00'}
            </div>
            <div className="text-xs text-amber-700 mt-1 flex items-center justify-between">
              <span>{maxPeakDay ? `${formatFC(maxPeakDay.recettesFC)} + ${formatUSD(maxPeakDay.recettesUSD)}` : '-'}</span>
              {maxPeakDay && maxPeakDay.percentAboveAvg > 0 && (
                <span className="font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded text-[11px]">
                  +{maxPeakDay.percentAboveAvg}% vs moy.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Daily Average Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-600" />
              Moyenne / Jour Ouvré
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md border border-indigo-100">
              Activité
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatUSD(avgDailyUSD)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span>Soit env. <strong className="text-slate-700">{formatFC(avgDailyFC)}</strong></span>
              <span className="text-slate-400 text-[11px]">par jour</span>
            </div>
          </div>
        </div>

        {/* High Activity Days Count */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              Journées de Forte Affluence
            </span>
            <span className="text-[10px] bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-md border border-rose-100">
              Pics
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1.5">
              <span>{peakDaysCount}</span>
              <span className="text-xs font-medium text-slate-400">jours de pic</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Recette &gt; +20% au-dessus de la moyenne
            </div>
          </div>
        </div>

        {/* Total Period Revenue */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600" />
              Recette Globale Période
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md border border-emerald-100">
              Total
            </span>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-emerald-700 tracking-tight">
              {formatUSD(totalRecettesCombUSD)}
            </div>
            <div className="text-xs text-slate-500 mt-1 truncate">
              {formatFC(totalRecettesFC)} | {formatUSD(totalRecettesUSD)}
            </div>
          </div>
        </div>

      </div>

      {/* Main Linear Recharts Chart: Daily Revenue Evolution & Peaks */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        
        {/* Chart Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100/70 text-indigo-700 rounded-md">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Évolution Linéaire Quotidienne des Recettes & Pics d'Activité
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Courbe Recharts détaillée du mois sélectionné avec repérage immédiat des pics d'encaissement et de la moyenne
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Direct Quick Chart Print Button */}
            {onPrintCharts && (
              <button
                onClick={onPrintCharts}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md font-bold text-xs transition-colors cursor-pointer"
                title="Imprimer ce graphique et les statistiques d'activité à part"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-600" />
                <span>Imprimer ce graphique</span>
              </button>
            )}

            {/* Metric Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setMetricMode('combUSD')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  metricMode === 'combUSD'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Équiv. USD ($)
              </button>
              <button
                onClick={() => setMetricMode('bidevise')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  metricMode === 'bidevise'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bidevise (FC & $)
              </button>
              <button
                onClick={() => setMetricMode('fc')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  metricMode === 'fc'
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Francs (FC)
              </button>
              <button
                onClick={() => setMetricMode('usd')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  metricMode === 'usd'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dollars ($)
              </button>
            </div>
          </div>
        </div>

        {/* Chart View Toggles & Legends */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPeaks}
                onChange={(e) => setShowPeaks(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="font-medium text-slate-700 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Marquer les pics d'activité
              </span>
            </label>

            {metricMode !== 'bidevise' && (
              <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showAverageLine}
                  onChange={(e) => setShowAverageLine(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                  Afficher la moyenne quotidienne
                </span>
              </label>
            )}
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-xs inline-block"></span>
              <strong className="text-slate-700">Record du mois</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
              <span className="text-slate-600">Pic d'activité</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
              <span className="text-slate-500">Jour de repos</span>
            </span>
          </div>
        </div>

        {/* Recharts Responsive Line Chart */}
        <div className="h-80 sm:h-96 w-full pt-2">
          {chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-300" />
              <p className="text-sm">Aucune donnée de recette disponible pour la période sélectionnée.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  stroke="#cbd5e1"
                  tickLine={false}
                />

                {metricMode === 'bidevise' ? (
                  <>
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      tick={{ fontSize: 11, fill: '#059669' }} 
                      stroke="#059669"
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k FC`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tick={{ fontSize: 11, fill: '#2563eb' }} 
                      stroke="#2563eb"
                      tickFormatter={(val) => `$${val}`}
                    />
                  </>
                ) : (
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    stroke="#cbd5e1"
                    tickFormatter={(val) => {
                      if (metricMode === 'fc') {
                        return val >= 1000 ? `${(val / 1000).toFixed(0)}k FC` : `${val} FC`;
                      }
                      return `$${val}`;
                    }}
                  />
                )}

                <Tooltip content={<CustomLineTooltip />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />

                {/* Average Reference Line */}
                {showAverageLine && metricMode === 'combUSD' && avgDailyUSD > 0 && (
                  <ReferenceLine
                    y={avgDailyUSD}
                    stroke="#6366f1"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Moyenne (${formatUSD(avgDailyUSD)})`,
                      position: 'insideTopRight',
                      fill: '#4f46e5',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                )}

                {showAverageLine && metricMode === 'fc' && avgDailyFC > 0 && (
                  <ReferenceLine
                    y={avgDailyFC}
                    stroke="#059669"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Moyenne (${formatFC(avgDailyFC)})`,
                      position: 'insideTopRight',
                      fill: '#059669',
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                )}

                {/* Maximum Peak Record Marker */}
                {maxPeakDay && showPeaks && metricMode === 'combUSD' && (
                  <ReferenceDot
                    x={maxPeakDay.day}
                    y={maxPeakDay.recettesCombUSD}
                    r={7}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                )}

                {/* Lines depending on selected mode */}
                {metricMode === 'combUSD' && (
                  <Line
                    type="monotone"
                    dataKey="recettesCombUSD"
                    name="Recettes Équivalentes ($ USD)"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={renderCustomPeakDot}
                    activeDot={{ r: 8, stroke: '#4338ca', strokeWidth: 3, fill: '#ffffff' }}
                  />
                )}

                {metricMode === 'bidevise' && (
                  <>
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="recettesFC"
                      name="Recettes Francs Congolais (FC)"
                      stroke="#059669"
                      strokeWidth={2.5}
                      dot={showPeaks ? renderCustomPeakDot : { r: 3, fill: '#059669' }}
                      activeDot={{ r: 7, stroke: '#047857', strokeWidth: 2, fill: '#ffffff' }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="recettesUSD"
                      name="Recettes Dollars ($ USD)"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      dot={showPeaks ? renderCustomPeakDot : { r: 3, fill: '#2563eb' }}
                      activeDot={{ r: 7, stroke: '#1d4ed8', strokeWidth: 2, fill: '#ffffff' }}
                    />
                  </>
                )}

                {metricMode === 'fc' && (
                  <Line
                    type="monotone"
                    dataKey="recettesFC"
                    name="Recettes en Francs Congolais (FC)"
                    stroke="#059669"
                    strokeWidth={3}
                    dot={renderCustomPeakDot}
                    activeDot={{ r: 8, stroke: '#047857', strokeWidth: 3, fill: '#ffffff' }}
                  />
                )}

                {metricMode === 'usd' && (
                  <Line
                    type="monotone"
                    dataKey="recettesUSD"
                    name="Recettes en Dollars ($ USD)"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={renderCustomPeakDot}
                    activeDot={{ r: 8, stroke: '#1d4ed8', strokeWidth: 3, fill: '#ffffff' }}
                  />
                )}

              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Peak Days Navigator (Chips) */}
        {topPeakDays.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Accès rapide aux journées de pic :</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5">
              {topPeakDays.map((day, idx) => {
                const isSelected = highlightedDate === day.date;
                return (
                  <button
                    key={day.date}
                    onClick={() => setHighlightedDate(isSelected ? null : day.date)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs font-bold'
                        : idx === 0
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {idx === 0 ? <Award className="w-3 h-3 text-amber-600" /> : <Flame className="w-3 h-3 text-indigo-500" />}
                    <span>{day.date}</span>
                    <strong className="text-[11px]">{formatUSD(day.recettesCombUSD)}</strong>
                  </button>
                );
              })}
              {highlightedDate && (
                <button
                  onClick={() => setHighlightedDate(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs underline ml-1"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Grid of Secondary Performance Analysis: Top Days & Currency Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 5 High Revenue Days Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Award className="w-4 h-4 mr-2 text-amber-500" />
              Top 5 Meilleures Journées de Recette
            </h3>
            <span className="text-[11px] text-slate-500">Classement décroissant</span>
          </div>

          <div className="space-y-2.5">
            {topPeakDays.map((day, idx) => (
              <div 
                key={day.date} 
                onClick={() => setHighlightedDate(highlightedDate === day.date ? null : day.date)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                  highlightedDate === day.date
                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full text-white font-extrabold flex items-center justify-center text-xs shadow-xs ${
                    idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-700' : 'bg-indigo-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{day.dayOfWeek} {day.date}</span>
                      {idx === 0 && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.2 rounded">
                          RECORD
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      FC: {formatFC(day.recettesFC)} | USD: {formatUSD(day.recettesUSD)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-emerald-600 text-sm">
                    {formatUSD(day.recettesCombUSD)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {day.percentAboveAvg > 0 ? `+${day.percentAboveAvg}% vs moy.` : 'Équiv. USD'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Currency Split & Distribution Analysis */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-purple-600" />
                Ventilation par Devise (Francs vs Dollars)
              </h3>
              <span className="text-[11px] text-slate-500">Calcul dynamique sur la période</span>
            </div>
            
            <div className="space-y-4">
              {/* Recettes Split */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Part des Recettes</span>
                  <span>{formatFC(totalRecettesFC)} / {formatUSD(totalRecettesUSD)}</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    className="bg-emerald-600 h-full transition-all duration-500" 
                    style={{ width: `${pctRecettesFC}%` }} 
                    title={`Francs Congolais (${pctRecettesFC}%)`}
                  />
                  <div 
                    className="bg-blue-600 h-full transition-all duration-500" 
                    style={{ width: `${pctRecettesUSD}%` }} 
                    title={`Dollars USD (${pctRecettesUSD}%)`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1"></span> FC (~{pctRecettesFC}% val)
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mr-1"></span> USD (~{pctRecettesUSD}% val)
                  </span>
                </div>
              </div>

              {/* Dépenses Split */}
              <div className="pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Part des Dépenses</span>
                  <span>{formatFC(totalDepensesFC)} / {formatUSD(totalDepensesUSD)}</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    className="bg-rose-500 h-full transition-all duration-500" 
                    style={{ width: `${pctDepensesFC}%` }} 
                    title={`Francs Congolais (${pctDepensesFC}%)`}
                  />
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500" 
                    style={{ width: `${pctDepensesUSD}%` }} 
                    title={`Dollars USD (${pctDepensesUSD}%)`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mr-1"></span> FC (~{pctDepensesFC}% val)
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> USD (~{pctDepensesUSD}% val)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong>Observation Trésorerie :</strong> Les encaissements en Francs Congolais couvrent les dépenses locales courantes (coursiers, transport, carburant), tandis que les encaissements en Dollars alimentent les achats d'équipements, d'encres et consommables DTF.
            </div>
          </div>
        </div>

      </div>

      {/* Cashflow Comparison Chart: Recettes vs Dépenses */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setShowComparativeCashflow(!showComparativeCashflow)}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 text-slate-700 rounded-md">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Comparatif des Flux : Recettes vs Dépenses (Equiv. USD)
              </h3>
              <p className="text-xs text-slate-500">
                Visualisation des marges opérationnelles quotidiennes et de l'absorption des coûts
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {showComparativeCashflow ? 'Réduire' : 'Afficher'}
          </button>
        </div>

        {showComparativeCashflow && (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
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
        )}
      </div>

    </div>
  );
};
