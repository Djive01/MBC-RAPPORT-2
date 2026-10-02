import { DetailedIncomeItem } from '../types';

export interface IncomeCategoryDefinition {
  key: string;
  name: string;
  icon: string;
  placeholderMotif: string;
  color: string;
  description: string;
}

export const STANDARD_INCOME_CATEGORIES: IncomeCategoryDefinition[] = [
  {
    key: 'impression_photocopie',
    name: 'Impression et photocopie',
    icon: '🖨️',
    placeholderMotif: 'ex: 500 copies A4 N&B, 50 tirages couleur A3...',
    color: 'emerald',
    description: 'Impressions bureautiques, photocopies, tirages de plans, reliures',
  },
  {
    key: 'dtf',
    name: 'DTF',
    icon: '✨',
    placeholderMotif: 'ex: 15 mètres DTF, 30 feuilles A3...',
    color: 'purple',
    description: 'Impression textile Direct-to-Film, planches A3/A4 et métrages continus',
  },
  {
    key: 'bache',
    name: 'Bâche',
    icon: '🖼️',
    placeholderMotif: 'ex: Bâche 3x2m avec œillets, vinyle autocollant...',
    color: 'blue',
    description: 'Bâches publicitaires, vinyles adhésifs, roll-up, kakémonos grand format',
  },
  {
    key: 'polo',
    name: 'Polo',
    icon: '👕',
    placeholderMotif: 'ex: 20 polos brodés/floqués pour entreprise...',
    color: 'amber',
    description: 'Polos personnalisés, t-shirts, chemises, casquettes et confection',
  },
  {
    key: 'fourniture',
    name: 'Fourniture',
    icon: '📦',
    placeholderMotif: 'ex: 5 rames papier A4 duplicateur, stylos...',
    color: 'cyan',
    description: 'Vente de papier, rames, fournitures de bureau et consommables',
  },
  {
    key: 'autres',
    name: 'Autres',
    icon: '💡',
    placeholderMotif: 'ex: Conception graphique, plastification, cachet...',
    color: 'slate',
    description: 'Prestations diverses, infographie, plastification, tampons/cachets',
  },
];

/**
 * Creates initial detailed income items from standard categories
 */
