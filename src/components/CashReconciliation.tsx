import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Landmark, 
  TrendingDown,
  TrendingUp,
  Save,
  Printer,
  History,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  Clock,
  User,
  Sparkles,
  Info
} from 'lucide-react';
import { CashDenominationCount, CashAuditRecord, DailyReportItem, ShopId, UserAccount } from '../types';
import { formatFC, formatUSD } from '../utils/formatters';
import { TARGET_PHYSICAL_CASH_FC } from '../data/initialData';

interface CashReconciliationProps {
  soldeTheoreticalFC: number;
  soldeTheoreticalUSD: number;
  exchangeRate: number;
  reports?: DailyReportItem[];
  activeShopId?: ShopId | 'all';
  currentUser?: UserAccount | null;
  selectedMonth?: string;
  cashInHandFC?: number;
  cashInHandUSD?: number;
  onUpdateCashInHand?: (fc: number, usd: number) => void;
  preselectedDayDate?: string | null;
  onClearPreselectedDay?: () => void;
}

export const CashReconciliation: React.FC<CashReconciliationProps> = ({
  soldeTheoreticalFC,
  soldeTheoreticalUSD,
  exchangeRate,
  reports = [],
  activeShopId = 'lingwala',
  currentUser,
  selectedMonth = '08/2026',
  cashInHandFC: propCashInHandFC,
  cashInHandUSD: propCashInHandUSD,
  onUpdateCashInHand,
  preselectedDayDate,
  onClearPreselectedDay,
}) => {
  // Input method: 'direct' (quick amount inputs) vs 'denominations' (counting per banknote/denomination)
  const [inputMode, setInputMode] = useState<'direct' | 'denominations'>('direct');

  // Comparison Scope:
  // 'period' -> overall theoretical balance for the active month/period
  // 'day' -> theoretical balance of a specific day chosen from daily reports
  // 'target' -> custom physical target / baseline (e.g. 3,724,650 FC or user defined)
  const [comparisonScope, setComparisonScope] = useState<'period' | 'day' | 'target'>(
    preselectedDayDate ? 'day' : 'period'
  );

  // Selected Day for 'day' scope
  const [selectedDayDate, setSelectedDayDate] = useState<string>(() => {
    if (preselectedDayDate) return preselectedDayDate;
    if (reports.length > 0) return reports[0].date;
    return '03/08/2026';
  });

  // Target Physical Cash baseline for 'target' scope
  const [customTargetFC, setCustomTargetFC] = useState<number>(TARGET_PHYSICAL_CASH_FC);
  const [customTargetUSD, setCustomTargetUSD] = useState<number>(0);

  // Cash in hand state (Internal state if not controlled via props)
  const [localCashFC, setLocalCashFC] = useState<number>(() => {
    if (propCashInHandFC !== undefined) return propCashInHandFC;
    try {
      const saved = localStorage.getItem('mbc_cash_in_hand_fc');
      return saved ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [localCashUSD, setLocalCashUSD] = useState<number>(() => {
    if (propCashInHandUSD !== undefined) return propCashInHandUSD;
    try {
      const saved = localStorage.getItem('mbc_cash_in_hand_usd');
      return saved ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const cashFC = propCashInHandFC !== undefined ? propCashInHandFC : localCashFC;
  const cashUSD = propCashInHandUSD !== undefined ? propCashInHandUSD : localCashUSD;

  const updateCashAmounts = (newFC: number, newUSD: number) => {
    const validFC = Math.max(0, Math.round(newFC || 0));
    const validUSD = Math.max(0, Number(newUSD || 0));
    setLocalCashFC(validFC);
    setLocalCashUSD(validUSD);
    try {
      localStorage.setItem('mbc_cash_in_hand_fc', validFC.toString());
      localStorage.setItem('mbc_cash_in_hand_usd', validUSD.toString());
    } catch (e) {
      console.warn('Failed to save cash in hand', e);
    }
    if (onUpdateCashInHand) {
      onUpdateCashInHand(validFC, validUSD);
    }
  };

  // Denominations state
  const [denominations, setDenominations] = useState<CashDenominationCount>(() => {
    try {
      const saved = localStorage.getItem('mbc_cash_denominations');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      fc20000: 0,
      fc10000: 0,
      fc5000: 0,
      fc1000: 0,
      fc500: 0,
      usd100: 0,
      usd50: 0,
      usd20: 0,
      usd10: 0,
      usd5: 0,
      usd1: 0,
    };
  });

  // When preselectedDayDate changes from parent
  useEffect(() => {
    if (preselectedDayDate) {
      setComparisonScope('day');
      setSelectedDayDate(preselectedDayDate);
    }
  }, [preselectedDayDate]);

  // Denomination Calculations
  const denomTotalFC = useMemo(() => {
    return (
      (denominations.fc20000 || 0) * 20000 +
      (denominations.fc10000 || 0) * 10000 +
      (denominations.fc5000 || 0) * 5000 +
      (denominations.fc1000 || 0) * 1000 +
      (denominations.fc500 || 0) * 500
    );
  }, [denominations]);

  const denomTotalUSD = useMemo(() => {
    return (
      (denominations.usd100 || 0) * 100 +
      (denominations.usd50 || 0) * 50 +
      (denominations.usd20 || 0) * 20 +
      (denominations.usd10 || 0) * 10 +
      (denominations.usd5 || 0) * 5 +
      (denominations.usd1 || 0) * 1
    );
  }, [denominations]);

  const handleDenominationChange = (key: keyof CashDenominationCount, value: number) => {
    const val = Math.max(0, Math.floor(value || 0));
    const next = { ...denominations, [key]: val };
    setDenominations(next);
    try {
      localStorage.setItem('mbc_cash_denominations', JSON.stringify(next));
    } catch (e) {
      console.warn('Failed to save denominations', e);
    }

    // Automatically recalculate cash in hand
    const nextFC =
      (next.fc20000 || 0) * 20000 +
      (next.fc10000 || 0) * 10000 +
      (next.fc5000 || 0) * 5000 +
      (next.fc1000 || 0) * 1000 +
      (next.fc500 || 0) * 500;

    const nextUSD =
      (next.usd100 || 0) * 100 +
      (next.usd50 || 0) * 50 +
      (next.usd20 || 0) * 20 +
      (next.usd10 || 0) * 10 +
      (next.usd5 || 0) * 5 +
      (next.usd1 || 0) * 1;

    updateCashAmounts(nextFC, nextUSD);
  };

  const handleResetCounter = () => {
    const zeroDenoms = {
      fc20000: 0,
      fc10000: 0,
      fc5000: 0,
      fc1000: 0,
      fc500: 0,
      usd100: 0,
      usd50: 0,
      usd20: 0,
      usd10: 0,
      usd5: 0,
      usd1: 0,
    };
    setDenominations(zeroDenoms);
    try {
      localStorage.setItem('mbc_cash_denominations', JSON.stringify(zeroDenoms));
    } catch {}
    updateCashAmounts(0, 0);
  };

  // Selected Day Report lookup
  const selectedDayReport = useMemo(() => {
    return reports.find((r) => r.date === selectedDayDate);
  }, [reports, selectedDayDate]);

  // Determine Effective Theoretical Cash Balance depending on Scope
  const { theoreticalFC, theoreticalUSD, scopeLabel, scopeSubtext } = useMemo(() => {
    if (comparisonScope === 'day') {
      if (selectedDayReport) {
        const fc = (selectedDayReport.recettesFC || 0) - (selectedDayReport.depensesFC || 0);
        const usd = (selectedDayReport.recettesUSD || 0) - (selectedDayReport.depensesUSD || 0);
        return {
          theoreticalFC: fc,
          theoreticalUSD: usd,
          scopeLabel: `Journée du ${selectedDayReport.date}`,
          scopeSubtext: `Recettes: ${formatFC(selectedDayReport.recettesFC)} / ${formatUSD(selectedDayReport.recettesUSD)} - Dépenses: ${formatFC(selectedDayReport.depensesFC)} / ${formatUSD(selectedDayReport.depensesUSD)}`,
        };
      }
      return {
        theoreticalFC: 0,
        theoreticalUSD: 0,
        scopeLabel: `Journée ${selectedDayDate || 'Non trouvée'}`,
        scopeSubtext: 'Aucune écriture enregistrée pour cette date',
      };
    }

    if (comparisonScope === 'target') {
      return {
        theoreticalFC: customTargetFC,
        theoreticalUSD: customTargetUSD,
        scopeLabel: 'Fond Cible / Montant Fixe Référent',
        scopeSubtext: 'Objectif de caisse défini manuellement',
      };
    }

    // Default: 'period'
    return {
      theoreticalFC: soldeTheoreticalFC,
      theoreticalUSD: soldeTheoreticalUSD,
      scopeLabel: `Période en cours (${selectedMonth || 'Toutes dates'})`,
      scopeSubtext: `Solde cumulé du shop [${activeShopId === 'all' ? 'Consolidé (2 Shops)' : activeShopId.toUpperCase()}]`,
    };
  }, [
    comparisonScope,
    selectedDayReport,
    selectedDayDate,
    customTargetFC,
    customTargetUSD,
    soldeTheoreticalFC,
    soldeTheoreticalUSD,
    selectedMonth,
    activeShopId,
  ]);

  // Combined totals & Differences (Écarts de Caisse)
  const cashInHandCombinedFC = cashFC + cashUSD * exchangeRate;
  const cashInHandCombinedUSD = cashUSD + cashFC / (exchangeRate || 1);

  const theoreticalCombinedFC = theoreticalFC + theoreticalUSD * exchangeRate;
  const theoreticalCombinedUSD = theoreticalUSD + theoreticalFC / (exchangeRate || 1);

  const diffFC = cashFC - theoreticalFC;
  const diffUSD = cashUSD - theoreticalUSD;
  const diffCombinedFC = cashInHandCombinedFC - theoreticalCombinedFC;
  const diffCombinedUSD = cashInHandCombinedUSD - theoreticalCombinedUSD;

  // Status of reconciliation
  const isPerfectMatch = Math.abs(diffCombinedFC) < 50; // Tolerance under 50 FC
  const isSurplus = diffCombinedFC >= 50;
  const isDeficit = diffCombinedFC <= -50;

  // Audit history state
  const [auditHistory, setAuditHistory] = useState<CashAuditRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mbc_cash_audit_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [auditNote, setAuditNote] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Quick action: pre-fill cash in hand with theoretical balance
  const handlePreFillWithTheoretical = () => {
    updateCashAmounts(Math.max(0, theoreticalFC), Math.max(0, theoreticalUSD));
  };

  // Quick increment buttons for cash
  const handleQuickAddFC = (delta: number) => {
    updateCashAmounts(cashFC + delta, cashUSD);
  };

  const handleQuickAddUSD = (delta: number) => {
    updateCashAmounts(cashFC, cashUSD + delta);
  };

  // Save Cash Verification into Audit History
  const handleSaveAudit = () => {
    const now = new Date();
    const formatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecord: CashAuditRecord = {
      id: `audit-${Date.now()}`,
      timestamp: now.toISOString(),
      formattedDate: formatted,
      shopId: activeShopId,
      performedBy: currentUser?.name || 'Gérant de caisse',
      cashInHandFC: cashFC,
      cashInHandUSD: cashUSD,
      theoreticalFC: theoreticalFC,
      theoreticalUSD: theoreticalUSD,
      diffFC: diffFC,
      diffUSD: diffUSD,
      diffCombinedFC: diffCombinedFC,
      comparisonScope: comparisonScope === 'period' ? 'period' : comparisonScope === 'day' ? 'day' : 'custom_target',
      targetLabel: scopeLabel,
      notes: auditNote.trim() || undefined,
    };

    const updatedHistory = [newRecord, ...auditHistory];
    setAuditHistory(updatedHistory);
    try {
      localStorage.setItem('mbc_cash_audit_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Failed to save audit history', e);
    }

    setAuditNote('');
    setIsAuditModalOpen(false);
  };

  const handleDeleteAuditRecord = (id: string) => {
    const updated = auditHistory.filter((item) => item.id !== id);
    setAuditHistory(updated);
    try {
      localStorage.setItem('mbc_cash_audit_history', JSON.stringify(updated));
    } catch {}
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Supprimer l'historique complet des contrôles de caisse enregistrés ?")) {
      setAuditHistory([]);
      try {
        localStorage.removeItem('mbc_cash_audit_history');
      } catch {}
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Scope Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <span>Contrôle de Caisse & Argent en Main</span>
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Calcul Automatique
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Indiquez les montants physiques en main (espèces) pour comparaison instantanée avec les écritures du journal
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Imprimer le procès-verbal officiel de contrôle de caisse"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimer PV</span>
            </button>

            <button
              onClick={() => setIsAuditModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Enregistrer ce résultat de vérification dans l'historique"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer ce Contrôle</span>
            </button>
          </div>
        </div>

        {/* Comparison Reference Selector (Scope) */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Scope 1: Month / Period */}
          <button
            type="button"
            onClick={() => {
              setComparisonScope('period');
              if (onClearPreselectedDay) onClearPreselectedDay();
            }}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              comparisonScope === 'period'
                ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Solde Global Période
              </span>
              {comparisonScope === 'period' && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              {selectedMonth ? `Mois ${selectedMonth}` : 'Période active'} ({activeShopId === 'all' ? 'Consolidé' : activeShopId})
            </p>
            <div className="mt-2 text-xs font-black text-indigo-900">
              {formatFC(soldeTheoreticalFC)} + {formatUSD(soldeTheoreticalUSD)}
            </div>
          </button>

          {/* Scope 2: Specific Day (Journal Clôture) */}
          <div
            onClick={() => setComparisonScope('day')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              comparisonScope === 'day'
                ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Clôture d'une Journée
              </span>
              {comparisonScope === 'day' && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-1.5">
              <select
                value={selectedDayDate}
                onChange={(e) => {
                  setSelectedDayDate(e.target.value);
                  setComparisonScope('day');
                }}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full cursor-pointer"
                title="Sélectionner la journée à rapprocher"
              >
                {reports.map((r) => (
                  <option key={r.id || r.date} value={r.date}>
                    {r.date} ({r.shopId.toUpperCase()}) - Solde: {formatFC(r.recettesFC - r.depensesFC)} / {formatUSD(r.recettesUSD - r.depensesUSD)}
                  </option>
                ))}
              </select>
            </div>

            {selectedDayReport && (
              <div className="mt-1.5 text-xs font-black text-indigo-900">
                {formatFC((selectedDayReport.recettesFC || 0) - (selectedDayReport.depensesFC || 0))} +{' '}
                {formatUSD((selectedDayReport.recettesUSD || 0) - (selectedDayReport.depensesUSD || 0))}
              </div>
            )}
          </div>

          {/* Scope 3: Target Baseline */}
          <div
            onClick={() => setComparisonScope('target')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              comparisonScope === 'target'
                ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-indigo-600" />
                Fond Cible / Seuil Fixe
              </span>
              {comparisonScope === 'target' && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </div>

            <div className="mt-1 grid grid-cols-2 gap-1.5">
              <div>
                <input
                  type="number"
                  value={customTargetFC || ''}
                  onChange={(e) => setCustomTargetFC(Number(e.target.value) || 0)}
                  placeholder="3 724 650"
                  className="w-full bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold text-slate-800"
                  title="Fond de caisse cible en FC"
                />
                <span className="text-[10px] text-slate-400">FC cible</span>
              </div>
              <div>
                <input
                  type="number"
                  value={customTargetUSD || ''}
                  onChange={(e) => setCustomTargetUSD(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs font-bold text-slate-800"
                  title="Fond de caisse cible en USD"
                />
                <span className="text-[10px] text-slate-400">$ cible</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* THREE LIVE KPI CARDS: 1. Argent en Main | 2. Solde Théorique | 3. Écart Calculé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Argent en Main (Physical Cash Counted) */}
        <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-indigo-600" />
            1. Argent en Main (Physique)
          </span>
          
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900">
              {formatFC(cashFC)}
            </div>
            <div className="text-sm font-bold text-emerald-600 mt-0.5">
              + {formatUSD(cashUSD)}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Équivalent Global :</span>
            <span className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {formatFC(cashInHandCombinedFC)} ({formatUSD(cashInHandCombinedUSD)})
            </span>
          </div>
        </div>

        {/* Card 2: Solde Théorique (Expected from Books) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-slate-500" />
            2. Solde Théorique Attendu
          </span>

          <div className="mt-2.5">
            <div className={`text-2xl font-black ${theoreticalFC < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {formatFC(theoreticalFC)}
            </div>
            <div className={`text-sm font-bold mt-0.5 ${theoreticalUSD < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {theoreticalUSD >= 0 ? `+ ${formatUSD(theoreticalUSD)}` : formatUSD(theoreticalUSD)}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 truncate mr-2" title={scopeLabel}>
              Réf : {scopeLabel}
            </span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {formatFC(theoreticalCombinedFC)}
            </span>
          </div>
        </div>

        {/* Card 3: Écart Automatique (Calculated Variance) */}
        <div
          className={`rounded-2xl border-2 p-5 shadow-xs relative overflow-hidden transition-all ${
            isPerfectMatch
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : isSurplus
              ? 'bg-blue-50/90 border-blue-300 text-blue-950'
              : 'bg-rose-50/90 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              {isPerfectMatch ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : isSurplus ? (
                <TrendingUp className="w-4 h-4 text-blue-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              )}
              3. Écart de Caisse (Différence)
            </span>

            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                isPerfectMatch
                  ? 'bg-emerald-200 text-emerald-800'
                  : isSurplus
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-rose-200 text-rose-800'
              }`}
            >
              {isPerfectMatch ? 'Conforme' : isSurplus ? 'Excédent' : 'Manquant'}
            </span>
          </div>

          <div className="mt-2.5">
            <div className={`text-2xl font-black ${
              isPerfectMatch ? 'text-emerald-700' : isSurplus ? 'text-blue-700' : 'text-rose-700'
            }`}>
              {diffFC > 0 ? `+${formatFC(diffFC)}` : diffFC < 0 ? `-${formatFC(Math.abs(diffFC))}` : '0 FC'}
            </div>
            <div className={`text-sm font-bold mt-0.5 ${
              isPerfectMatch ? 'text-emerald-600' : isSurplus ? 'text-blue-600' : 'text-rose-600'
            }`}>
              {diffUSD > 0 ? `+${formatUSD(diffUSD)}` : diffUSD < 0 ? `-${formatUSD(Math.abs(diffUSD))}` : '$0.00'}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs font-medium">
            {isPerfectMatch ? (
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600" />
                Caisse parfaitement équilibrée (aucun écart).
              </span>
            ) : isSurplus ? (
              <span className="text-blue-800 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 inline text-blue-600" />
                Surplus net de +{formatFC(diffCombinedFC)} (+{formatUSD(diffCombinedUSD)})
              </span>
            ) : (
              <span className="text-rose-800 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 inline text-rose-600" />
                Déficit net de -{formatFC(Math.abs(diffCombinedFC))} (-{formatUSD(Math.abs(diffCombinedUSD))})
              </span>
            )}
          </div>
        </div>

      </div>

      {/* SECTION: AJOUT & GESTION DE L'ARGENT EN MAIN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Tabs: Saisie Rapide Directe vs Billetage par Coupures */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border-b border-slate-200 gap-3">
          <div>
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              Saisie de l'Argent en Main (Espèces disponibles)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choisissez votre méthode : saisie directe des montants ou comptage billet par billet
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-2xs flex text-xs font-bold">
              <button
                type="button"
                onClick={() => setInputMode('direct')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  inputMode === 'direct'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Saisie Directe
              </button>
              <button
                type="button"
                onClick={() => setInputMode('denominations')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  inputMode === 'denominations'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Billetage par Coupures
              </button>
            </div>

            <button
              onClick={handlePreFillWithTheoretical}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Pré-remplir l'argent en main avec le montant théorique pour tester la conformité"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Copier Théorique</span>
            </button>

            <button
              onClick={handleResetCounter}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Remettre les montants et le comptage à zéro"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Remise à 0</span>
            </button>
          </div>
        </div>

        {/* Content based on inputMode */}
        {inputMode === 'direct' ? (
          /* Saisie Directe des Espèces */
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Field 1: Espèces en Francs Congolais (FC) */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    Espèces en Main (Francs Congolais - FC)
                  </label>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                    FC
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={cashFC || ''}
                    placeholder="0"
                    onChange={(e) => updateCashAmounts(Number(e.target.value) || 0, cashUSD)}
                    className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-2xl font-black text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all text-right pr-14"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    FC
                  </span>
                </div>

                {/* Quick Increment Buttons FC */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Raccourcis :</span>
                  {[
                    { label: '+10 000', val: 10000 },
                    { label: '+50 000', val: 50000 },
                    { label: '+100 000', val: 100000 },
                    { label: '+500 000', val: 500000 },
                    { label: '+1 000 000', val: 1000000 },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      type="button"
                      onClick={() => handleQuickAddFC(btn.val)}
                      className="px-2 py-1 bg-white hover:bg-slate-200/70 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateCashAmounts(0, cashUSD)}
                    className="px-2 py-1 bg-slate-200/70 hover:bg-rose-100 hover:text-rose-700 rounded-lg text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    Effacer FC
                  </button>
                </div>
              </div>

              {/* Field 2: Espèces en Dollars ($ USD) */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    Espèces en Main (Dollars - $ USD)
                  </label>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                    USD
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={cashUSD || ''}
                    placeholder="0"
                    onChange={(e) => updateCashAmounts(cashFC, Number(e.target.value) || 0)}
                    className="w-full bg-white border-2 border-slate-300 rounded-xl px-4 py-3 text-2xl font-black text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all text-right pr-14"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    $
                  </span>
                </div>

                {/* Quick Increment Buttons USD */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Raccourcis :</span>
                  {[
                    { label: '+$10', val: 10 },
                    { label: '+$20', val: 20 },
                    { label: '+$50', val: 50 },
                    { label: '+$100', val: 100 },
                    { label: '+$500', val: 500 },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      type="button"
                      onClick={() => handleQuickAddUSD(btn.val)}
                      className="px-2 py-1 bg-white hover:bg-slate-200/70 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      {btn.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateCashAmounts(cashFC, 0)}
                    className="px-2 py-1 bg-slate-200/70 hover:bg-rose-100 hover:text-rose-700 rounded-lg text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    Effacer $
                  </button>
                </div>
              </div>

            </div>

            {/* Note & Billetage shortcut helper */}
            <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-indigo-900">
                <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  <strong>Astuce Comptage :</strong> Vous avez des liasses de billets ? Utilisez le mode{' '}
                  <button
                    type="button"
                    onClick={() => setInputMode('denominations')}
                    className="underline font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                  >
                    Billetage par Coupures
                  </button>{' '}
                  pour compter chaque coupure (20 000, 10 000, 5 000 FC, billets de 100 $, etc.).
                </span>
              </div>
              <div className="text-slate-600 font-semibold shrink-0">
                Taux appliqué : 1 $ = {exchangeRate} FC
              </div>
            </div>
          </div>
        ) : (
          /* Billetage Détaillé par Coupures */
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Billetage en Francs Congolais (FC) */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center">
                    <Coins className="w-4 h-4 mr-2 text-emerald-600" />
                    Coupures Francs Congolais (FC)
                  </h4>
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Sous-total : {formatFC(denomTotalFC)}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { key: 'fc20000', label: 'Billets de 20 000 FC', val: 20000 },
                    { key: 'fc10000', label: 'Billets de 10 000 FC', val: 10000 },
                    { key: 'fc5000', label: 'Billets de 5 000 FC', val: 5000 },
                    { key: 'fc1000', label: 'Billets de 1 000 FC', val: 1000 },
                    { key: 'fc500', label: 'Billets de 500 FC', val: 500 },
                  ].map((denom) => {
                    const count = denominations[denom.key as keyof CashDenominationCount];
                    const subtotal = count * denom.val;

                    return (
                      <div
                        key={denom.key}
                        className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-2xs"
                      >
                        <span className="font-bold text-slate-700 w-36">{denom.label}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 font-medium">x</span>
                          <input
                            type="number"
                            min="0"
                            value={count || ''}
                            placeholder="0"
                            onChange={(e) =>
                              handleDenominationChange(
                                denom.key as keyof CashDenominationCount,
                                Number(e.target.value)
                              )
                            }
                            className="w-16 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-center font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <span className="font-black text-slate-900 w-28 text-right font-mono">
                          {formatFC(subtotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Billetage en Dollars ($ USD) */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                    Coupures Dollars ($ USD)
                  </h4>
                  <span className="text-xs font-black text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-md border border-blue-200">
                    Sous-total : {formatUSD(denomTotalUSD)}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { key: 'usd100', label: 'Coupures de $100', val: 100 },
                    { key: 'usd50', label: 'Coupures de $50', val: 50 },
                    { key: 'usd20', label: 'Coupures de $20', val: 20 },
                    { key: 'usd10', label: 'Coupures de $10', val: 10 },
                    { key: 'usd5', label: 'Coupures de $5', val: 5 },
                    { key: 'usd1', label: 'Coupures de $1', val: 1 },
                  ].map((denom) => {
                    const count = denominations[denom.key as keyof CashDenominationCount];
                    const subtotal = count * denom.val;

                    return (
                      <div
                        key={denom.key}
                        className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs shadow-2xs"
                      >
                        <span className="font-bold text-slate-700 w-36">{denom.label}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 font-medium">x</span>
                          <input
                            type="number"
                            min="0"
                            value={count || ''}
                            placeholder="0"
                            onChange={(e) =>
                              handleDenominationChange(
                                denom.key as keyof CashDenominationCount,
                                Number(e.target.value)
                              )
                            }
                            className="w-16 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-center font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <span className="font-black text-slate-900 w-24 text-right font-mono">
                          {formatUSD(subtotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl text-xs font-semibold text-slate-600">
              <span>Le résultat du billetage est automatiquement répercuté sur votre argent en main global.</span>
              <button
                type="button"
                onClick={() => setInputMode('direct')}
                className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
              >
                Retour à la saisie directe
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DIAGNOSTIC DÉTAILLÉ & CONSEILS D'AUDIT COMPTABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Diagnostic Automatique & Recommandations de Caisse</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-800 block">Détail des Calculs Automatiques :</span>
            <div className="space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Argent physique en Francs :</span>
                <span className="font-bold font-mono text-slate-900">{formatFC(cashFC)}</span>
              </div>
              <div className="flex justify-between">
                <span>Solde théorique attendu en Francs :</span>
                <span className="font-bold font-mono text-slate-900">{formatFC(theoreticalFC)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                <span>Écart net en Francs :</span>
                <span className={diffFC >= 0 ? 'text-indigo-600 font-mono' : 'text-rose-600 font-mono'}>
                  {diffFC >= 0 ? `+${formatFC(diffFC)}` : formatFC(diffFC)}
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span>Argent physique en Dollars :</span>
                <span className="font-bold font-mono text-slate-900">{formatUSD(cashUSD)}</span>
              </div>
              <div className="flex justify-between">
                <span>Solde théorique attendu en Dollars :</span>
                <span className="font-bold font-mono text-slate-900">{formatUSD(theoreticalUSD)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                <span>Écart net en Dollars :</span>
                <span className={diffUSD >= 0 ? 'text-indigo-600 font-mono' : 'text-rose-600 font-mono'}>
                  {diffUSD >= 0 ? `+${formatUSD(diffUSD)}` : formatUSD(diffUSD)}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border text-xs flex flex-col justify-between ${
              isPerfectMatch
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : isSurplus
                ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                : 'bg-rose-50/70 border-rose-200 text-rose-900'
            }`}
          >
            <div>
              <span className="font-black text-sm block mb-1">
                {isPerfectMatch
                  ? '✨ Caisse Parfaite & Certifiée'
                  : isSurplus
                  ? '⚠️ Constat d’Excédent de Caisse (Surplus)'
                  : '🚨 Constat de Manquant / Déficit de Caisse'}
              </span>
              <p className="text-xs leading-relaxed">
                {isPerfectMatch
                  ? 'Aucune discordance détectée entre les pièces physiques et les écritures du journal. Vous pouvez valider et archiver ce contrôle en toute sérénité.'
                  : isSurplus
                  ? `Vous avez plus d'argent en main que prévu (+${formatFC(diffCombinedFC)}). Vérifiez si une recette client a été encaissée sans être enregistrée dans le journal du jour ou si une avance a été remboursée.`
                  : `Il manque physiquement ${formatFC(Math.abs(diffCombinedFC))} en caisse. Vérifiez si une dépense d'atelier ou un achat de consommable n'a pas été encodé, ou s'il y a eu une erreur de rendu monnaie.`}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-current/20 flex items-center justify-between">
              <span className="font-semibold text-[11px]">
                Opérateur : {currentUser?.name || 'Gérant'}
              </span>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(true)}
                className="px-3 py-1 bg-white rounded-lg shadow-2xs font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Archiver ce PV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HISTORIQUE DES CONTRÔLES DE CAISSE ENREGISTRÉS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-sm">
              Historique des Contrôles & Clôtures de Caisse
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              {auditHistory.length} archivé{auditHistory.length > 1 ? 's' : ''}
            </span>
          </div>

          {auditHistory.length > 0 && (
            <button
              onClick={handleClearAllHistory}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
            >
              Vider l'historique
            </button>
          )}
        </div>

        {auditHistory.length === 0 ? (
          <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">Aucun contrôle de caisse archivé</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cliquez sur « Enregistrer ce Contrôle » pour archiver une vérification de caisse horodatée.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date & Heure</th>
                  <th className="py-2.5 px-3">Shop</th>
                  <th className="py-2.5 px-3">Opérateur</th>
                  <th className="py-2.5 px-3">Référence / Scope</th>
                  <th className="py-2.5 px-3 text-right">En Main Constaté</th>
                  <th className="py-2.5 px-3 text-right">Théorique Attendu</th>
                  <th className="py-2.5 px-3 text-right">Écart</th>
                  <th className="py-2.5 px-3">Statut</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditHistory.map((item) => {
                  const isRecordMatch = Math.abs(item.diffCombinedFC) < 50;
                  const isRecordSurplus = item.diffCombinedFC >= 50;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        {item.formattedDate}
                      </td>
                      <td className="py-2.5 px-3 font-bold uppercase text-[11px]">
                        {item.shopId}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {item.performedBy}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-[160px] truncate" title={item.targetLabel}>
                        {item.targetLabel}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900 font-mono whitespace-nowrap">
                        {formatFC(item.cashInHandFC)} {item.cashInHandUSD > 0 ? `+ ${formatUSD(item.cashInHandUSD)}` : ''}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-600 font-mono whitespace-nowrap">
                        {formatFC(item.theoreticalFC)} {item.theoreticalUSD > 0 ? `+ ${formatUSD(item.theoreticalUSD)}` : ''}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black font-mono whitespace-nowrap">
                        <span
                          className={
                            isRecordMatch
                              ? 'text-emerald-700'
                              : isRecordSurplus
                              ? 'text-blue-700'
                              : 'text-rose-700'
                          }
                        >
                          {item.diffCombinedFC >= 0
                            ? `+${formatFC(item.diffCombinedFC)}`
                            : `-${formatFC(Math.abs(item.diffCombinedFC))}`}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase inline-block ${
                            isRecordMatch
                              ? 'bg-emerald-100 text-emerald-800'
                              : isRecordSurplus
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isRecordMatch ? 'Conforme' : isRecordSurplus ? 'Surplus' : 'Déficit'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteAuditRecord(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Supprimer cette archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: ARCHIVER LE CONTRÔLE DE CAISSE */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Save className="w-5 h-5 text-indigo-600" />
                Archiver ce Contrôle de Caisse
              </h3>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Shop :</span>
                  <span className="font-bold text-slate-800 uppercase">{activeShopId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Référence :</span>
                  <span className="font-bold text-slate-800">{scopeLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Argent en Main :</span>
                  <span className="font-black text-slate-900">{formatFC(cashFC)} + {formatUSD(cashUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Solde Théorique :</span>
                  <span className="font-bold text-slate-700">{formatFC(theoreticalFC)} + {formatUSD(theoreticalUSD)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                  <span className="text-slate-600">Écart calculé :</span>
                  <span className={diffCombinedFC >= 0 ? 'text-indigo-600' : 'text-rose-600'}>
                    {diffCombinedFC >= 0 ? `+${formatFC(diffCombinedFC)}` : formatFC(diffCombinedFC)}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Observations / Remarques (Optionnel) :
                </label>
                <textarea
                  value={auditNote}
                  onChange={(e) => setAuditNote(e.target.value)}
                  placeholder="Ex : Clôture normale fin de service, recomptage vérifié avec le gérant..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveAudit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirmer l'Archivage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / FICHE D'IMPRESSION DU PROCÈS-VERBAL DE CAISSE */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 no-print">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-indigo-600" />
                Procès-Verbal de Contrôle de Caisse
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer ce Document</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div className="border border-slate-200 rounded-xl p-6 bg-white space-y-6 text-slate-900">
              
              {/* Slip Header */}
              <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">MBC PRINT DRC</h1>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    Solutions d'Impression Numérique & DTF Haute Définition
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Kinshasa - RDC | Shop : {activeShopId === 'all' ? 'Consolidé (Lingwala & Limete)' : activeShopId.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 font-black text-xs rounded-lg uppercase tracking-wider border border-slate-300 inline-block">
                    Procès-Verbal de Caisse
                  </span>
                  <p className="text-xs text-slate-500 mt-1.5 font-medium">
                    Date : {new Date().toLocaleDateString('fr-FR')} {new Date().toLocaleTimeString('fr-FR')}
                  </p>
                  <p className="text-xs text-slate-500">
                    Opérateur : <strong>{currentUser?.name || 'Gérant'}</strong>
                  </p>
                </div>
              </div>

              {/* Rapprochement Summary */}
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between">
                  <span className="font-bold text-slate-700">Base de Comparaison :</span>
                  <span className="font-extrabold text-indigo-900">{scopeLabel}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <span className="font-bold text-slate-600 block uppercase text-[10px]">Argent Physique Constaté (En Main)</span>
                    <div className="text-base font-black text-slate-900 mt-1">
                      {formatFC(cashFC)}
                    </div>
                    <div className="text-xs font-bold text-emerald-600">
                      + {formatUSD(cashUSD)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Contre-valeur : {formatFC(cashInHandCombinedFC)}
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                    <span className="font-bold text-slate-600 block uppercase text-[10px]">Solde Théorique du Journal</span>
                    <div className="text-base font-black text-slate-900 mt-1">
                      {formatFC(theoreticalFC)}
                    </div>
                    <div className="text-xs font-bold text-emerald-600">
                      + {formatUSD(theoreticalUSD)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Contre-valeur : {formatFC(theoreticalCombinedFC)}
                    </div>
                  </div>
                </div>

                {/* Result Box */}
                <div
                  className={`p-4 rounded-xl border text-center ${
                    isPerfectMatch
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : isSurplus
                      ? 'bg-blue-50 border-blue-300 text-blue-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase tracking-wider block">
                    Résultat du Contrôle de Caisse
                  </span>
                  <div className="text-xl font-black mt-1">
                    {isPerfectMatch
                      ? 'CAISSE CONFORME - ÉCART NUL (0 FC)'
                      : isSurplus
                      ? `SURPLUS CONSTATÉ : +${formatFC(diffCombinedFC)} (+${formatUSD(diffCombinedUSD)})`
                      : `MANQUANT CONSTATÉ : -${formatFC(Math.abs(diffCombinedFC))} (-${formatUSD(Math.abs(diffCombinedUSD))})`}
                  </div>
                </div>
              </div>

              {/* Banknotes Breakdown if counted */}
              {(denomTotalFC > 0 || denomTotalUSD > 0) && (
                <div className="border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                  <span className="font-bold text-slate-700 uppercase text-[10px] block">
                    Détail du Billetage Effectué :
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      {denominations.fc20000 > 0 && <div>{denominations.fc20000} x 20 000 FC = {formatFC(denominations.fc20000 * 20000)}</div>}
                      {denominations.fc10000 > 0 && <div>{denominations.fc10000} x 10 000 FC = {formatFC(denominations.fc10000 * 10000)}</div>}
                      {denominations.fc5000 > 0 && <div>{denominations.fc5000} x 5 000 FC = {formatFC(denominations.fc5000 * 5000)}</div>}
                      {denominations.fc1000 > 0 && <div>{denominations.fc1000} x 1 000 FC = {formatFC(denominations.fc1000 * 1000)}</div>}
                      {denominations.fc500 > 0 && <div>{denominations.fc500} x 500 FC = {formatFC(denominations.fc500 * 500)}</div>}
                    </div>
                    <div>
                      {denominations.usd100 > 0 && <div>{denominations.usd100} x $100 = {formatUSD(denominations.usd100 * 100)}</div>}
                      {denominations.usd50 > 0 && <div>{denominations.usd50} x $50 = {formatUSD(denominations.usd50 * 50)}</div>}
                      {denominations.usd20 > 0 && <div>{denominations.usd20} x $20 = {formatUSD(denominations.usd20 * 20)}</div>}
                      {denominations.usd10 > 0 && <div>{denominations.usd10} x $10 = {formatUSD(denominations.usd10 * 10)}</div>}
                      {denominations.usd5 > 0 && <div>{denominations.usd5} x $5 = {formatUSD(denominations.usd5 * 5)}</div>}
                      {denominations.usd1 > 0 && <div>{denominations.usd1} x $1 = {formatUSD(denominations.usd1 * 1)}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <p className="font-bold text-slate-700">Le Caissier / Opérateur</p>
                  <div className="h-14"></div>
                  <p className="text-[10px] text-slate-400 border-t border-dashed border-slate-300 pt-1">
                    Signature & Date
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-700">Le Gérant de l'Atelier</p>
                  <div className="h-14"></div>
                  <p className="text-[10px] text-slate-400 border-t border-dashed border-slate-300 pt-1">
                    Signature & Visa
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-700">La Direction Générale</p>
                  <div className="h-14"></div>
                  <p className="text-[10px] text-slate-400 border-t border-dashed border-slate-300 pt-1">
                    Pour Approbation
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
