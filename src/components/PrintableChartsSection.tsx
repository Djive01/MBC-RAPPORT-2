import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Activity, 
  Flame, 
  Coins, 
  Zap, 
  Layers, 
  CheckCircle2
} from 'lucide-react';
import { formatFC, formatUSD } from '../utils/formatters';
import { EnrichedDailyChartItem } from '../utils/analyticsUtils';

interface PrintableChartsSectionProps {
  chartData: EnrichedDailyChartItem[];
  maxPeakDay: EnrichedDailyChartItem | null;
  avgDailyUSD: number;
  avgDailyFC: number;
  peakDaysCount: number;
  totalRecettesCombUSD: number;
  totalRecettesFC: number;
  totalRecettesUSD: number;
  totalDepensesFC: number;
  totalDepensesUSD: number;
  totalDepensesCombUSD: number;
  topPeakDays: EnrichedDailyChartItem[];
  pctRecettesFC: number;
  pctRecettesUSD: number;
  pctDepensesFC: number;
  pctDepensesUSD: number;
  metricMode: 'combUSD' | 'bidevise' | 'fc' | 'usd';
  showAverageLine?: boolean;
  showPeaks?: boolean;
  showCashflowChart?: boolean;
  showTop5Table?: boolean;
  isStandaloneDocument?: boolean;
}