export function createDefaultIncomeItems(): DetailedIncomeItem[] {
  return STANDARD_INCOME_CATEGORIES.map((cat, idx) => ({
    id: `inc-def-${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    category: cat.name,
    motif: '',
    amountFC: 0,
    amountUSD: 0,
  }));
}

/**
 * Sums up amounts of detailed income items
 */
export function calculateIncomeTotals(items: DetailedIncomeItem[]): { totalFC: number; totalUSD: number } {
  return items.reduce(
    (acc, item) => ({
      totalFC: acc.totalFC + (Number(item.amountFC) || 0),
      totalUSD: acc.totalUSD + (Number(item.amountUSD) || 0),
    }),
    { totalFC: 0, totalUSD: 0 }
  );
}

/**
 * Get category icon and styling
 */
export function getCategoryMeta(categoryName: string): { icon: string; color: string } {
  const normalized = (categoryName || '').toLowerCase();
  if (normalized.includes('dtf')) return { icon: '✨', color: 'purple' };
  if (normalized.includes('bache') || normalized.includes('bâche')) return { icon: '🖼️', color: 'blue' };
  if (normalized.includes('polo') || normalized.includes('t-shirt') || normalized.includes('textile')) return { icon: '👕', color: 'amber' };
  if (normalized.includes('fourniture') || normalized.includes('papier')) return { icon: '📦', color: 'cyan' };
  if (normalized.includes('impression') || normalized.includes('photocopie') || normalized.includes('copie')) return { icon: '🖨️', color: 'emerald' };
  return { icon: '💡', color: 'slate' };
}

export interface AggregatedIncomeCategory {
  key: string;
  name: string;
  icon: string;
  color: string;
  amountFC: number;
  amountUSD: number;
  equivUSD: number;
  percentage: number;
  count: number;
  motifs: string[];
}

/**
 * Consolidates income breakdown across reports with 100% mathematical consistency
 */
export function aggregateReportsIncome(
  reports: import('../types').DailyReportItem[],
  exchangeRate: number = 2850
): {
  categories: AggregatedIncomeCategory[];
  totalFC: number;
  totalUSD: number;
  totalCombUSD: number;
} {
  const safeRate = exchangeRate > 0 ? exchangeRate : 2850;

  // Initialize accumulator for standard categories
  const map = new Map<string, {
    key: string;
    name: string;
    icon: string;
    color: string;
    amountFC: number;
    amountUSD: number;
    count: number;
    motifs: string[];
  }>();

  STANDARD_INCOME_CATEGORIES.forEach((cat) => {
    map.set(cat.name.toLowerCase(), {
      key: cat.key,
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      amountFC: 0,
      amountUSD: 0,
      count: 0,
      motifs: [],
    });
  });

  const resolveCategoryKey = (catName: string): string => {
    const n = (catName || '').toLowerCase();
    if (n.includes('dtf')) return 'dtf';
    if (n.includes('bache') || n.includes('bâche')) return 'bâche';
    if (n.includes('polo') || n.includes('t-shirt') || n.includes('textile')) return 'polo';
    if (n.includes('fourniture') || n.includes('papier')) return 'fourniture';
    if (n.includes('impression') || n.includes('photocopie') || n.includes('copie')) return 'impression et photocopie';
    return 'autres';
  };

  reports.forEach((report) => {
    if (report.isRestDay) return;

    if (report.incomeItems && report.incomeItems.length > 0) {
      let reportedFC = 0;
      let reportedUSD = 0;

      report.incomeItems.forEach((item) => {
        const standardKey = resolveCategoryKey(item.category);
        const target = map.get(standardKey) || map.get('autres')!;
        
        const fc = Number(item.amountFC) || 0;
        const usd = Number(item.amountUSD) || 0;

        target.amountFC += fc;
        target.amountUSD += usd;
        reportedFC += fc;
        reportedUSD += usd;
        if (fc > 0 || usd > 0 || item.motif) {
          target.count += 1;
        }
        if (item.motif && item.motif.trim() && !target.motifs.includes(item.motif.trim())) {
          target.motifs.push(item.motif.trim());
        }
      });

      // If there is any remaining discrepancy between line items and report totals, allocate to impression/autres
      const remFC = Math.max(0, (report.recettesFC || 0) - reportedFC);
      const remUSD = Math.max(0, (report.recettesUSD || 0) - reportedUSD);
      if (remFC > 0 || remUSD > 0) {
        const defaultTarget = map.get('impression et photocopie')!;
        defaultTarget.amountFC += remFC;
        defaultTarget.amountUSD += remUSD;
      }
    } else if ((report.recettesFC || 0) > 0 || (report.recettesUSD || 0) > 0) {
      // Report without breakdown: assign to default Impression et photocopie
      const defaultTarget = map.get('impression et photocopie')!;
      defaultTarget.amountFC += (report.recettesFC || 0);
      defaultTarget.amountUSD += (report.recettesUSD || 0);
      defaultTarget.count += 1;
    }
  });

  let totalFC = 0;
  let totalUSD = 0;
  map.forEach((item) => {
    totalFC += item.amountFC;
    totalUSD += item.amountUSD;
  });

  const totalCombUSD = totalUSD + totalFC / safeRate;

  const categories: AggregatedIncomeCategory[] = Array.from(map.values()).map((item) => {
    const equivUSD = item.amountUSD + item.amountFC / safeRate;
    const percentage = totalCombUSD > 0 ? (equivUSD / totalCombUSD) * 100 : 0;
    return {
      ...item,
      equivUSD,
      percentage,
    };
  });

  return {
    categories,
    totalFC,
    totalUSD,
    totalCombUSD,
  };
}
