import React, { useState, useEffect } from 'react';
import { Monitor, Download, CheckCircle, Copy, Check, ShieldCheck, X, DownloadCloud, Laptop } from 'lucide-react';

interface ElectronBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElectronBuildModal: React.FC<ElectronBuildModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const buildCommand = 'npm run build:exe';

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert(
        "Pour installer instantanément sur Windows :\n\n" +
        "1. Dans Chrome ou Microsoft Edge, observez l'icône dans la barre d'adresse (à droite) ou ouvrez le menu (⋮).\n" +
        "2. Cliquez sur 'Installer MBC Print Manager' ou 'Créer un raccourci bureau'.\n\n" +
        "L'application apparaîtra directement sur votre Bureau et Menu Démarrer Windows comme un logiciel natif !"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Installation sur Windows (2 Options Disponibles)
              </h2>
              <p className="text-xs text-slate-500">
                Choisissez l'installation instantanée en 1 clic ou l'exécutable .EXE natif
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OPTION 1: Instant 1-Click Installation (PWA Desktop App) */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Laptop className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-indigo-100">Option 1 : Installation Instantanée en 1 Clic (Recommandée)</h3>
            </div>
            <span className="text-[10px] uppercase font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
              Directe sur Windows
            </span>
          </div>
          <p className="text-xs text-indigo-200">
            Installe immédiatement l'application sur votre bureau Windows sans rien compiler. Elle fonctionne en mode fenêtre autonome, hors-ligne, avec raccourci sur le bureau et le menu Démarrer.
          </p>
          <button
            onClick={handleInstallPWA}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Installer l'application sur ce PC (1 Clic)</span>
          </button>
        </div>

        {/* OPTION 2: Native .EXE Compilation */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center space-x-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
            <Monitor className="w-4 h-4 text-indigo-600" />
            <span>Option 2 : Fichier d'installation Windows .EXE autonome (Electron)</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start space-x-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Configuration Electron prêtre à 100% :</strong> Pour obtenir le fichier binaire <code>Setup.exe</code> sur votre clé USB ou disque dur, téléchargez le code source du projet et lancez la commande de compilation ci-dessous :
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <strong className="text-slate-800">Commande de création du .exe :</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">Génère automatiquement <code>dist-electron/Setup.exe</code></p>
              </div>
              <div className="bg-slate-900 text-indigo-300 font-mono px-3 py-1.5 rounded-lg flex items-center space-x-3">
                <span>{buildCommand}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copier la commande"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Features */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Fonctionnement 100% Hors-Ligne</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-slate-700">
            <Download className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Raccourcis Bureau & Menu Démarrer</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