export const PrintableChartsSection: React.FC<PrintableChartsSectionProps> = ({
  chartData,
  maxPeakDay,
  avgDailyUSD,
  avgDailyFC,
  peakDaysCount,
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
  metricMode,
  showAverageLine = true,
  showPeaks = true,
  showCashflowChart = true,
  showTop5Table = true,
  isStandaloneDocument = false,
}) => {
  // Custom Dot component optimized for print rendering
  const renderPrintPeakDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || isNaN(cx) || isNaN(cy) || !payload) return null;

    if (payload.isMaxPeak && showPeaks) {
      return (
        <g key={`print-max-${payload.date}`}>
          <circle cx={cx} cy={cy} r={8} fill="#f59e0b" stroke="#b45309" strokeWidth={2} />
          <circle cx={cx} cy={cy} r={3} fill="#ffffff" />
        </g>
      );
    }

    if (payload.isPeak && showPeaks) {
      return (
        <g key={`print-peak-${payload.date}`}>
          <circle cx={cx} cy={cy} r={6} fill="#4f46e5" stroke="#ffffff" strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={2} fill="#ffffff" />
        </g>
      );
    }

    if (payload.isRestDay) {
      return <circle key={`print-rest-${payload.date}`} cx={cx} cy={cy} r={2} fill="#94a3b8" />;
    }

    return <circle key={`print-dot-${payload.date}`} cx={cx} cy={cy} r={3} fill="#6366f1" stroke="#ffffff" strokeWidth={1} />;
  };

  const metricTitle =
    metricMode === 'combUSD' ? 'Recettes Équivalentes ($ USD)' :
    metricMode === 'bidevise' ? 'Recettes Bidevise (FC & $ USD)' :
    metricMode === 'fc' ? 'Recettes en Francs Congolais (FC)' :
    'Recettes en Dollars ($ USD)';

  return (
    <div className="space-y-6 print:space-y-5">
      
      {/* KPI Cards Banner */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-indigo-700" />
            <span>Indicateurs Clés d'Affluence & Pics d'Activité</span>
          </span>
          <span className="text-[10px] text-slate-500 font-normal">
            Calculs automatiques sur les encaissements réels
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4 print:gap-2">
          {/* Card 1: Record Day */}
          <div className="border border-amber-300 bg-amber-50/70 rounded-lg p-2.5 print:bg-white print:border-amber-400">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-900 uppercase flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                Record du Mois
              </span>
              {maxPeakDay && (
                <span className="text-[9px] bg-amber-600 text-white font-extrabold px-1.5 py-0.2 rounded">
                  {maxPeakDay.date}
                </span>
              )}
            </div>
            <div className="text-lg font-black text-amber-950 mt-1">
              {maxPeakDay ? formatUSD(maxPeakDay.recettesCombUSD) : '$0.00'}
            </div>
            <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
              {maxPeakDay ? `${formatFC(maxPeakDay.recettesFC)} + ${formatUSD(maxPeakDay.recettesUSD)}` : '-'}
              {maxPeakDay && maxPeakDay.percentAboveAvg > 0 && (
                <span className="ml-1 text-emerald-700 font-bold">
                  (+{maxPeakDay.percentAboveAvg}% vs moy.)
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Daily Average */}
          <div className="border border-indigo-200 bg-indigo-50/50 rounded-lg p-2.5 print:bg-white print:border-indigo-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-900 uppercase flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                Moyenne / Jour
              </span>
              <span className="text-[9px] text-indigo-600 font-semibold">Ouvré</span>
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              {formatUSD(avgDailyUSD)}
            </div>
            <div className="text-[10px] text-slate-600 font-medium mt-0.5">
              Soit env. <strong className="text-slate-800">{formatFC(avgDailyFC)}</strong>
            </div>
          </div>

          {/* Card 3: Peak Days Count */}
          <div className="border border-rose-200 bg-rose-50/50 rounded-lg p-2.5 print:bg-white print:border-rose-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-900 uppercase flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                Pics d'Affluence
              </span>
              <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                &gt; +20%
              </span>
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              {peakDaysCount} <span className="text-xs font-semibold text-slate-500">jours de pic</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              Journées de forte recette
            </div>
          </div>

          {/* Card 4: Total Period Revenue */}
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-2.5 print:bg-white print:border-emerald-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-900 uppercase flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Volume Global
              </span>
              <span className="text-[9px] text-emerald-700 font-bold">Total</span>
            </div>
            <div className="text-lg font-black text-emerald-800 mt-1">
              {formatUSD(totalRecettesCombUSD)}
            </div>
            <div className="text-[10px] text-slate-600 font-medium mt-0.5 truncate">
              {formatFC(totalRecettesFC)} | {formatUSD(totalRecettesUSD)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Linear Recharts Chart: Daily Revenue Evolution */}
      <div className="border border-slate-300 rounded-xl p-4 bg-white shadow-2xs print:border-slate-300 print:p-3 print:shadow-none">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Évolution Quotidienne des Recettes & Pics ({metricTitle})</span>
            </h4>
            <p className="text-[10px] text-slate-500">
              Trajectoire journalière avec repères visuels des pics d'activité et de la moyenne du mois
            </p>
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span>Record</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
              <span>Pic d'activité</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-indigo-400 border-t border-dashed border-indigo-600 inline-block"></span>
              <span>Moyenne</span>
            </span>
          </div>
        </div>

        {/* Chart SVG wrapper with explicit min-height for reliable printing */}
        <div className="h-64 sm:h-72 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%" minWidth={450}>
            <LineChart data={chartData} margin={{ top: 12, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeWidth={0.8} />
              
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 10, fill: '#334155' }} 
                stroke="#94a3b8"
                tickLine={false}
              />

              {metricMode === 'bidevise' ? (
                <>
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    tick={{ fontSize: 10, fill: '#047857' }} 
                    stroke="#059669"
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k FC`}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fontSize: 10, fill: '#1d4ed8' }} 
                    stroke="#2563eb"
                    tickFormatter={(val) => `$${val}`}
                  />
                </>
              ) : (
                <YAxis 
                  tick={{ fontSize: 10, fill: '#334155' }} 
                  stroke="#94a3b8"
                  tickFormatter={(val) => {
                    if (metricMode === 'fc') {
                      return val >= 1000 ? `${(val / 1000).toFixed(0)}k FC` : `${val} FC`;
                    }
                    return `$${val}`;
                  }}
                />
              )}

              <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: '11px', paddingBottom: '6px' }} />

              {/* Average Reference Line */}
              {showAverageLine && metricMode === 'combUSD' && avgDailyUSD > 0 && (
                <ReferenceLine
                  y={avgDailyUSD}
                  stroke="#4f46e5"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Moyenne (${formatUSD(avgDailyUSD)})`,
                    position: 'insideTopRight',
                    fill: '#4338ca',
                    fontSize: 10,
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
                    fill: '#047857',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}

              {/* Record marker */}
              {maxPeakDay && showPeaks && metricMode === 'combUSD' && (
                <ReferenceDot
                  x={maxPeakDay.day}
                  y={maxPeakDay.recettesCombUSD}
                  r={7}
                  fill="#f59e0b"
                  stroke="#92400e"
                  strokeWidth={2}
                />
              )}

              {/* Dynamic Line components */}
              {metricMode === 'combUSD' && (
                <Line
                  type="monotone"
                  dataKey="recettesCombUSD"
                  name="Recettes Équivalentes ($ USD)"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={renderPrintPeakDot}
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
                    strokeWidth={2}
                    dot={renderPrintPeakDot}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="recettesUSD"
                    name="Recettes Dollars ($ USD)"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={renderPrintPeakDot}
                  />
                </>
              )}

              {metricMode === 'fc' && (
                <Line
                  type="monotone"
                  dataKey="recettesFC"
                  name="Recettes Francs Congolais (FC)"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={renderPrintPeakDot}
                />
              )}

              {metricMode === 'usd' && (
                <Line
                  type="monotone"
                  dataKey="recettesUSD"
                  name="Recettes Dollars ($ USD)"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={renderPrintPeakDot}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Peak Days Table */}
      {showTop5Table && topPeakDays.length > 0 && (
        <div className="border border-slate-300 rounded-xl p-3.5 bg-white print:border-slate-300 print:p-2.5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Tableau Récapitulatif du Top 5 des Meilleures Journées (Pics d'Activité)</span>
            </h4>
            <span className="text-[10px] text-slate-500">Par volume d'encaissement</span>
          </div>

          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800">
              <tr>
                <th className="p-1.5 border border-slate-300 text-center w-12">Rang</th>
                <th className="p-1.5 border border-slate-300">Date & Jour</th>
                <th className="p-1.5 border border-slate-300 text-right">Francs (FC)</th>
                <th className="p-1.5 border border-slate-300 text-right">Dollars ($)</th>
                <th className="p-1.5 border border-slate-300 text-right">Total Équiv. ($)</th>
                <th className="p-1.5 border border-slate-300 text-right">Écart vs Moyenne</th>
              </tr>
            </thead>
            <tbody>
              {topPeakDays.map((day, idx) => (
                <tr key={day.date} className={idx === 0 ? 'bg-amber-50/60 font-semibold' : idx % 2 === 1 ? 'bg-slate-50' : ''}>
                  <td className="p-1.5 border border-slate-300 text-center">
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      idx === 0 ? 'bg-amber-500 text-white' : idx === 1 ? 'bg-slate-400 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="p-1.5 border border-slate-300">
                    <strong className="text-slate-900">{day.dayOfWeek}</strong> {day.date}
                    {idx === 0 && (
                      <span className="ml-1.5 text-[9px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-extrabold uppercase">
                        Record
                      </span>
                    )}
                  </td>
                  <td className="p-1.5 border border-slate-300 text-right font-medium text-emerald-800">
                    {formatFC(day.recettesFC)}
                  </td>
                  <td className="p-1.5 border border-slate-300 text-right font-medium text-blue-800">
                    {formatUSD(day.recettesUSD)}
                  </td>
                  <td className="p-1.5 border border-slate-300 text-right font-bold text-slate-950">
                    {formatUSD(day.recettesCombUSD)}
                  </td>
                  <td className="p-1.5 border border-slate-300 text-right font-bold text-emerald-700">
                    {day.percentAboveAvg > 0 ? `+${day.percentAboveAvg}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cashflow Comparison & Currency Breakdown */}
      {showCashflowChart && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
          
          {/* Cashflow Chart */}
          <div className="border border-slate-300 rounded-xl p-3 bg-white print:border-slate-300">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Comparatif des Flux : Recettes vs Dépenses</span>
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} tickFormatter={(val) => `$${val}`} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Area type="monotone" dataKey="recettesCombUSD" name="Recettes ($)" stroke="#4f46e5" fill="#c7d2fe" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="depensesCombUSD" name="Dépenses ($)" stroke="#e11d48" fill="#fecdd3" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Currency Split Analysis */}
          <div className="border border-slate-300 rounded-xl p-3 bg-white flex flex-col justify-between print:border-slate-300">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                <span>Ventilation des Flux par Devise (FC vs USD)</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                {/* Recettes */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 text-[11px] mb-0.5">
                    <span>Recettes</span>
                    <span>{formatFC(totalRecettesFC)} / {formatUSD(totalRecettesUSD)}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                    <div className="bg-emerald-600 h-full" style={{ width: `${pctRecettesFC}%` }} />
                    <div className="bg-blue-600 h-full" style={{ width: `${pctRecettesUSD}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>FC : {pctRecettesFC}% val.</span>
                    <span>USD : {pctRecettesUSD}% val.</span>
                  </div>
                </div>

                {/* Dépenses */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 text-[11px] mb-0.5">
                    <span>Dépenses</span>
                    <span>{formatFC(totalDepensesFC)} / {formatUSD(totalDepensesUSD)}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                    <div className="bg-rose-500 h-full" style={{ width: `${pctDepensesFC}%` }} />
                    <div className="bg-amber-500 h-full" style={{ width: `${pctDepensesUSD}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>FC : {pctDepensesFC}% val.</span>
                    <span>USD : {pctDepensesUSD}% val.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200 text-[10px] text-slate-700 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Bilan Trésorerie :</strong> Solde net opérationnel période : <strong className="text-emerald-700">{formatUSD(totalRecettesCombUSD - totalDepensesCombUSD)}</strong>. Les flux FC couvrent les charges immédiates, les flux USD alimentent les approvisionnements machines et consommables.
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
