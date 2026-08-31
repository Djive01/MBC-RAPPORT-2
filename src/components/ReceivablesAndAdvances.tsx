import React, { useState } from 'react';
import { 
  CreditCard, 
  FileCheck2, 
  AlertTriangle, 
  Plus, 
  CheckCircle, 
  Clock, 
  Building2, 
  Coins, 
  Info, 
  ArrowRight,
  Printer,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import { ReceivableItem, CashAdjustmentItem, ShopId } from '../types';
import { formatFC, formatUSD } from '../utils/formatters';

interface ReceivablesAndAdvancesProps {
  receivables: ReceivableItem[];
  adjustments: CashAdjustmentItem[];
  onToggleReceivableStatus: (id: string) => void;
  onAddReceivable: (item: Omit<ReceivableItem, 'id' | 'shopId'> & { shopId?: ShopId }) => void;
  onEditReceivable?: (item: ReceivableItem) => void;
  onDeleteReceivable?: (id: string) => void;
  onAddAdjustment: (item: Omit<CashAdjustmentItem, 'id' | 'shopId'> & { shopId?: ShopId }) => void;
  onEditAdjustment?: (item: CashAdjustmentItem) => void;
  onDeleteAdjustment?: (id: string) => void;
  exchangeRate: number;
}

export const ReceivablesAndAdvances: React.FC<ReceivablesAndAdvancesProps> = ({
  receivables,
  adjustments,
  onToggleReceivableStatus,
  onAddReceivable,
  onEditReceivable,
  onDeleteReceivable,
  onAddAdjustment,
  onEditAdjustment,
  onDeleteAdjustment,
  exchangeRate,
}) => {
  const [showAddReceivable, setShowAddReceivable] = useState(false);
  const [showAddAdjustment, setShowAddAdjustment] = useState(false);

  // Edit Modals State
  const [editingReceivable, setEditingReceivable] = useState<ReceivableItem | null>(null);
  const [editingAdjustment, setEditingAdjustment] = useState<CashAdjustmentItem | null>(null);

  // New Receivable Form State
  const [client, setClient] = useState('');
  const [desc, setDesc] = useState('');
  const [details, setDetails] = useState('');
  const [amountUSD, setAmountUSD] = useState<number | ''>('');
  const [amountFC, setAmountFC] = useState<number | ''>('');
  const [recDate, setRecDate] = useState('25/07/2026');

  // New Adjustment Form State
  const [adjDesc, setAdjDesc] = useState('');
  const [adjTarget, setAdjTarget] = useState('');
  const [adjUSD, setAdjUSD] = useState<number | ''>('');
  const [adjFC, setAdjFC] = useState<number | ''>('');
  const [adjType, setAdjType] = useState<'ADVANCE' | 'EXPENSE_OUTLAY' | 'DEBT_SETTLEMENT'>('ADVANCE');
  const [adjDate, setAdjDate] = useState('25/07/2026');

  const totalReceivablesUSD = receivables
    .filter((r) => r.status !== 'PAID')
    .reduce((sum, r) => sum + r.amountUSD, 0);

  const totalAdjustmentsUSD = adjustments.reduce((sum, a) => sum + a.amountUSD, 0);
  const totalAdjustmentsFC = adjustments.reduce((sum, a) => sum + a.amountFC, 0);

  const handleSaveReceivable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim()) return;

    onAddReceivable({
      client: client.trim(),
      description: desc.trim() || 'Prestation d\'impression',
      details: details.trim(),
      amountUSD: Number(amountUSD) || 0,
      amountFC: Number(amountFC) || 0,
      status: 'PENDING',
      includedInMainReceipts: false,
      date: recDate.trim() || new Date().toLocaleDateString('fr-FR'),
    });

    setClient('');
    setDesc('');
    setDetails('');
    setAmountUSD('');
    setAmountFC('');
    setShowAddReceivable(false);
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjDesc.trim()) return;

    onAddAdjustment({
      description: adjDesc.trim(),
      targetEntity: adjTarget.trim() || 'Partenaire tierce',
      amountUSD: Number(adjUSD) || 0,
      amountFC: Number(adjFC) || 0,
      type: adjType,
      date: adjDate.trim() || new Date().toLocaleDateString('fr-FR'),
    });

    setAdjDesc('');
    setAdjTarget('');
    setAdjUSD('');
    setAdjFC('');
    setShowAddAdjustment(false);
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: CRÉANCE MBC PRINT 7ÈME RUE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-800 text-base">
                  Créances Clients & Prestations Non Perçues
                </h3>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                  À Recouvrer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Imprimerie MBC Print 7ème rue (Montants non inclus dans les recettes principales)
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddReceivable(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Ajouter une Créance
          </button>
        </div>

        {/* Add Receivable Form */}
        {showAddReceivable && (
          <form onSubmit={handleSaveReceivable} className="p-5 bg-slate-50 border-b border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Enregistrer une nouvelle créance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom du Client / Shop *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: MBC Print 7ème rue, Shop Lingwala, etc."
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Montant ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Montant (FC)</label>
                <input
                  type="number"
                  step="100"
                  placeholder="0 FC"
                  value={amountFC}
                  onChange={(e) => setAmountFC(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Détails de l'impression</label>
                <input
                  type="text"
                  placeholder="ex: 40 A3 DTF + 34m DTF / Bâches..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddReceivable(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs rounded-lg"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                Ajouter
              </button>
            </div>
          </form>
        )}

        {/* Receivables List */}
        <div className="divide-y divide-slate-50">
          {receivables.map((rec) => (
            <div key={rec.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800 text-base">{rec.client}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${
                    rec.status === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rec.status === 'PAID' ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" /> Payé & Réglé
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" /> En Attente
                      </>
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {rec.description} — <span className="text-amber-800 italic">{rec.details}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Note: Ce montant de <strong className="text-slate-700">{formatUSD(rec.amountUSD)}</strong> n'a pas été inclus dans les recettes principales du mois.
                </p>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center">
                <div className="text-right">
                  <div className="text-xl font-extrabold text-amber-600">
                    {formatUSD(rec.amountUSD)}
                  </div>
                  <div className="text-xs text-slate-400">
                    Equiv. {formatFC(rec.amountUSD * exchangeRate)}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onToggleReceivableStatus(rec.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                      rec.status === 'PAID'
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {rec.status === 'PAID' ? 'Marquer En Attente' : 'Marquer comme Recouvré'}
                  </button>

                  <button
                    onClick={() => setEditingReceivable(rec)}
                    className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                    title="Modifier cette créance"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {onDeleteReceivable && (
                    <button
                      onClick={() => onDeleteReceivable(rec.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer cette créance"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* SECTION 2: AVANCES ET SORTIES D'ARGENT POUR MBC PRINT 7ÈME RUE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Avances & Sorties Directes de Caisse
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Opérations directes effectuées sur la caisse pour le compte de l'Imprimerie 7ème rue
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddAdjustment(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center shadow-sm self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nouvelle Avance / Sortie
          </button>
        </div>

        {/* Formulaire Nouvelle Avance / Sortie Directe */}
        {showAddAdjustment && (
          <form onSubmit={handleSaveAdjustment} className="p-5 bg-slate-50 border-b border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Enregistrer une nouvelle avance ou sortie directe de caisse
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Motif / Description *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Achat Toner Canon, Avance personnel..."
                  value={adjDesc}
                  onChange={(e) => setAdjDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bénéficiaire / Entité</label>
                <input
                  type="text"
                  placeholder="ex: MBC Print 7ème rue"
                  value={adjTarget}
                  onChange={(e) => setAdjTarget(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Montant ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={adjUSD}
                  onChange={(e) => setAdjUSD(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Montant (FC)</label>
                <input
                  type="number"
                  step="100"
                  placeholder="0 FC"
                  value={adjFC}
                  onChange={(e) => setAdjFC(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type d'opération</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value as 'ADVANCE' | 'EXPENSE_OUTLAY' | 'DEBT_SETTLEMENT')}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ADVANCE">Avance</option>
                  <option value="EXPENSE_OUTLAY">Sortie directe</option>
                  <option value="DEBT_SETTLEMENT">Règlement dette</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddAdjustment(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs rounded-lg cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </form>
        )}

        {/* Adjustments List */}
        <div className="divide-y divide-slate-50">
          {adjustments.map((adj) => (
            <div key={adj.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800 text-sm">{adj.description}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                    {adj.targetEntity}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {adj.notes || 'Sortie enregistrée sur le fond physique de la caisse'}
                </p>
              </div>

              <div className="flex items-center space-x-3 self-end md:self-center">
                <div className="text-right">
                  <div className="text-base font-bold text-slate-900">
                    {adj.amountUSD > 0 && <span className="text-rose-600 mr-2">{formatUSD(adj.amountUSD)}</span>}
                    {adj.amountFC > 0 && <span className="text-rose-700">{formatFC(adj.amountFC)}</span>}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Total Sortie: {formatFC(adj.amountFC + adj.amountUSD * exchangeRate)}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setEditingAdjustment(adj)}
                    className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                    title="Modifier cet ajustement"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {onDeleteAdjustment && (
                    <button
                      onClick={() => onDeleteAdjustment(adj.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer cet ajustement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Debt, Adjustments & Fond Réel Explanation Card */}
        <div className="bg-amber-50/80 rounded-xl border border-amber-200 p-5 m-5 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <div className="flex items-center space-x-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm">Informations de Caisse & Explication du Fond Réel</h3>
            </div>
            <span className="text-[11px] font-bold uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              Mise à jour automatique
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Box 1: Créances Externes */}
            <div className="p-4 bg-white/80 rounded-lg border border-amber-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">Créances Externes (En Attente)</p>
                <span className="text-xs font-bold text-indigo-700 font-mono">
                  {formatUSD(totalReceivablesUSD)}
                </span>
              </div>

              {receivables.filter(r => r.status !== 'PAID').length === 0 ? (
                <p className="text-xs text-slate-500 italic">Aucune créance en attente enregistrée.</p>
              ) : (
                <ul className="text-xs text-amber-900 space-y-1.5 pt-1">
                  {receivables.filter(r => r.status !== 'PAID').map((r) => (
                    <li key={r.id} className="flex items-start justify-between border-b border-amber-100 pb-1">
                      <span>
                        • <strong>{r.client}</strong> : {r.description} {r.details ? `(${r.details})` : ''}
                      </span>
                      <span className="font-mono font-bold text-amber-700 ml-2 whitespace-nowrap">
                        {r.amountUSD > 0 ? formatUSD(r.amountUSD) : formatFC(r.amountFC)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Box 2: Ajustements & Sorties Réalisés sur Caisse Réelle */}
            <div className="p-4 bg-white/80 rounded-lg border border-amber-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Ajustements sur Caisse (3 724 650 FC Réels)
                </p>
                <span className="text-xs font-bold text-rose-700 font-mono">
                  {totalAdjustmentsUSD > 0 ? formatUSD(totalAdjustmentsUSD) : ''}
                  {totalAdjustmentsFC > 0 ? ` ${formatFC(totalAdjustmentsFC)}` : ''}
                </span>
              </div>

              {adjustments.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Aucun ajustement ou sortie directe enregistrée.</p>
              ) : (
                <ul className="text-xs text-amber-900 space-y-1.5 pt-1">
                  {adjustments.map((a) => (
                    <li key={a.id} className="flex items-start justify-between border-b border-amber-100 pb-1">
                      <span>
                        • <strong>{a.description}</strong> ({a.targetEntity})
                      </span>
                      <span className="font-mono font-bold text-rose-700 ml-2 whitespace-nowrap">
                        {a.amountUSD > 0 && formatUSD(a.amountUSD)}
                        {a.amountFC > 0 && ` ${formatFC(a.amountFC)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-900 font-medium gap-2">
            <span>
              💡 <strong>Remarque comptable :</strong> Les créances restent à recouvrir auprès des partenaires/clients. Le fond réel physique tient compte directement des sorties et avances effectuées.
            </span>
            <span className="font-bold text-indigo-900 whitespace-nowrap bg-white px-3 py-1 rounded-md border border-amber-300">
              Fond Réel Déclaré: 3 724 650 FC
            </span>
          </div>
        </div>

      </div>

      {/* Edit Receivable Modal */}
      {editingReceivable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingReceivable && onEditReceivable) {
                onEditReceivable(editingReceivable);
                setEditingReceivable(null);
              }
            }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600" />
                Modifier la Créance Client
              </h3>
              <button
                type="button"
                onClick={() => setEditingReceivable(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nom du Client / Entreprise *</label>
                <input
                  type="text"
                  required
                  value={editingReceivable.client}
                  onChange={(e) => setEditingReceivable({ ...editingReceivable, client: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Motif</label>
                <input
                  type="text"
                  value={editingReceivable.description}
                  onChange={(e) => setEditingReceivable({ ...editingReceivable, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Détails spécifiques (ex: 40 Bâches...)</label>
                <input
                  type="text"
                  value={editingReceivable.details || ''}
                  onChange={(e) => setEditingReceivable({ ...editingReceivable, details: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingReceivable.amountUSD}
                    onChange={(e) => setEditingReceivable({ ...editingReceivable, amountUSD: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant (FC)</label>
                  <input
                    type="number"
                    value={editingReceivable.amountFC || 0}
                    onChange={(e) => setEditingReceivable({ ...editingReceivable, amountFC: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date de l'Opération (ex: 25/07/2026)</label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={editingReceivable.date || ''}
                  onChange={(e) => setEditingReceivable({ ...editingReceivable, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Statut du Paiement</label>
                <select
                  value={editingReceivable.status}
                  onChange={(e) => setEditingReceivable({ ...editingReceivable, status: e.target.value as 'PENDING' | 'PAID' })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold"
                >
                  <option value="PENDING">En Attente (Non Réglé)</option>
                  <option value="PAID">Payé & Réglé</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingReceivable(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Adjustment Modal */}
      {editingAdjustment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingAdjustment && onEditAdjustment) {
                onEditAdjustment(editingAdjustment);
                setEditingAdjustment(null);
              }
            }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-600" />
                Modifier la Sortie / Avance de Caisse
              </h3>
              <button
                type="button"
                onClick={() => setEditingAdjustment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Motif / Description *</label>
                <input
                  type="text"
                  required
                  value={editingAdjustment.description}
                  onChange={(e) => setEditingAdjustment({ ...editingAdjustment, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bénéficiaire / Entité</label>
                <input
                  type="text"
                  value={editingAdjustment.targetEntity}
                  onChange={(e) => setEditingAdjustment({ ...editingAdjustment, targetEntity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAdjustment.amountUSD}
                    onChange={(e) => setEditingAdjustment({ ...editingAdjustment, amountUSD: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant (FC)</label>
                  <input
                    type="number"
                    value={editingAdjustment.amountFC}
                    onChange={(e) => setEditingAdjustment({ ...editingAdjustment, amountFC: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Type d'opération</label>
                <select
                  value={editingAdjustment.type}
                  onChange={(e) => setEditingAdjustment({ ...editingAdjustment, type: e.target.value as 'ADVANCE' | 'EXPENSE_OUTLAY' | 'DEBT_SETTLEMENT' })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold"
                >
                  <option value="ADVANCE">Avance</option>
                  <option value="EXPENSE_OUTLAY">Sortie directe</option>
                  <option value="DEBT_SETTLEMENT">Règlement dette</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date de l'Opération (ex: 25/07/2026)</label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={editingAdjustment.date || ''}
                  onChange={(e) => setEditingAdjustment({ ...editingAdjustment, date: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAdjustment(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
