import React from 'react';
import { X, ShieldCheck, Cpu, HardDrive, Sparkles, Building2 } from 'lucide-react';
import { MbcLogo } from './MbcLogo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-block p-3 bg-slate-900/80 rounded-2xl border border-slate-700/60 shadow-lg mb-3">
            <MbcLogo size="lg" variant="dark" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">
            MBC Print Manager
          </h2>

          <div className="mt-1 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            Version 1.1.0
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Main Info Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Développé par</p>
                <p className="font-bold text-slate-800">MBC PRINT</p>
              </div>
            </div>

            <div className="h-px bg-slate-200" />

            <div className="flex items-center space-x-3 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Droits d'Auteur</p>
                <p className="font-bold text-slate-800">© 2026 MBC PRINT. Tous droits réservés.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed text-center font-medium">
            Application professionnelle autonome de gestion de caisse bidevise (FC & USD), suivi des recettes et dépenses, gestion de stock consommables, et synchronisation réseau multi-ateliers.
          </p>

          {/* Technical Specs Tags */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
            <div className="flex items-center space-x-1.5 p-2 bg-slate-100 rounded-lg border border-slate-200">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Electron & React 19</span>
            </div>

            <div className="flex items-center space-x-1.5 p-2 bg-slate-100 rounded-lg border border-slate-200">
              <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
              <span>Base Locale & LAN</span>
            </div>

            <div className="flex items-center space-x-1.5 p-2 bg-slate-100 rounded-lg border border-slate-200 col-span-2 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Assistance Intelligente Gemini</span>
            </div>
          </div>

          {/* Footer Close Action */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
