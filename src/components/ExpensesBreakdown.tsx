import React, { useState, useMemo } from 'react';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  Plus, 
  Trash2, 
  Coins, 
  DollarSign, 
  Receipt,
  Search,
  Calendar,
  Layers,
  Store,
  ArrowRight,
  Edit,
  X,
  Lock
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ExpenseCategoryItem, DailyReportItem, ShopId } from '../types';
import { formatFC, formatUSD } from '../utils/formatters';
import { formatMonthLabel, getDateRangeLabel } from '../utils/monthUtils';
import { DateRangePicker } from './DateRangePicker';

interface ExpensesBreakdownProps {
  categories: ExpenseCategoryItem[];
  reports?: DailyReportItem[];
  onAddCategory: (category: Omit<ExpenseCategoryItem, 'id' | 'shopId'> & { shopId?: ShopId }) => void;
  onEditCategory: (category: ExpenseCategoryItem) => void;
  onDeleteCategory: (id: string) => void;
  onEditReport?: (report: DailyReportItem) => void;
  onOpenDailyEntry?: () => void;
  exchangeRate: number;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  availableMonths?: string[];
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (start: string, end: string) => void;
  onClearDateRange?: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b', '#14b8a6', '#f97316'];

export const ExpensesBreakdown: React.FC<ExpensesBreakdownProps> = ({
  categories,
  reports = [],
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onEditReport,
  onOpenDailyEntry,
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
  const [activeSubTab, setActiveSubTab] = useState<'journal' | 'rubriques' | 'analytics'>('journal');
  const [isAdding, setIsAdding] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategoryItem | null>(null);
  const [journalSearch, setJournalSearch] = useState('');

  // New Category Form State
  const [newRubrique, setNewRubrique] = useState('');
  const [newFrancs, setNewFrancs] = useState<number | ''>('');
  const [newDollars, setNewDollars] = useState<number | ''>('');
  const [newDesc, setNewDesc] = useState('');
  const [newShopId, setNewShopId] = useState<ShopId>('lingwala');

  // 1. Extract and flatten all Daily Expenses from Daily Reports
  const flatDailyExpenses = useMemo(() => {
    const items: Array<{
      id: string;
      reportId: string;
      date: string;
      shopId: ShopId;
      motif: string;
      category: string;
      amountFC: number;
      amountUSD: number;
    }> = [];

    reports.forEach((report) => {
      if (report.expenseItems && report.expenseItems.length > 0) {
        report.expenseItems.forEach((exp) => {
          if ((exp.amountFC || 0) > 0 || (exp.amountUSD || 0) > 0) {
            items.push({
              id: exp.id || `exp-${Math.random()}`,
              reportId: report.id,
              date: report.date,
              shopId: report.shopId,
              motif: exp.motif || report.motifDepenses || 'Dépense journalière',
              category: exp.category || 'Journalier',
              amountFC: exp.amountFC || 0,
              amountUSD: exp.amountUSD || 0,
            });
          }
        });
      } else if ((report.depensesFC || 0) > 0 || (report.depensesUSD || 0) > 0) {
        items.push({
          id: `rep-exp-${report.id}`,
          reportId: report.id,
          date: report.date,
          shopId: report.shopId,
          motif: report.motifDepenses || 'Sorties de caisse journalières',
          category: 'Journalier',
          amountFC: report.depensesFC || 0,
          amountUSD: report.depensesUSD || 0,
        });
      }
    });

    return items;
  }, [reports]);

  // Filtered Daily Expenses based on search term
  const filteredDailyExpenses = useMemo(() => {
    if (!journalSearch.trim()) return flatDailyExpenses;
    const term = journalSearch.toLowerCase();
    return flatDailyExpenses.filter(
      (item) =>
        item.date.includes(term) ||
        item.motif.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.shopId.toLowerCase().includes(term)
    );
  }, [flatDailyExpenses, journalSearch]);

  // Totals calculations
  const totalDailyFC = useMemo(() => flatDailyExpenses.reduce((sum, item) => sum + item.amountFC, 0), [flatDailyExpenses]);
  const totalDailyUSD = useMemo(() => flatDailyExpenses.reduce((sum, item) => sum + item.amountUSD, 0), [flatDailyExpenses]);

  const totalCategoryFC = useMemo(() => categories.reduce((sum, c) => sum + c.francs, 0), [categories]);
  const totalCategoryUSD = useMemo(() => categories.reduce((sum, c) => sum + c.dollars, 0), [categories]);

  const grandTotalFC = totalDailyFC + totalCategoryFC;
  const grandTotalUSD = totalDailyUSD + totalCategoryUSD;
  const grandTotalCombinedUSD = grandTotalUSD + grandTotalFC / exchangeRate;

  // Chart Data Preparation (Combined Category + Daily Expenses)
  const barDataCombined = useMemo(() => {
    const list = categories.map((c) => ({
      rubrique: c.rubrique,
      francsUSD: c.francs / exchangeRate,
      dollars: c.dollars,
      totalUSD: c.dollars + c.francs / exchangeRate,
    }));

    if (totalDailyFC > 0 || totalDailyUSD > 0) {
      list.unshift({
        rubrique: 'Dépenses Journalières',
        francsUSD: totalDailyFC / exchangeRate,
        dollars: totalDailyUSD,
        totalUSD: totalDailyUSD + totalDailyFC / exchangeRate,
      });
    }

    return list;
  }, [categories, totalDailyFC, totalDailyUSD, exchangeRate]);

  const pieDataUSD = useMemo(() => {
    const list = categories
      .filter((c) => c.dollars > 0)
      .map((c) => ({
        name: c.rubrique,
        value: c.dollars,
      }));

    if (totalDailyUSD > 0) {
      list.unshift({
        name: 'Journalières ($)',
        value: totalDailyUSD,
      });
    }

    return list;
  }, [categories, totalDailyUSD]);

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRubrique.trim()) return;

    onAddCategory({
      rubrique: newRubrique.trim(),
      francs: Number(newFrancs) || 0,
      dollars: Number(newDollars) || 0,
      description: newDesc.trim(),
      shopId: newShopId,
    });

    setNewRubrique('');
    setNewFrancs('');
    setNewDollars('');
    setNewDesc('');
    setIsAdding(false);
    setActiveSubTab('rubriques');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center">
            <PieIcon className="w-5 h-5 mr-2 text-indigo-600" />
            Détails des Dépenses & Sorties de Caisse
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Période : <strong>{periodLabel}</strong> — Sorties journalières et rubriques
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800">
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

          <button
            onClick={() => {
              setActiveSubTab('rubriques');
              setIsAdding(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-all inline-flex items-center shadow-sm hover:shadow cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            + Ajouter une Dépense / Rubrique
          </button>
        </div>
      </div>

      {/* Guide Information Banner: Où saisir ses dépenses */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0 mt-0.5">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <span>💡 Où ajouter vos dépenses ?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              • <strong>Dépenses de Caisse au Quotidien (Sorties d'espèces)</strong> : Saisissez-les dans la <strong>Saisie Journalière</strong> via le bouton <em>"+ Nouveau Rapport"</em> (elles réduisent directement le Cash Disponible en caisse).<br />
              • <strong>Rubriques / Charges Budgétaires Fixes</strong> : Cliquez sur le bouton bleu ci-dessus <strong>"+ Ajouter une Dépense / Rubrique"</strong> pour créer des catégories (Loyer, Électricité, Salaires, Matériel...).
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveSubTab('rubriques');
            setIsAdding(true);
          }}
          className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          Saisir une Dépense
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Dépenses Journalières du Journal */}
        <div 
          onClick={() => setActiveSubTab('journal')}
          className={`bg-white rounded-xl border p-4 shadow-sm transition-all cursor-pointer ${
            activeSubTab === 'journal' ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <Receipt className="w-4 h-4 mr-1.5 text-indigo-600" />
              Dépenses Journalières
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {flatDailyExpenses.length} entrées
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-800 flex justify-between">
              <span className="text-slate-500 text-xs font-normal">FC :</span>
              <span className="text-slate-900">{formatFC(totalDailyFC)}</span>
            </div>
            <div className="text-sm font-bold text-rose-600 flex justify-between">
              <span className="text-slate-500 text-xs font-normal">USD ($) :</span>
              <span>{formatUSD(totalDailyUSD)}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
            <span>Voir le journal des dépenses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Rubriques Fixes & Analytiques */}
        <div 
          onClick={() => setActiveSubTab('rubriques')}
          className={`bg-white rounded-xl border p-4 shadow-sm transition-all cursor-pointer ${
            activeSubTab === 'rubriques' ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <Layers className="w-4 h-4 mr-1.5 text-emerald-600" />
              Rubriques Fixes & Analytiques
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {categories.length} rubriques
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-800 flex justify-between">
              <span className="text-slate-500 text-xs font-normal">FC :</span>
              <span className="text-slate-900">{formatFC(totalCategoryFC)}</span>
            </div>
            <div className="text-sm font-bold text-rose-600 flex justify-between">
              <span className="text-slate-500 text-xs font-normal">USD ($) :</span>
              <span>{formatUSD(totalCategoryUSD)}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-600 font-semibold">
            <span>Gérer les rubriques</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Total Général Cumulé */}
        <div 
          onClick={() => setActiveSubTab('analytics')}
          className={`bg-slate-900 text-white rounded-xl border p-4 shadow-sm transition-all cursor-pointer ${
            activeSubTab === 'analytics' ? 'ring-2 ring-indigo-400' : 'hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <Coins className="w-4 h-4 mr-1.5 text-amber-400" />
              Total Général des Dépenses
            </span>
            <span className="text-[10px] font-bold text-indigo-300 uppercase">
              Cumul Global
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-bold flex justify-between">
              <span className="text-slate-400 text-xs font-normal">Equiv. Total ($) :</span>
              <span className="text-indigo-300 font-mono text-base">{formatUSD(grandTotalCombinedUSD)}</span>
            </div>
            <div className="text-xs text-slate-300 flex justify-between">
              <span>FC: {formatFC(grandTotalFC)}</span>
              <span>USD: {formatUSD(grandTotalUSD)}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-300 font-semibold">
            <span>Voir graphiques & répartition</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('journal')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'journal'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Receipt className="w-4 h-4 mr-2" />
          Dépenses Journalières (Journal)
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {flatDailyExpenses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('rubriques')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'rubriques'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4 mr-2" />
          Rubriques Fixes & Analytiques
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {categories.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`py-2.5 px-4 text-xs font-bold flex items-center border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Synthèse & Graphiques
        </button>
      </div>

      {/* TAB 1: DÉPENSES JOURNALIÈRES DU JOURNAL */}
      {activeSubTab === 'journal' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par date, motif..."
                value={journalSearch}
                onChange={(e) => setJournalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Affichage de <span className="font-bold text-slate-800">{filteredDailyExpenses.length}</span> sortie(s) de caisse
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Point de Vente</th>
                    <th className="px-5 py-3">Motif / Libellé de la Dépense</th>
                    <th className="px-5 py-3">Catégorie</th>
                    <th className="px-5 py-3">Francs (FC)</th>
                    <th className="px-5 py-3 text-rose-500">Dollars ($)</th>
                    <th className="px-5 py-3 text-right">Equiv. Total ($)</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-xs">
                  {filteredDailyExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        Aucune dépense journalière enregistrée ou trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredDailyExpenses.map((item, idx) => {
                      const equivUSD = item.amountUSD + item.amountFC / exchangeRate;
                      return (
                        <tr key={`${item.id}-${idx}`} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3 font-semibold text-slate-800 whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 border border-indigo-100 font-bold text-indigo-950 text-xs">
                              <Calendar className="w-3.5 h-3.5 mr-1.5 text-indigo-600 shrink-0" />
                              {item.date}
                            </span>
                          </td>

                          <td className="px-5 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.shopId === 'lingwala' 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              <Store className="w-3 h-3 mr-1" />
                              {item.shopId === 'lingwala' ? 'Lingwala' : 'Limete'}
                            </span>
                          </td>

                          <td className="px-5 py-3 font-semibold text-slate-800">
                            {item.motif}
                          </td>

                          <td className="px-5 py-3 text-slate-500">
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                              {item.category}
                            </span>
                          </td>

                          <td className="px-5 py-3 font-semibold text-slate-800 whitespace-nowrap">
                            {item.amountFC > 0 ? formatFC(item.amountFC) : <span className="text-slate-300">-</span>}
                          </td>

                          <td className="px-5 py-3 font-mono font-semibold text-rose-600 whitespace-nowrap">
                            {item.amountUSD > 0 ? formatUSD(item.amountUSD) : <span className="text-slate-300">-</span>}
                          </td>

                          <td className="px-5 py-3 font-mono text-right text-slate-600 font-bold whitespace-nowrap">
                            {formatUSD(equivUSD)}
                          </td>

                          <td className="px-5 py-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => {
                                const parentReport = reports.find((r) => r.id === item.reportId);
                                if (parentReport && onEditReport) {
                                  onEditReport(parentReport);
                                }
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer"
                              title="Modifier cette dépense / rapport"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Modifier</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot className="bg-slate-900 text-white font-bold text-xs">
                  <tr>
                    <td colSpan={4} className="px-5 py-3 uppercase tracking-wider">
                      TOTAL DÉPENSES JOURNALIÈRES SÉLECTIONNÉES
                    </td>
                    <td className="px-5 py-3 text-rose-300 font-bold">
                      {formatFC(filteredDailyExpenses.reduce((s, i) => s + i.amountFC, 0))}
                    </td>
                    <td className="px-5 py-3 text-rose-400 font-mono font-bold">
                      {formatUSD(filteredDailyExpenses.reduce((s, i) => s + i.amountUSD, 0))}
                    </td>
                    <td colSpan={2} className="px-5 py-3 text-right text-indigo-300 font-mono font-bold">
                      {formatUSD(
                        filteredDailyExpenses.reduce((s, i) => s + i.amountUSD + i.amountFC / exchangeRate, 0)
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RUBRIQUES FIXES & ANALYTIQUES */}
      {activeSubTab === 'rubriques' && (
        <div className="space-y-4">
          {/* Categories Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Rubrique</th>
                    <th className="px-6 py-3">Francs (FC)</th>
                    <th className="px-6 py-3 text-rose-500">Dollars ($)</th>
                    <th className="px-6 py-3">Equiv. Total ($)</th>
                    <th className="px-6 py-3 text-center">% Part</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50 font-medium">
                  {categories.map((cat, idx) => {
                    const combinedUSD = cat.dollars + cat.francs / exchangeRate;
                    const totalCombinedAllUSD = totalCategoryUSD + totalCategoryFC / exchangeRate;
                    const percent = totalCombinedAllUSD > 0 ? (combinedUSD / totalCombinedAllUSD) * 100 : 0;

                    return (
                      <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-slate-900 flex items-center">
                          <span
                            className="w-2.5 h-2.5 rounded-full mr-2.5"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          ></span>
                          {cat.rubrique}
                        </td>

                        <td className="px-6 py-3 font-medium text-slate-800">
                          {cat.francs > 0 ? formatFC(cat.francs) : <span className="text-slate-300">-</span>}
                        </td>

                        <td className="px-6 py-3 font-mono text-rose-600">
                          {cat.dollars > 0 ? formatUSD(cat.dollars) : <span className="text-slate-300">-</span>}
                        </td>

                        <td className="px-6 py-3 font-mono text-slate-600">
                          {formatUSD(combinedUSD)}
                        </td>

                        <td className="px-6 py-3 text-center">
                          <div className="inline-flex items-center space-x-2 w-full max-w-[140px]">
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-500 h-1.5 rounded-full"
                                style={{ width: `${Math.min(percent, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-500 w-8 text-right">
                              {percent.toFixed(0)}%
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-3 text-slate-500 text-xs">
                          {cat.description || '-'}
                        </td>

                        <td className="px-6 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => setEditingCategory(cat)}
                              className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                              title="Modifier cette rubrique"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteCategory(cat.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer cette rubrique"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot className="bg-slate-900 text-white font-bold text-xs sm:text-sm">
                  <tr>
                    <td className="px-6 py-3.5 uppercase tracking-wider">TOTAL RUBRIQUES FIXES</td>
                    <td className="px-6 py-3.5 text-rose-300 font-bold">
                      {formatFC(totalCategoryFC)}
                    </td>
                    <td className="px-6 py-3.5 text-rose-400 font-mono font-bold">
                      {formatUSD(totalCategoryUSD)}
                    </td>
                    <td className="px-6 py-3.5 text-indigo-300 font-mono font-bold">
                      {formatUSD(totalCategoryUSD + totalCategoryFC / exchangeRate)}
                    </td>
                    <td colSpan={3} className="px-6 py-3.5 text-center text-slate-400 font-normal text-xs">
                      {categories.length} rubriques comptabilisées
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Edit Category Modal */}
          {editingCategory && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingCategory) {
                    onEditCategory(editingCategory);
                    setEditingCategory(null);
                  }
                }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Edit className="w-5 h-5 text-indigo-600" />
                    Modifier la Rubrique de Dépense
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom de la Rubrique *</label>
                    <input
                      type="text"
                      required
                      value={editingCategory.rubrique}
                      onChange={(e) => setEditingCategory({ ...editingCategory, rubrique: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Montant en Francs (FC)</label>
                      <input
                        type="number"
                        value={editingCategory.francs}
                        onChange={(e) => setEditingCategory({ ...editingCategory, francs: Number(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Montant en Dollars ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingCategory.dollars}
                        onChange={(e) => setEditingCategory({ ...editingCategory, dollars: Number(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description / Note</label>
                    <textarea
                      rows={2}
                      value={editingCategory.description || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900"
                      placeholder="Notes ou détails supplémentaires..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SYNTHÈSE & GRAPHIQUES */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
              <PieIcon className="w-4 h-4 mr-2 text-rose-600" />
              Répartition des Dépenses en Dollars ($)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataUSD}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    dataKey="value"
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieDataUSD.map((entry, index) => (
                      <Cell key={`cell-usd-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatUSD(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
              Comparatif par Rubrique & Journal (Equiv. USD)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barDataCombined} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="rubrique" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip formatter={(val: number) => formatUSD(val)} />
                  <Bar dataKey="dollars" name="Part USD ($)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="francsUSD" name="Part FC (Convertie en $)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de dépense / rubrique */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Ajouter une Dépense / Rubrique
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Enregistrez une nouvelle dépense fixe, charge ou frais d'exploitation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Raccourci vers sortie de caisse journalière */}
            {onOpenDailyEntry && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    C'est une sortie d'espèces de Caisse au quotidien ?
                  </span>
                  <p className="text-[11px] text-amber-700">
                    Saisissez-la directement dans le rapport journalier pour impacter la caisse physique.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    onOpenDailyEntry();
                  }}
                  className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg whitespace-nowrap cursor-pointer shadow-2xs shrink-0"
                >
                  Saisir Caisse
                </button>
              </div>
            )}

            <form onSubmit={handleSaveNew} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Point de Vente *</label>
                <select
                  value={newShopId}
                  onChange={(e) => setNewShopId(e.target.value as ShopId)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="lingwala">Imprimerie Lingwala</option>
                  <option value="limete">Imprimerie Limete</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rubrique / Intitulé de la Dépense *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Loyer, Électricité, Salaires, Matériel..."
                  value={newRubrique}
                  onChange={(e) => setNewRubrique(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />

                {/* Quick Suggestion Chips */}
                <div className="pt-2 flex flex-wrap gap-1">
                  <span className="text-[10px] text-slate-400 font-medium self-center mr-0.5">Suggérés :</span>
                  {['Loyer atelier', 'Électricité / SNEL', 'Eau / Regideso', 'Salaires & Primes', 'Papier & Encre', 'Transport / Carburant', 'Maintenance Machines'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewRubrique(tag)}
                      className="text-[10px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant en Francs (FC)</label>
                  <input
                    type="number"
                    placeholder="0 FC"
                    value={newFrancs}
                    onChange={(e) => setNewFrancs(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant en Dollars ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00 $"
                    value={newDollars}
                    onChange={(e) => setNewDollars(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-rose-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Note / Justificatif</label>
                <textarea
                  rows={2}
                  placeholder="Note explicative, numéro de pièce ou bénéficiaire (facultatif)"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Enregistrer la Dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
