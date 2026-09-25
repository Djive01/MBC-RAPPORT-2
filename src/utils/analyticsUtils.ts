import { DailyReportItem } from '../types';
import { parseDateToISO, parseDateToTimestamp } from './monthUtils';

export const DAYS_OF_WEEK_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export interface EnrichedDailyChartItem {
  date: string;
  timestamp: number;
  day: string;
  dayOfWeek: string;
  recettesFC: number;
  recettesUSD: number;
  depensesFC: number;
  depensesUSD: number;
  recettesCombUSD: number;
  depensesCombUSD: number;
  soldeCombUSD: number;
  isRestDay: boolean;
  notes?: string;
  shopCount: number;
  isMaxPeak: boolean;
  isPeak: boolean;
  percentAboveAvg: number;
  avgReferenceUSD: number;
}

export interface AnalyticsCalculationResult {
  chartData: EnrichedDailyChartItem[];
  maxPeakDay: EnrichedDailyChartItem | null;
  peakDaysCount: number;
  avgDailyUSD: number;
  avgDailyFC: number;
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
}

/**
 * Consolidates daily reports into rich chronological chart data with peak detection
 */
export function calculateAnalyticsData(
  reports: DailyReportItem[],
  exchangeRate: number,
  selectedMonth: string = '07/2026',
  startDate: string = '',
  endDate: string = ''
): AnalyticsCalculationResult {
  const safeRate = exchangeRate > 0 ? exchangeRate : 2850;

  const dailyMap = new Map<string, {
    date: string;
    timestamp: number;
    recettesFC: number;
    recettesUSD: number;
    depensesFC: number;
    depensesUSD: number;
    isRestDay: boolean;
    notes?: string;
    shopCount: number;
  }>();

  reports.forEach((r) => {
    const date = r.date || '';
    if (!date) return;
    const ts = parseDateToTimestamp(date);
    const existing = dailyMap.get(date);

    if (!existing) {
      dailyMap.set(date, {
        date,
        timestamp: ts,
        recettesFC: Number(r.recettesFC) || 0,
        recettesUSD: Number(r.recettesUSD) || 0,
        depensesFC: Number(r.depensesFC) || 0,
        depensesUSD: Number(r.depensesUSD) || 0,
        isRestDay: !!r.isRestDay,
        notes: r.notes || r.motifDepenses || '',
        shopCount: 1,
      });
    } else {
      existing.recettesFC += Number(r.recettesFC) || 0;
      existing.recettesUSD += Number(r.recettesUSD) || 0;
      existing.depensesFC += Number(r.depensesFC) || 0;
      existing.depensesUSD += Number(r.depensesUSD) || 0;
      existing.isRestDay = existing.isRestDay && !!r.isRestDay;
      existing.shopCount += 1;
      if (r.notes && !existing.notes?.includes(r.notes)) {
        existing.notes = existing.notes ? `${existing.notes} | ${r.notes}` : r.notes;
      }
    }
  });

  const sortedDays = Array.from(dailyMap.values()).sort((a, b) => a.timestamp - b.timestamp);

  // First pass to determine values and average
  const enriched = sortedDays.map((d) => {
    const recettesCombUSD = d.recettesUSD + (d.recettesFC / safeRate);
    const depensesCombUSD = d.depensesUSD + (d.depensesFC / safeRate);
    const soldeCombUSD = recettesCombUSD - depensesCombUSD;

    let dayLabel = '';
    if (selectedMonth === 'all' || startDate || endDate) {
      dayLabel = d.date.includes('/') ? `${d.date.split('/')[0]}/${d.date.split('/')[1]}` : d.date;
    } else {
      dayLabel = d.date.includes('/') ? d.date.split('/')[0] : (d.date.split('-').slice(-1)[0] || '');
    }

    let dayOfWeek = '';
    const iso = parseDateToISO(d.date);
    if (iso) {
      const dateObj = new Date(iso + 'T00:00:00');
      dayOfWeek = DAYS_OF_WEEK_FR[dateObj.getDay()] || '';
    }

    return {
      ...d,
      day: dayLabel,
      dayOfWeek,
      recettesCombUSD,
      depensesCombUSD,
      soldeCombUSD,
    };
  });

  // Compute stats for peak identification
  const activeDays = enriched.filter((d) => !d.isRestDay && d.recettesCombUSD > 0);
  const avgUSD = activeDays.length > 0 
    ? activeDays.reduce((sum, d) => sum + d.recettesCombUSD, 0) / activeDays.length 
    : 0;

  let maxCombUSD = 0;
  enriched.forEach((d) => {
    if (d.recettesCombUSD > maxCombUSD) {
      maxCombUSD = d.recettesCombUSD;
    }
  });

  const peakThreshold = avgUSD > 0 ? Math.max(avgUSD * 1.20, maxCombUSD * 0.75) : 0;

  const chartData: EnrichedDailyChartItem[] = enriched.map((d) => {
    const isMaxPeak = maxCombUSD > 0 && Math.abs(d.recettesCombUSD - maxCombUSD) < 0.01;
    const isPeak = (isMaxPeak || (d.recettesCombUSD >= peakThreshold && d.recettesCombUSD > 0));
    const percentAboveAvg = avgUSD > 0 ? Math.round(((d.recettesCombUSD - avgUSD) / avgUSD) * 100) : 0;

    return {
      ...d,
      isMaxPeak,
      isPeak,
      percentAboveAvg,
      avgReferenceUSD: avgUSD,
    };
  });

  let maxDay = null as EnrichedDailyChartItem | null;
  let peaksCount = 0;
  let sumUSD = 0;
  let sumFC = 0;
  let sumCombUSD = 0;
  let activeCount = 0;

  chartData.forEach((d) => {
    sumFC += d.recettesFC;
    sumUSD += d.recettesUSD;
    sumCombUSD += d.recettesCombUSD;

    if (!d.isRestDay && d.recettesCombUSD > 0) {
      activeCount += 1;
    }

    if (d.isPeak) {
      peaksCount += 1;
    }

    if (!maxDay || d.recettesCombUSD > maxDay.recettesCombUSD) {
      maxDay = d;
    }
  });

  const topPeakDays = [...chartData]
    .filter((d) => d.recettesCombUSD > 0)
    .sort((a, b) => b.recettesCombUSD - a.recettesCombUSD)
    .slice(0, 5);

  const sumDepensesFC = reports.reduce((acc, r) => acc + (Number(r.depensesFC) || 0), 0);
  const sumDepensesUSD = reports.reduce((acc, r) => acc + (Number(r.depensesUSD) || 0), 0);
  const totalDepensesCombUSD = sumDepensesUSD + (sumDepensesFC / safeRate);

  const pctRecettesFC = sumCombUSD > 0 
    ? Math.min(100, Math.max(0, Math.round(((sumFC / safeRate) / sumCombUSD) * 100))) 
    : 50;
  const pctRecettesUSD = 100 - pctRecettesFC;

  const pctDepensesFC = totalDepensesCombUSD > 0 
    ? Math.min(100, Math.max(0, Math.round(((sumDepensesFC / safeRate) / totalDepensesCombUSD) * 100))) 
    : 50;
  const pctDepensesUSD = 100 - pctDepensesFC;

  return {
    chartData,
    maxPeakDay: maxDay,
    peakDaysCount: peaksCount,
    avgDailyUSD: activeCount > 0 ? sumCombUSD / activeCount : 0,
    avgDailyFC: activeCount > 0 ? sumFC / activeCount : 0,
    totalRecettesCombUSD: sumCombUSD,
    totalRecettesFC: sumFC,
    totalRecettesUSD: sumUSD,
    totalDepensesFC: sumDepensesFC,
    totalDepensesUSD: sumDepensesUSD,
    totalDepensesCombUSD,
    topPeakDays,
    pctRecettesFC,
    pctRecettesUSD,
    pctDepensesFC,
    pctDepensesUSD,
  };
}
