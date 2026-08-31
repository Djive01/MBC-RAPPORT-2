import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Landmark, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  FileSpreadsheet,
  Sparkles,
  Zap
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

  const depensePercentage = combinedRecettesFC > 0 
    ? ((combinedDepensesFC / combinedRecettesFC) * 100).toFixed(1) 
    : '10.8';

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Recettes (FC) */}
        <div 
          onClick={() => onNavigateTab('journal')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
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
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
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
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Dépenses (FC & $)</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {currencyDisplayMode === 'fc' ? formatFC(combinedDepensesFC) : formatUSD(combinedDepensesUSD)}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {depensePercentage}% des revenus global
          </p>
        </div>

        {/* Card 4: Highlight Card (Solde Net / Caisse Réelle) */}
        <div 
          onClick={() => onNavigateTab('cash')}
          className="bg-indigo-900 p-4 rounded-xl shadow-lg cursor-pointer group transition-transform hover:scale-[1.01]"
        >
          <p className="text-xs font-semibold text-indigo-200 uppercase">Solde Net & Caisse ($)</p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatUSD(soldeTheoreticalUSD)}
            <span className="text-xs text-indigo-300 font-normal ml-2">({formatFC(TARGET_PHYSICAL_CASH_FC)} réels)</span>
          </p>
          <p className="text-xs text-indigo-300 mt-2">
            +{formatUSD(totalReceivablesUSD)} Créances MBC 7è
          </p>
        </div>

      </div>
    </div>
  );
};
