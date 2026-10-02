import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Store, Plus, Trash2, Receipt, Lock, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { DailyReportItem, DetailedExpenseItem, DetailedIncomeItem, ShopId, UserAccount } from '../types';
import { STANDARD_INCOME_CATEGORIES, createDefaultIncomeItems, getCategoryMeta } from '../data/incomeCategories';
import { formatFC, formatUSD } from '../utils/formatters';

interface DailyEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: Omit<DailyReportItem, 'id'> & { id?: string }) => void;
  editingReport?: DailyReportItem | null;
  defaultShopId: ShopId;
  currentUser?: UserAccount | null;
  selectedMonth?: string;
}

export const DailyEntryModal: React.FC<DailyEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingReport,
  defaultShopId,
  currentUser,
  selectedMonth = '09/2026',
}) => {
  const isShopRestricted = currentUser && currentUser.role !== 'admin' && currentUser.shopId !== 'all';
  const effectiveDefaultShop: ShopId = isShopRestricted ? (currentUser.shopId as ShopId) : defaultShopId;

  const [shopId, setShopId] = useState<ShopId>(effectiveDefaultShop);
  const [date, setDate] = useState('');
  const [recettesFC, setRecettesFC] = useState<number | ''>('');
  const [recettesUSD, setRecettesUSD] = useState<number | ''>('');
  const [depensesFC, setDepensesFC] = useState<number | ''>('');
  const [depensesUSD, setDepensesUSD] = useState<number | ''>('');
  const [motifDepenses, setMotifDepenses] = useState('');
  const [isRestDay, setIsRestDay] = useState(false);
  const [notes, setNotes] = useState('');
  const [dateError, setDateError] = useState('');

  // Income entry mode: 'detailed' (breakdown by service) or 'global' (direct totals)
  const [incomeEntryMode, setIncomeEntryMode] = useState<'detailed' | 'global'>('detailed');
  const [incomeItems, setIncomeItems] = useState<DetailedIncomeItem[]>([]);

  // Multi-expense line items
  const [expenseItems, setExpenseItems] = useState<DetailedExpenseItem[]>([]);

  useEffect(() => {
    if (editingReport) {
      setShopId(isShopRestricted ? (currentUser.shopId as ShopId) : (editingReport.shopId || effectiveDefaultShop));
      setDate(editingReport.date);
      setRecettesFC(editingReport.recettesFC || '');
      setRecettesUSD(editingReport.recettesUSD || '');
      setDepensesFC(editingReport.depensesFC || '');
      setDepensesUSD(editingReport.depensesUSD || '');
      setMotifDepenses(editingReport.motifDepenses || '');
      setIsRestDay(!!editingReport.isRestDay);
      setNotes(editingReport.notes || '');

      // Load or initialize income items
      if (editingReport.incomeItems && editingReport.incomeItems.length > 0) {
        setIncomeItems(editingReport.incomeItems);
        setIncomeEntryMode('detailed');
      } else if ((editingReport.recettesFC || 0) > 0 || (editingReport.recettesUSD || 0) > 0) {
        // If editing report without breakdown, populate standard categories and set existing sum in Impression or custom
        const defaults = createDefaultIncomeItems();
        defaults[0].amountFC = editingReport.recettesFC || 0;
        defaults[0].amountUSD = editingReport.recettesUSD || 0;
        defaults[0].motif = 'Recettes reportées';
        setIncomeItems(defaults);
        setIncomeEntryMode('detailed');
      } else {
        setIncomeItems(createDefaultIncomeItems());
        setIncomeEntryMode('detailed');
      }

      // Load or initialize expense items
      if (editingReport.expenseItems && editingReport.expenseItems.length > 0) {
        setExpenseItems(editingReport.expenseItems);
      } else if (editingReport.depensesFC || editingReport.depensesUSD || editingReport.motifDepenses) {
        setExpenseItems([
          {
            id: `exp-init-${Date.now()}`,
            motif: editingReport.motifDepenses || 'Dépenses courantes',
            amountFC: editingReport.depensesFC || 0,
            amountUSD: editingReport.depensesUSD || 0,
          },
        ]);
      } else {
        setExpenseItems([]);
      }
    } else {
      setShopId(effectiveDefaultShop);
      const defaultDate = selectedMonth && selectedMonth !== 'all' ? `01/${selectedMonth}` : '01/09/2026';
      setDate(defaultDate);
      setRecettesFC(0);
      setRecettesUSD(0);
      setDepensesFC('');
      setDepensesUSD('');
      setMotifDepenses('');
      setIsRestDay(false);
      setNotes('');
      setIncomeItems(createDefaultIncomeItems());
      setIncomeEntryMode('detailed');
      setExpenseItems([]);
    }
    setDateError('');
  }, [editingReport, isOpen, effectiveDefaultShop, isShopRestricted, currentUser, selectedMonth]);

  // Recalculate global income totals when income items change
  const handleUpdateIncomeItem = (index: number, field: keyof DetailedIncomeItem, value: any) => {
    const updated = [...incomeItems];
    updated[index] = { ...updated[index], [field]: value };
    setIncomeItems(updated);

    // Auto-update global income sums
    const totalFC = updated.reduce((sum, item) => sum + (Number(item.amountFC) || 0), 0);
    const totalUSD = updated.reduce((sum, item) => sum + (Number(item.amountUSD) || 0), 0);

    setRecettesFC(totalFC);
    setRecettesUSD(totalUSD);
  };

  const handleAddCustomIncomeItem = () => {
    const newItem: DetailedIncomeItem = {
      id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: 'Autres',
      motif: '',
      amountFC: 0,
      amountUSD: 0,
    };
    setIncomeItems((prev) => [...prev, newItem]);
  };

  const handleRemoveIncomeItem = (index: number) => {
    const updated = incomeItems.filter((_, i) => i !== index);
    setIncomeItems(updated);

    const totalFC = updated.reduce((sum, item) => sum + (Number(item.amountFC) || 0), 0);
    const totalUSD = updated.reduce((sum, item) => sum + (Number(item.amountUSD) || 0), 0);

    setRecettesFC(totalFC);
    setRecettesUSD(totalUSD);
  };

  // Recalculate global expense totals when expense items change
  const handleUpdateExpenseItem = (index: number, field: keyof DetailedExpenseItem, value: any) => {
    const updated = [...expenseItems];
    updated[index] = { ...updated[index], [field]: value };
    setExpenseItems(updated);

    const totalFC = updated.reduce((sum, item) => sum + (Number(item.amountFC) || 0), 0);
    const totalUSD = updated.reduce((sum, item) => sum + (Number(item.amountUSD) || 0), 0);
    const combinedMotifs = updated.map((item) => item.motif).filter(Boolean).join(', ');

    setDepensesFC(totalFC);
    setDepensesUSD(totalUSD);
    setMotifDepenses(combinedMotifs);
  };

  const handleAddExpenseItem = () => {
    const newItem: DetailedExpenseItem = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      motif: '',
      amountFC: 0,
      amountUSD: 0,
    };
    setExpenseItems((prev) => [...prev, newItem]);
  };

  const handleRemoveExpenseItem = (index: number) => {
    const updated = expenseItems.filter((_, i) => i !== index);
    setExpenseItems(updated);

    const totalFC = updated.reduce((sum, item) => sum + (Number(item.amountFC) || 0), 0);
    const totalUSD = updated.reduce((sum, item) => sum + (Number(item.amountUSD) || 0), 0);
    const combinedMotifs = updated.map((item) => item.motif).filter(Boolean).join(', ');

    setDepensesFC(totalFC);
    setDepensesUSD(totalUSD);
    setMotifDepenses(combinedMotifs);
  };

  if (!isOpen) return null;

  const normalizeDateStr = (input: string): string => {
    if (!input) return '';
    const trimmed = input.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const [y, m, d] = trimmed.split('-');
      return `${d}/${m}/${y}`;
    }
    return trimmed;
  };

  const toIsoDateStr = (frDate: string): string => {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(frDate.trim())) {
      const [d, m, y] = frDate.trim().split('/');
      return `${y}-${m}-${d}`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDate = normalizeDateStr(date);
    if (!finalDate) {
      setDateError('Veuillez spécifier la date de la journée.');
      return;
    }
    setDateError('');

    // Filter valid income items (those with either an amount > 0 or a filled motif)
    const validIncomeItems = incomeItems.filter(
      (item) => (Number(item.amountFC) || 0) > 0 || (Number(item.amountUSD) || 0) > 0 || item.motif?.trim()
    );

    const totalIncomeFC = incomeItems.reduce((sum, item) => sum + (Number(item.amountFC) || 0), 0);
    const totalIncomeUSD = incomeItems.reduce((sum, item) => sum + (Number(item.amountUSD) || 0), 0);

    const computedRecettesFC =
      incomeEntryMode === 'detailed'
        ? totalIncomeFC
        : Number(recettesFC) || 0;

    const computedRecettesUSD =
      incomeEntryMode === 'detailed'
        ? totalIncomeUSD
        : Number(recettesUSD) || 0;

    // Filter valid expense items
    const validExpenseItems = expenseItems.filter(
      (item) => item.motif.trim() || item.amountFC > 0 || item.amountUSD > 0
    );

    const computedFC =
      validExpenseItems.length > 0
        ? validExpenseItems.reduce((sum, item) => sum + (Number(item.amountFC) || 0), 0)
        : Number(depensesFC) || 0;

    const computedUSD =
      validExpenseItems.length > 0
        ? validExpenseItems.reduce((sum, item) => sum + (Number(item.amountUSD) || 0), 0)
        : Number(depensesUSD) || 0;

    const computedMotif =
      validExpenseItems.length > 0
        ? validExpenseItems.map((i) => i.motif).filter(Boolean).join(', ')
        : motifDepenses.trim();

    onSave({
      id: editingReport ? editingReport.id : undefined,
      shopId,
      date: finalDate,
      recettesFC: isRestDay ? 0 : computedRecettesFC,
      recettesUSD: isRestDay ? 0 : computedRecettesUSD,
      depensesFC: isRestDay ? 0 : computedFC,
      depensesUSD: isRestDay ? 0 : computedUSD,
      motifDepenses: isRestDay ? '' : computedMotif,
      expenseItems: isRestDay ? [] : validExpenseItems,
      incomeItems: isRestDay ? [] : (incomeEntryMode === 'detailed' ? validIncomeItems : []),
      isRestDay,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-200 my-8">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
              <span>{editingReport ? `Éditer la Journée ${editingReport.date}` : 'Nouveau Rapport Journalier'}</span>
              {editingReport && (
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Protégé
                </span>
              )}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Shop Selection */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase flex items-center">
                <Store className="w-4 h-4 mr-1 text-indigo-600" />
                Lieu d'Imprimerie / Shop
              </label>
              {isShopRestricted ? (
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Lock className="w-3 h-3 text-indigo-600" />
                  Verrouillé à votre compte ({currentUser?.name})
                </span>
              ) : (
                <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  Accès Direction Admin (Tous Shops)
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                disabled={isShopRestricted && currentUser?.shopId !== 'lingwala'}
                onClick={() => setShopId('lingwala')}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                  shopId === 'lingwala'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : isShopRestricted && currentUser?.shopId !== 'lingwala'
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer'
                }`}
                title={isShopRestricted && currentUser?.shopId !== 'lingwala' ? "Accès restreint à votre shop Lingwala" : "Imprimerie Lingwala"}
              >
                <span>Imprimerie LINGWALA</span>
                {isShopRestricted && currentUser?.shopId !== 'lingwala' && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
              </button>

              <button
                type="button"
                disabled={isShopRestricted && currentUser?.shopId !== 'limete'}
                onClick={() => setShopId('limete')}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                  shopId === 'limete'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : isShopRestricted && currentUser?.shopId !== 'limete'
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer'
                }`}
                title={isShopRestricted && currentUser?.shopId !== 'limete' ? "Accès restreint à votre shop Limete" : "Imprimerie Limete"}
              >
                <span>Imprimerie LIMETE</span>
                {isShopRestricted && currentUser?.shopId !== 'limete' && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Date de la Journée *
                </label>
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setDate('02/08/2026')}
                    className="text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-indigo-200"
                  >
                    Aujourd'hui
                  </button>
                  <button
                    type="button"
                    onClick={() => setDate('01/08/2026')}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded border border-slate-200"
                  >
                    01/08
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="ex: 02/08/2026"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (dateError) setDateError('');
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <input
                  type="date"
                  value={toIsoDateStr(date)}
                  onChange={(e) => {
                    if (e.target.value) {
                      const [y, m, d] = e.target.value.split('-');
                      setDate(`${d}/${m}/${y}`);
                      if (dateError) setDateError('');
                    }
                  }}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  title="Choisir dans le calendrier"
                />
              </div>
              {dateError && <p className="text-xs text-rose-600 font-bold mt-1">{dateError}</p>}
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center cursor-pointer select-none space-x-2">
                <input
                  type="checkbox"
                  checked={isRestDay}
                  onChange={(e) => setIsRestDay(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Jour de repos (Dimanche)
                </span>
              </label>
            </div>
          </div>

          {!isRestDay && (
            <>
              {/* Entrées / Recettes Détaillées de la journée */}
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-emerald-200/80 pb-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Entrées & Recettes de la journée</span>
                    </h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Détail par prestation : Impression, DTF, Bâche, Polo, Fourniture...
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <div className="bg-emerald-100/80 p-0.5 rounded-lg flex text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setIncomeEntryMode('detailed')}
                        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                          incomeEntryMode === 'detailed'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'text-emerald-800 hover:text-emerald-950'
                        }`}
                      >
                        Ventilation Détaillée
                      </button>
                      <button
                        type="button"
                        onClick={() => setIncomeEntryMode('global')}
                        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                          incomeEntryMode === 'global'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'text-emerald-800 hover:text-emerald-950'
                        }`}
                      >
                        Saisie Globale
                      </button>
                    </div>
                  </div>
                </div>

                {/* DETAILED MODE: PRESTATION BREAKDOWN */}
                {incomeEntryMode === 'detailed' ? (
                  <div className="space-y-2.5 pt-1">
                    <div className="space-y-2">
                      {incomeItems.map((item, index) => {
                        const meta = getCategoryMeta(item.category);
                        const isStandard = STANDARD_INCOME_CATEGORIES.some((c) => c.name.toLowerCase() === item.category.toLowerCase());

                        return (
                          <div
                            key={item.id}
                            className={`p-2.5 rounded-xl border transition-all ${
                              (item.amountFC > 0 || item.amountUSD > 0)
                                ? 'bg-white border-emerald-300 shadow-2xs ring-1 ring-emerald-200/50'
                                : 'bg-white/80 border-slate-200 hover:border-emerald-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-base select-none">{meta.icon}</span>
                                <span className="text-xs font-bold text-slate-800">
                                  {item.category}
                                </span>
                                {(item.amountFC > 0 || item.amountUSD > 0) && (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                    Encaissé
                                  </span>
                                )}
                              </div>

                              {!isStandard && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveIncomeItem(index)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Supprimer cette prestation personnalisée"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              {/* Details / Motif */}
                              <div className="sm:col-span-1">
                                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                                  Détail / Observation (facultatif)
                                </label>
                                <input
                                  type="text"
                                  placeholder={isStandard ? "ex: Quantités, format, spécificités..." : "Libellé de la prestation"}
                                  value={item.motif || ''}
                                  onChange={(e) => handleUpdateIncomeItem(index, 'motif', e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>

                              {/* Amount FC */}
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                                  Montant en Francs (FC)
                                </label>
                                <input
                                  type="number"
                                  placeholder="0 FC"
                                  value={item.amountFC || ''}
                                  onChange={(e) =>
                                    handleUpdateIncomeItem(index, 'amountFC', e.target.value === '' ? 0 : Number(e.target.value))
                                  }
                                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>

                              {/* Amount USD */}
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                                  Montant en Dollars ($ USD)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00 $"
                                  value={item.amountUSD || ''}
                                  onChange={(e) =>
                                    handleUpdateIncomeItem(index, 'amountUSD', e.target.value === '' ? 0 : Number(e.target.value))
                                  }
                                  className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-emerald-600 focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Custom Prestation Button */}
                    <div className="pt-1 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleAddCustomIncomeItem}
                        className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[11px] rounded-lg shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ajouter une autre prestation</span>
                      </button>

                      <span className="text-[11px] text-emerald-700 font-medium">
                        {incomeItems.filter(i => (i.amountFC > 0 || i.amountUSD > 0)).length} service(s) avec recettes saisies
                      </span>
                    </div>

                    {/* Real-time Automatic Revenue Sum Banner with Formula Breakdown */}
                    <div className="p-3.5 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-xl text-white shadow-sm space-y-2 border border-emerald-600/40">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="p-1 bg-emerald-500/20 rounded text-emerald-300">
                              <Sparkles className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
                              Total Recette de la Journée (Calcul Automatique)
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-100/90 mt-0.5">
                            La recette du jour équivaut exactement à la somme de tous les postes d'entrées saisis ci-dessus.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 font-mono font-bold text-base bg-black/40 px-3.5 py-1.5 rounded-lg border border-emerald-400/30 shrink-0 shadow-inner">
                          <span className="text-white">
                            {recettesFC ? `${Number(recettesFC).toLocaleString('fr-FR')} FC` : '0 FC'}
                          </span>
                          <span className="text-emerald-400">/</span>
                          <span className="text-emerald-300">
                            {recettesUSD ? `$${Number(recettesUSD).toFixed(2)}` : '$0.00'}
                          </span>
                        </div>
                      </div>

                      {/* Formula Visual Breakdown */}
                      <div className="pt-2 border-t border-emerald-600/40 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="text-emerald-300 font-bold uppercase mr-1">Détail des entrées :</span>
                        {incomeItems.map((inc, i) => {
                          const hasAmount = (Number(inc.amountFC) || 0) > 0 || (Number(inc.amountUSD) || 0) > 0;
                          const meta = getCategoryMeta(inc.category);
                          return (
                            <span
                              key={inc.id || i}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${
                                hasAmount
                                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 font-bold'
                                  : 'bg-black/20 text-slate-300 border-white/10'
                              }`}
                            >
                              <span>{meta.icon}</span>
                              <span>{inc.category}</span>
                              {hasAmount && (
                                <span className="text-white ml-0.5 font-mono">
                                  ({(Number(inc.amountFC) || 0) > 0 ? `${Number(inc.amountFC).toLocaleString('fr-FR')} FC` : ''}
                                  {(Number(inc.amountFC) || 0) > 0 && (Number(inc.amountUSD) || 0) > 0 ? ' + ' : ''}
                                  {(Number(inc.amountUSD) || 0) > 0 ? `$${Number(inc.amountUSD)}` : ''})
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* GLOBAL ENTRY FALLBACK */
                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-slate-600">
                      Saisie directe des montants globaux si vous ne souhaitez pas détailler par prestation :
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Recette Totale Francs (FC)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={recettesFC}
                          onChange={(e) => setRecettesFC(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Recette Totale Dollars ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={recettesUSD}
                          onChange={(e) => setRecettesUSD(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dépenses Multi-Lignes */}
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-900 uppercase flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-rose-600" />
                    <span>Dépenses de la journée ({expenseItems.length} poste{expenseItems.length > 1 ? 's' : ''})</span>
                  </h4>

                  <button
                    type="button"
                    onClick={handleAddExpenseItem}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg shadow-xs flex items-center space-x-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une dépense</span>
                  </button>
                </div>

                {/* Detailed Expense Line Items */}
                {expenseItems.length > 0 ? (
                  <div className="space-y-2.5 pt-1">
                    {expenseItems.map((item, index) => (
                      <div key={item.id} className="p-2.5 bg-white rounded-lg border border-rose-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded uppercase">
                            Dépense N°{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExpenseItem(index)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Supprimer cette ligne"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="sm:col-span-1">
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Motif / Libellé</label>
                            <input
                              type="text"
                              placeholder="ex: Carburant groupe, Toner..."
                              value={item.motif}
                              onChange={(e) => handleUpdateExpenseItem(index, 'motif', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-rose-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Montant FC</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={item.amountFC || ''}
                              onChange={(e) => handleUpdateExpenseItem(index, 'amountFC', e.target.value === '' ? 0 : Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-rose-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Montant USD ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={item.amountUSD || ''}
                              onChange={(e) => handleUpdateExpenseItem(index, 'amountUSD', e.target.value === '' ? 0 : Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-rose-600 focus:ring-1 focus:ring-rose-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Standard Total Inputs fallback if no multi-items added */
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Dépense Francs (FC)</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={depensesFC}
                          onChange={(e) => setDepensesFC(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Dépense Dollars ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={depensesUSD}
                          onChange={(e) => setDepensesUSD(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-rose-600 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Motif / Justification globale
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Carburant, Toner..."
                        value={motifDepenses}
                        onChange={(e) => setMotifDepenses(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                  </div>
                )}

                {/* Summary Banner for Multi-items */}
                {expenseItems.length > 0 && (
                  <div className="p-2.5 bg-rose-100/70 rounded-lg text-xs font-bold text-rose-900 flex justify-between items-center border border-rose-300/60">
                    <span>Total Dépenses Calculé :</span>
                    <span>
                      {depensesFC ? `${Number(depensesFC).toLocaleString()} FC` : '0 FC'}
                      {'  |  '}
                      <span className="text-rose-700">{depensesUSD ? `$${Number(depensesUSD).toFixed(2)}` : '$0.00'}</span>
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Notes / Remarques */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Remarques / Notes de la journée
            </label>
            <textarea
              rows={2}
              placeholder="Facultatif..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Enregistrer
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};


