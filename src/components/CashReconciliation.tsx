import React, { useState } from 'react';
import { 
  Calculator, 
  Coins, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Landmark, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { CashDenominationCount } from '../types';
import { formatFC, formatUSD } from '../utils/formatters';
import { TARGET_PHYSICAL_CASH_FC } from '../data/initialData';

interface CashReconciliationProps {
  soldeTheoreticalFC: number;
  soldeTheoreticalUSD: number;
  exchangeRate: number;
}

export const CashReconciliation: React.FC<CashReconciliationProps> = ({
  soldeTheoreticalFC,
  soldeTheoreticalUSD,
  exchangeRate,
}) => {
  // Cash denomination counter state
  const [denominations, setDenominations] = useState<CashDenominationCount>({
    fc20000: 150, // default pre-fill count approximating 3,724,650 FC
    fc10000: 60,
    fc5000: 20,
    fc1000: 24,
    fc500: 1,
    usd100: 0,
    usd50: 0,
    usd20: 0,
    usd10: 0,
    usd5: 0,
    usd1: 0,
  });

  const handleDenominationChange = (key: keyof CashDenominationCount, value: number) => {
    setDenominations((prev) => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  };

  const handleResetCounter = () => {
    setDenominations({
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
    });
  };

  // Calculated totals from denomination counts
  const totalCountFC =
    denominations.fc20000 * 20000 +
    denominations.fc10000 * 10000 +
    denominations.fc5000 * 5000 +
    denominations.fc1000 * 1000 +
    denominations.fc500 * 500;

  const totalCountUSD =
    denominations.usd100 * 100 +
    denominations.usd50 * 50 +
    denominations.usd20 * 20 +
    denominations.usd10 * 10 +
    denominations.usd5 * 5 +
    denominations.usd1 * 1;

  const totalCountCombinedFC = totalCountFC + totalCountUSD * exchangeRate;
  const targetDiffFC = totalCountCombinedFC - TARGET_PHYSICAL_CASH_FC;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
              Billetage & Comptage Réel de Caisse
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Outil de comptage physique des billets en coffre/caisse et vérification de l'écart
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetCounter}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors inline-flex items-center"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Réinitialiser Comptage
            </button>
          </div>
        </div>

        {/* 3 Overview Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Solde Théorique Journalier</span>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {formatFC(soldeTheoreticalFC)}
            </div>
            <div className="text-xs text-indigo-600 font-semibold">
              + {formatUSD(soldeTheoreticalUSD)}
            </div>
          </div>

          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
            <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider">Caisse Réelle Déclarée</span>
            <div className="text-lg font-bold text-amber-700 mt-1">
              {formatFC(TARGET_PHYSICAL_CASH_FC)}
            </div>
            <div className="text-[11px] text-amber-800 font-medium">
              Fond disponible selon rapport
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            Math.abs(targetDiffFC) < 100
              ? 'bg-emerald-50 border-emerald-200'
              : targetDiffFC > 0
              ? 'bg-indigo-50 border-indigo-200'
              : 'bg-rose-50 border-rose-200'
          }`}>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Comptage Physique Effectué</span>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {formatFC(totalCountCombinedFC)}
            </div>
            <div className={`text-xs font-semibold ${
              Math.abs(targetDiffFC) < 100
                ? 'text-emerald-700'
                : targetDiffFC > 0
                ? 'text-indigo-700'
                : 'text-rose-700'
            }`}>
              {Math.abs(targetDiffFC) < 100 ? (
                'Conforme au fond réel de 3 724 650 FC'
              ) : targetDiffFC > 0 ? (
                `Surplus de +${formatFC(targetDiffFC)}`
              ) : (
                `Écart négatif de ${formatFC(targetDiffFC)}`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Billetage Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Billetage en Francs Congolais (FC) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Coins className="w-4 h-4 mr-2 text-emerald-600" />
              Billetage Francs Congolais (FC)
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {formatFC(totalCountFC)}
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
                <div key={denom.key} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 w-36">{denom.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-medium">x</span>
                    <input
                      type="number"
                      min="0"
                      value={count || ''}
                      placeholder="0"
                      onChange={(e) => handleDenominationChange(denom.key as keyof CashDenominationCount, Number(e.target.value))}
                      className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <span className="font-bold text-slate-900 w-28 text-right">
                    {formatFC(subtotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billetage en Dollars ($) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
              Billetage Dollars ($)
            </h3>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {formatUSD(totalCountUSD)}
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
                <div key={denom.key} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 w-36">{denom.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-medium">x</span>
                    <input
                      type="number"
                      min="0"
                      value={count || ''}
                      placeholder="0"
                      onChange={(e) => handleDenominationChange(denom.key as keyof CashDenominationCount, Number(e.target.value))}
                      className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <span className="font-bold text-slate-900 w-24 text-right">
                    {formatUSD(subtotal)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
