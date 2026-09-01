import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  Calendar, 
  CalendarOff, 
  CheckCircle2, 
  Sparkles,
  Download,
  ArrowUpDown,
  Lock,
  ChevronDown,
  ChevronUp,
  Receipt
} from 'lucide-react';
import { DailyReportItem, UserAccount } from '../types';
import { formatFC, formatUSD } from '../utils/formatters';
import { PasswordPromptModal } from './PasswordPromptModal';
import { formatMonthLabel, parseDateToTimestamp } from '../utils/monthUtils';
import { DateRangePicker } from './DateRangePicker';

interface DailyJournalTableProps {
  reports: DailyReportItem[];
  onAddReport: () => void;
  onEditReport: (report: DailyReportItem) => void;
  onDeleteReport: (id: string) => void;
  exchangeRate: number;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  availableMonths?: string[];
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (start: string, end: string) => void;
  onClearDateRange?: () => void;
  currentUser?: UserAccount | null;
  accounts?: UserAccount[];
}

export const DailyJournalTable: React.FC<DailyJournalTableProps> = ({
  reports,
  onAddReport,
  onEditReport,
  onDeleteReport,
  exchangeRate,
  selectedMonth = '07/2026',
  onMonthChange,
  availableMonths = ['07/2026', '08/2026'],
  startDate = '',
  endDate = '',
  onDateRangeChange,
  onClearDateRange,
  currentUser,
  accounts = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'work' | 'rest' | 'has_expenses' | 'high_revenue'>('all');
  const [sortAscending, setSortAscending] = useState(true);

  // Password Prompt modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: 'edit' | 'delete'; report: DailyReportItem } | null>(null);

  // Expanded multi-expense row IDs
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const handleRequestEdit = (report: DailyReportItem) => {
    setPendingAction({ type: 'edit', report });
    setIsPasswordModalOpen(true);
  };

  const handleRequestDelete = (report: DailyReportItem) => {
    setPendingAction({ type: 'delete', report });
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSuccess = () => {
    if (!pendingAction) return;
    setIsPasswordModalOpen(false);

    if (pendingAction.type === 'edit') {
      onEditReport(pendingAction.report);
    } else if (pendingAction.type === 'delete') {
      onDeleteReport(pendingAction.report.id);
    }

    setPendingAction(null);
  };

  // Filter logic
  const filteredReports = reports.filter((item) => {
    const term = searchTerm.toLowerCase();
    const itemDate = item.date || '';
    const matchesSearch = itemDate.toLowerCase().includes(term) || 
      (item.notes && item.notes.toLowerCase().includes(term)) ||
      (item.motifDepenses && item.motifDepenses.toLowerCase().includes(term));
    if (!matchesSearch) return false;

    if (filterMode === 'work') return !item.isRestDay;
    if (filterMode === 'rest') return !!item.isRestDay;
    if (filterMode === 'has_expenses') return item.depensesFC > 0 || item.depensesUSD > 0;
    if (filterMode === 'high_revenue') return item.recettesFC >= 200000 || item.recettesUSD >= 50;

    return true;
  });

  // Sort logic (by date)
  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = parseDateToTimestamp(a.date);
    const dateB = parseDateToTimestamp(b.date);
    return sortAscending ? dateA - dateB : dateB - dateA;
  });

  // Totals of current view
  const sumRecettesFC = filteredReports.reduce((acc, r) => acc + r.recettesFC, 0);
  const sumRecettesUSD = filteredReports.reduce((acc, r) => acc + r.recettesUSD, 0);
  const sumDepensesFC = filteredReports.reduce((acc, r) => acc + r.depensesFC, 0);
  const sumDepensesUSD = filteredReports.reduce((acc, r) => acc + r.depensesUSD, 0);

  const soldeFC = sumRecettesFC - sumDepensesFC;
  const soldeUSD = sumRecettesUSD - sumDepensesUSD;

  // Export CSV helper
  const exportCSV = () => {
    const headers = ['Date', 'Recettes FC', 'Recettes USD', 'Dépenses FC', 'Dépenses USD', 'Motif Dépenses', 'Solde FC', 'Solde USD', 'Remarques'];
    const rows = sortedReports.map((r) => [
      r.date,
      r.recettesFC,
      r.recettesUSD,
      r.depensesFC,
      r.depensesUSD,
      `"${r.motifDepenses || ''}"`,
      r.recettesFC - r.depensesFC,
      r.recettesUSD - r.depensesUSD,
      `"${r.notes || (r.isRestDay ? 'Jour de repos' : '')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rapport_Journalier_MBC_Print_Juillet_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      
      {/* Security Password Prompt Modal */}
      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
        title={pendingAction?.type === 'edit' ? "Modification Protégée par Mot de Passe" : "Suppression Protégée par Mot de Passe"}
        description={
          pendingAction?.type === 'edit'
            ? `Entrez le mot de passe de sécurité pour autoriser la modification du rapport journalier du ${pendingAction.report.date}.`
            : `Entrez le mot de passe pour autoriser la suppression irréversible du rapport du ${pendingAction?.report.date}.`
        }
      />

      {/* Instruction Callout Banner for Editing */}
      <div className="bg-indigo-50/80 border-b border-indigo-100 px-6 py-2.5 text-xs text-indigo-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] uppercase">Aide</span>
          <p className="font-medium">
            Pour <strong>modifier un rapport journalier</strong>, cliquez sur le bouton <span className="inline-flex items-center font-bold text-indigo-700 px-1.5 py-0.5 bg-white border border-indigo-200 rounded">✏️ Modifier 🔒</span> présent dans la colonne Actions de chaque ligne. Mot de passe gérance requis.
          </p>
        </div>
      </div>

      {/* Table Header Controls */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <h3 className="font-bold text-slate-800 flex items-center text-base">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Journal des Opérations
          </h3>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
            Derniers {filteredReports.length} jours
          </span>
          <span className="hidden sm:inline-flex px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-lg items-center gap-1">
            <Lock className="w-3 h-3 text-amber-600" />
            Édition Sécurisée
          </span>
        </div>

        {/* Search, Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Month Selector Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange && onMonthChange(e.target.value)}
              className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer pr-1"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {formatMonthLabel(m)}
                </option>
              ))}
              <option value="all">Tous les mois</option>
            </select>
          </div>

          {/* Date Range Selector (Date X à Date Y) */}
          {onDateRangeChange && onClearDateRange && (
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={onDateRangeChange}
              onClearDateRange={onClearDateRange}
            />
          )}

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Chercher une date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36 sm:w-48 text-slate-800"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterMode('work')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'work' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ouvrés
            </button>
            <button
              onClick={() => setFilterMode('rest')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'rest' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Repos
            </button>
            <button
              onClick={() => setFilterMode('has_expenses')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'has_expenses' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dépenses
            </button>
          </div>

          <button
            onClick={() => setSortAscending(!sortAscending)}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Inverser l'ordre des dates"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          <button
            onClick={exportCSV}
            className="inline-flex items-center px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg border border-slate-200 transition-colors"
            title="Exporter en fichier CSV"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            CSV
          </button>

          <button
            onClick={onAddReport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center shadow-md active:scale-95 cursor-pointer"
            title="Ouvrir le formulaire d'enregistrement de journée"
          >
            <Plus className="w-4 h-4 mr-1.5 text-indigo-200" />
            <span>+ Enregistrer une Journée</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Shop / Lieu</th>
              <th className="px-6 py-3">Recettes (FC)</th>
              <th className="px-6 py-3">Recettes ($)</th>
              <th className="px-6 py-3 text-rose-500">Dépenses (FC)</th>
              <th className="px-6 py-3 text-rose-500">Dépenses ($)</th>
              <th className="px-6 py-3 text-rose-600">Motifs & Postes de Dépense</th>
              <th className="px-6 py-3">Solde Jour FC</th>
              <th className="px-6 py-3">Solde Jour $</th>
              <th className="px-6 py-3 text-center">Remarques</th>
              <th className="px-6 py-3 text-center">Actions Sécurisées</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-50 font-medium">
            {sortedReports.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-400">
                  Aucun rapport trouvé pour cette recherche.
                </td>
              </tr>
            ) : (
              sortedReports.map((row) => {
                const daySoldeFC = row.recettesFC - row.depensesFC;
                const daySoldeUSD = row.recettesUSD - row.depensesUSD;
                const isHighRevenue = row.recettesFC >= 300000 || row.recettesUSD >= 100;
                const hasMultipleExpenses = row.expenseItems && row.expenseItems.length > 0;
                const isExpanded = expandedRowId === row.id;

                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`hover:bg-slate-50 transition-colors ${
                        row.isRestDay ? 'bg-slate-50/50 text-slate-400' : ''
                      } ${isExpanded ? 'bg-indigo-50/30' : ''}`}
                    >
                      {/* Date (Clickable to edit) */}
                      <td className="px-6 py-3 font-medium">
                        <button
                          onClick={() => handleRequestEdit(row)}
                          className="flex items-center space-x-2 text-left group/date hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Cliquer pour modifier le rapport de cette journée"
                        >
                          <span className={`group-hover/date:underline ${isHighRevenue ? 'text-indigo-600 font-semibold' : ''}`}>{row.date}</span>
                          <Edit className="w-3 h-3 text-slate-400 group-hover/date:text-indigo-600 opacity-0 group-hover/date:opacity-100 transition-opacity" />
                          {row.isRestDay && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-normal">
                              Repos
                            </span>
                          )}
                          {isHighRevenue && (
                            <span title="Journée forte recette">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Shop Badge */}
                      <td className="px-6 py-3 font-medium">
                        {row.shopId === 'limete' ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Limete
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            Lingwala
                          </span>
                        )}
                      </td>

                      {/* Recettes FC */}
                      <td className="px-6 py-3">
                        {row.recettesFC > 0 ? formatFC(row.recettesFC) : <span className="text-slate-300">-</span>}
                      </td>

                      {/* Recettes USD */}
                      <td className="px-6 py-3 font-mono text-emerald-600">
                        {row.recettesUSD > 0 ? formatUSD(row.recettesUSD) : <span className="text-slate-300">-</span>}
                      </td>

                      {/* Dépenses FC */}
                      <td className="px-6 py-3 text-rose-600">
                        {row.depensesFC > 0 ? formatFC(row.depensesFC) : <span className="text-slate-300">-</span>}
                      </td>

                      {/* Dépenses USD */}
                      <td className="px-6 py-3 text-rose-600 font-mono">
                        {row.depensesUSD > 0 ? formatUSD(row.depensesUSD) : <span className="text-slate-300">-</span>}
                      </td>

                      {/* Motif Dépense & Multi-Expenses Badge */}
                      <td className="px-6 py-3 text-xs">
                        {hasMultipleExpenses ? (
                          <button
                            onClick={() => setExpandedRowId(isExpanded ? null : row.id)}
                            className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold border border-rose-200 transition-colors gap-1.5 cursor-pointer"
                          >
                            <Receipt className="w-3.5 h-3.5 text-rose-600" />
                            <span>{row.expenseItems!.length} dépenses ventilées</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        ) : row.motifDepenses ? (
                          <span className="inline-block px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium border border-rose-100/80 max-w-[200px] truncate" title={row.motifDepenses}>
                            {row.motifDepenses}
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      {/* Solde Jour FC */}
                      <td className={`px-6 py-3 font-medium ${
                        daySoldeFC > 0 ? 'text-slate-800' : daySoldeFC < 0 ? 'text-rose-600' : 'text-slate-400'
                      }`}>
                        {formatFC(daySoldeFC)}
                      </td>

                      {/* Solde Jour USD */}
                      <td className={`px-6 py-3 font-mono font-medium ${
                        daySoldeUSD > 0 ? 'text-emerald-600' : daySoldeUSD < 0 ? 'text-rose-600' : 'text-slate-400'
                      }`}>
                        {formatUSD(daySoldeUSD)}
                      </td>

                      {/* Remarques */}
                      <td className="px-6 py-3 text-center text-xs text-slate-500 max-w-[150px] truncate">
                        {row.notes || (row.isRestDay ? 'Jour de repos' : '')}
                      </td>

                      {/* Actions with Password Lock */}
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleRequestEdit(row)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                            title="Modifier ce rapport (Mot de passe requis)"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Modifier</span>
                            <Lock className="w-3 h-3 text-indigo-200" />
                          </button>
                          <button
                            onClick={() => handleRequestDelete(row)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all flex items-center space-x-1 cursor-pointer"
                            title="Supprimer ce rapport (Mot de passe requis)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED MULTI-EXPENSE DETAILS ROW */}
                    {isExpanded && hasMultipleExpenses && (
                      <tr className="bg-rose-50/40 border-b border-rose-100">
                        <td colSpan={11} className="px-8 py-3">
                          <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-inner space-y-2">
                            <div className="flex items-center justify-between border-b border-rose-100 pb-2">
                              <h5 className="font-bold text-xs text-rose-900 flex items-center gap-1.5">
                                <Receipt className="w-4 h-4 text-rose-600" />
                                Détail des dépenses du {row.date} ({row.expenseItems?.length} postes enregistrés)
                              </h5>
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] text-rose-700 font-bold">
                                  Total: {formatFC(row.depensesFC)} / {formatUSD(row.depensesUSD)}
                                </span>
                                <button
                                  onClick={() => handleRequestEdit(row)}
                                  className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Modifier le rapport</span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {row.expenseItems?.map((expItem, idx) => (
                                <div key={expItem.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between shadow-2xs">
                                  <div>
                                    <span className="font-bold text-slate-800 block text-xs">{expItem.motif || 'Poste sans libellé'}</span>
                                    <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                                      <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
                                      <span>Date: <strong className="text-slate-700">{row.date}</strong></span>
                                      <span>•</span>
                                      <span>N°{idx + 1}</span>
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    {expItem.amountFC > 0 && <div className="font-bold text-slate-900">{formatFC(expItem.amountFC)}</div>}
                                    {expItem.amountUSD > 0 && <div className="font-bold text-rose-600 font-mono">{formatUSD(expItem.amountUSD)}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          {/* TOTAL ROW */}
          <tfoot className="bg-slate-900 text-white font-bold sticky bottom-0 z-10 text-xs sm:text-sm">
            <tr>
              <td colSpan={2} className="px-6 py-3.5 uppercase tracking-wider">TOTAL GENERAL</td>
              <td className="px-6 py-3.5 text-emerald-300 font-bold whitespace-nowrap">
                {formatFC(sumRecettesFC)}
              </td>
              <td className="px-6 py-3.5 text-emerald-400 font-mono font-bold whitespace-nowrap">
                {formatUSD(sumRecettesUSD)}
              </td>
              <td className="px-6 py-3.5 text-rose-300 font-bold whitespace-nowrap">
                {formatFC(sumDepensesFC)}
              </td>
              <td className="px-6 py-3.5 text-rose-400 font-mono font-bold whitespace-nowrap">
                {formatUSD(sumDepensesUSD)}
              </td>
              <td className="px-6 py-3.5 text-slate-400 text-xs font-normal text-center italic">
                -
              </td>
              <td className="px-6 py-3.5 text-indigo-300 font-bold whitespace-nowrap">
                {formatFC(soldeFC)}
              </td>
              <td className="px-6 py-3.5 text-indigo-300 font-mono font-bold whitespace-nowrap">
                {formatUSD(soldeUSD)}
              </td>
              <td colSpan={2} className="px-6 py-3.5 text-center text-slate-400 font-normal text-xs">
                Synthèse {filteredReports.length} jours
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Monthly Notes & Observations Banner if present */}
      {sortedReports.some((r) => r.notes && !r.isRestDay) && (
        <div className="mx-6 my-3 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs">
          <span className="text-base leading-none">📌</span>
          <div className="flex-1 space-y-1">
            <span className="font-bold text-amber-950 uppercase text-[10px] tracking-wide">Observations & Remarques enregistrées :</span>
            {sortedReports
              .filter((r) => r.notes && !r.isRestDay)
              .map((r) => (
                <p key={r.id} className="text-amber-900 font-medium">
                  <strong>{r.date} ({r.shopId === 'limete' ? 'Limete' : 'Lingwala'}) :</strong> {r.notes}
                </p>
              ))}
          </div>
        </div>
      )}

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <p>Note: Les modifications et suppressions sont protégées par le système d'authentification par mot de passe.</p>
        <span className="font-bold text-slate-700">MBC Print © 2026</span>
      </div>

      {/* Password Prompt for edit/delete */}
      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
        title={pendingAction?.type === 'edit' ? 'Modification de Rapport Protégée' : 'Suppression de Rapport Protégée'}
        description={
          pendingAction?.report
            ? `Cette opération concerne l'Imprimerie de ${pendingAction.report.shopId === 'limete' ? 'Limete' : 'Lingwala'}. Entrez le mot de passe de ce shop ou le mot de passe Administrateur pour valider.`
            : 'Entrez le mot de passe pour continuer.'
        }
        targetShopId={pendingAction?.report.shopId}
        accounts={accounts}
        currentUser={currentUser}
      />
    </div>
  );
};

