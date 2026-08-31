import { DailyReportItem } from '../types';

export const MONTH_NAMES_FR = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

/**
 * Extracts month key 'MM/YYYY' from 'DD/MM/YYYY' or 'YYYY-MM-DD'
 */
export function parseMonthKey(dateStr: string): string {
  if (!dateStr) return '';
  
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // DD/MM/YYYY
      const m = parts[1].padStart(2, '0');
      const y = parts[2];
      return `${m}/${y}`;
    }
  } else if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      // YYYY-MM-DD
      const y = parts[0];
      const m = parts[1].padStart(2, '0');
      return `${m}/${y}`;
    }
  }

  return '';
}

/**
 * Formats 'MM/YYYY' into 'Juillet 2026'
 */
export function formatMonthLabel(monthKey: string): string {
  if (!monthKey || monthKey === 'all') return 'Tous les mois';

  const [mStr, yStr] = monthKey.split('/');
  const mIndex = parseInt(mStr, 10) - 1;

  if (mIndex >= 0 && mIndex < 12 && yStr) {
    return `${MONTH_NAMES_FR[mIndex]} ${yStr}`;
  }

  return monthKey;
}

/**
 * Gets sorted list of all unique month keys present in reports array
 */
export function getAvailableMonths(reports: DailyReportItem[]): string[] {
  const monthMap = new Set<string>();

  reports.forEach((r) => {
    const k = parseMonthKey(r.date);
    if (k) monthMap.add(k);
  });

  // Ensure '07/2026' and current month are available if empty
  if (monthMap.size === 0) {
    monthMap.add('07/2026');
    monthMap.add('08/2026');
  }

  // Sort chronologically (YYYY, MM)
  const sorted = Array.from(monthMap).sort((a, b) => {
    const [mA, yA] = a.split('/').map(Number);
    const [mB, yB] = b.split('/').map(Number);
    if (yA !== yB) return yB - yA; // Latest year first
    return mB - mA; // Latest month first
  });

  return sorted;
}

/**
 * Converts any date string ('DD/MM/YYYY', 'D/M/YYYY', 'YYYY-MM-DD') into ISO format 'YYYY-MM-DD'
 */
export function parseDateToISO(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();

  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2];
      return `${y}-${m}-${d}`;
    }
  } else if (trimmed.includes('-')) {
    const parts = trimmed.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const y = parts[0];
        const m = parts[1].padStart(2, '0');
        const d = parts[2].padStart(2, '0');
        return `${y}-${m}-${d}`;
      } else {
        // DD-MM-YYYY
        const d = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        const y = parts[2];
        return `${y}-${m}-${d}`;
      }
    }
  }

  return '';
}

/**
 * Formats an ISO string 'YYYY-MM-DD' or date into 'DD/MM/YYYY' French display format
 */
export function formatDateToFr(dateStr: string): string {
  if (!dateStr) return '';
  const iso = parseDateToISO(dateStr);
  if (!iso) return dateStr;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Checks if a given date string falls within [startDate, endDate] (in ISO 'YYYY-MM-DD' or French format)
 */
export function isDateInRange(dateStr: string, startDate?: string, endDate?: string): boolean {
  if (!startDate && !endDate) return true;

  const targetIso = parseDateToISO(dateStr);
  if (!targetIso) return true;

  if (startDate) {
    const startIso = parseDateToISO(startDate);
    if (startIso && targetIso < startIso) return false;
  }

  if (endDate) {
    const endIso = parseDateToISO(endDate);
    if (endIso && targetIso > endIso) return false;
  }

  return true;
}

/**
 * Generates a human readable period label (e.g. "Du 01/08/2026 au 15/08/2026")
 */
export function getDateRangeLabel(
  startDate?: string,
  endDate?: string,
  selectedMonth?: string
): string {
  if (startDate && endDate) {
    return `Du ${formatDateToFr(startDate)} au ${formatDateToFr(endDate)}`;
  } else if (startDate) {
    return `À partir du ${formatDateToFr(startDate)}`;
  } else if (endDate) {
    return `Jusqu'au ${formatDateToFr(endDate)}`;
  } else {
    return formatMonthLabel(selectedMonth || '07/2026');
  }
}

/**
 * Safely parses any date string into epoch timestamp for sorting
 */
export function parseDateToTimestamp(dateStr: string): number {
  if (!dateStr) return 0;
  const iso = parseDateToISO(dateStr);
  if (iso) {
    const t = new Date(iso + 'T00:00:00').getTime();
    if (!isNaN(t)) return t;
  }
  return 0;
}

/**
 * Filters reports list by month key ('07/2026' or 'all') or by date range
 */
export function filterReportsByMonth(
  reports: DailyReportItem[],
  monthKey: string,
  startDate?: string,
  endDate?: string
): DailyReportItem[] {
  if (startDate || endDate) {
    return reports.filter((r) => isDateInRange(r.date, startDate, endDate));
  }

  if (!monthKey || monthKey === 'all') {
    return reports;
  }

  return reports.filter((r) => parseMonthKey(r.date) === monthKey);
}

