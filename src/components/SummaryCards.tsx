import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Landmark, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  TrendingDown,
  FileSpreadsheet,
  Sparkles,
  Zap,
  Calculator,
  Coins,
  CheckCircle2
} from 'lucide-react';
import { formatFC, formatUSD } from '../utils/formatters';
import { TARGET_PHYSICAL_CASH_FC } from '../data/initialData';

interface SummaryCardsProps {
  totalRecettesFC: number;
  totalRecettesUSD: number;
  totalDepensesFC: number;
  totalDepensesUSD: number;
  totalReceivablesUSD: number;
  exchangeRate: number;
  currencyDisplayMode: 'dual' | 'fc' | 'usd';
  onNavigateTab: (tab: 'journal' | 'expenses' | 'receivables' | 'cash' | 'analytics' | 'ai' | 'stock') => void;
  cashInHandFC?: number;
  cashInHandUSD?: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalRecettesFC,
  totalRecettesUSD,
  totalDepensesFC,
  totalDepensesUSD,
  totalReceivablesUSD,
  exchangeRate,
  currencyDisplayMode,
  onNavigateTab,
  cashInHandFC = 0,
  cashInHandUSD = 0,
}) => {
  // Calculated Theoretical Balances
  const soldeTheoreticalFC = totalRecettesFC - totalDepensesFC;
  const soldeTheoreticalUSD = totalRecettesUSD - totalDepensesUSD;

  // Combined calculations based on exchange rate
  const combinedRecettesFC = totalRecettesFC + totalRecettesUSD * exchangeRate;
  const combinedRecettesUSD = totalRecettesUSD + totalRecettesFC / exchangeRate;

  const combinedDepensesFC = totalDepensesFC + totalDepensesUSD * exchangeRate;
  const combinedDepensesUSD = totalDepensesUSD + totalDepensesFC / exchangeRate;

  const combinedSoldeFC = soldeTheoreticalFC + soldeTheoreticalUSD * exchangeRate;
  const combinedSoldeUSD = soldeTheoreticalUSD + soldeTheoreticalFC / exchangeRate;

  // Cash in hand calculations
  const hasCashEntered = cashInHandFC > 0 || cashInHandUSD > 0;
  const cashInHandCombinedFC = cashInHandFC + cashInHandUSD * exchangeRate;
  const diffCombinedFC = cashInHandCombinedFC - combinedSoldeFC;
  const isMatch = Math.abs(diffCombinedFC) < 50;

  const depensePercentage = combinedRecettesFC > 0 
    ? ((combinedDepensesFC / combinedRecettesFC) * 100).toFixed(1) 
    : '10.8';

  return (
    <div className="space-y-3 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Recettes (FC) */}
        <div 
          onClick={() => onNavigateTab('journal')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Recettes (FC)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {formatFC(currencyDisplayMode === 'usd' ? combinedRecettesFC : totalRecettesFC)}
          </p>
          <div className="flex items-center text-xs text-emerald-500 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            <span>En hausse de 12%</span>
          </div>
        </div>

        {/* Card 2: Recettes ($) */}
        <div 
          onClick={() => onNavigateTab('journal')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Recettes ($)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {formatUSD(currencyDisplayMode === 'fc' ? combinedRecettesUSD : totalRecettesUSD)}
          </p>
          <div className="flex items-center text-xs text-emerald-500 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
            <span>En hausse de 5.4%</span>
          </div>
        </div>

        {/* Card 3: Total Dépenses */}
        <div 
          onClick={() => onNavigateTab('expenses')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Dépenses (FC & $)</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {currencyDisplayMode === 'fc' ? formatFC(combinedDepensesFC) : formatUSD(combinedDepensesUSD)}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {depensePercentage}% des revenus global
          </p>
        </div>

        {/* Card 4: Highlight Card (Solde Théorique & Argent en Main) */}
        <div 
          onClick={() => onNavigateTab('cash')}
          className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-4 rounded-xl shadow-lg cursor-pointer group transition-all hover:scale-[1.01] border border-indigo-700/50 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              Solde & Caisse Réelle
            </p>
            <span className="text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
              Contrôle
            </span>
          </div>

          <div className="mt-1.5">
            <div className="text-2xl font-black text-white">
              {formatUSD(soldeTheoreticalUSD)}
              <span className="text-xs text-indigo-300 font-medium ml-2">
                ({formatFC(soldeTheoreticalFC)})
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-indigo-800/80 flex items-center justify-between text-xs">
            {hasCashEntered ? (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-200">
                <Coins className="w-3 h-3 text-amber-400" />
                <span>En main : {formatFC(cashInHandFC)} {cashInHandUSD > 0 ? `+ $${cashInHandUSD}` : ''}</span>
              </div>
            ) : (
              <span className="text-[11px] text-indigo-300">
                +{formatUSD(totalReceivablesUSD)} Créances en cours
              </span>
            )}

            <span className="text-[11px] font-bold text-indigo-300 group-hover:text-white transition-colors underline flex items-center gap-0.5">
              <span>Comparer</span>
              <span>→</span>
            </span>
          </div>
        </div>

      </div>

      {/* Quick Cash-on-Hand Banner Alert if cash has been entered or ready for check */}
      <div 
        onClick={() => onNavigateTab('cash')}
        className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs cursor-pointer transition-colors"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-800">
              Module Contrôle Caisse & Argent en Main :
            </span>{' '}
            {hasCashEntered ? (
              <span className="text-slate-600">
                Espèces déclarées en main : <strong className="text-slate-900">{formatFC(cashInHandFC)}</strong> et <strong className="text-slate-900">{formatUSD(cashInHandUSD)}</strong>.
                {isMatch ? (
                  <span className="text-emerald-700 font-bold ml-1.5 inline-flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" /> Caisse Conforme
                  </span>
                ) : diffCombinedFC > 0 ? (
                  <span className="text-blue-700 font-bold ml-1.5 inline-flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3 text-blue-600 inline" /> Surplus (+{formatFC(diffCombinedFC)})
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold ml-1.5 inline-flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3 text-rose-600 inline" /> Manquant (-{formatFC(Math.abs(diffCombinedFC))})
                  </span>
                )}
              </span>
            ) : (
              <span className="text-slate-500">
                Saisissez l'argent physique que vous avez en main pour faire la comparaison et le calcul automatique de l'écart.
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigateTab('cash');
          }}
          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1 self-start sm:self-auto shrink-0"
        >
          <span>{hasCashEntered ? 'Modifier / Recompter' : 'Saisir Espèces en Main'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
