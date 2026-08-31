import React, { useEffect, useState } from 'react';
import { MbcLogo } from './MbcLogo';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 1000,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Démarrage de MBC Print Manager...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 150);
  };

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 40) {
        setStatusText('Initialisation du moteur MBC Print Manager...');
      } else if (pct < 80) {
        setStatusText('Chargement des registres & données ateliers...');
      } else {
        setStatusText('Prêt ! Lancement de l\'application...');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        handleSkip();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-white select-none cursor-pointer transition-opacity duration-300 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Decorative Gradient Highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1" />

      {/* Main Logo & Branding Center */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md mb-6 transform hover:scale-105 transition-transform duration-300">
          <MbcLogo size="xl" variant="dark" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
          MBC Print Manager
        </h1>
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-indigo-400 mb-6 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Version 1.1.0</span>
        </div>

        <p className="text-slate-400 text-sm max-w-sm font-medium">
          Solution officielle de gestion de caisse, dépense, stock et rapport journalier pour MBC PRINT
        </p>
      </div>

      <div className="flex-1" />

      {/* Bottom Loading Progress Bar */}
      <div className="relative z-10 w-full max-w-md px-8 pb-10 flex flex-col items-center">
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5 mb-3 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-sky-500 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between w-full text-xs text-slate-400 font-medium">
          <span className="truncate mr-2">{statusText}</span>
          <span className="font-bold text-slate-300">{progress}%</span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="mt-4 px-4 py-1.5 rounded-full bg-slate-900/90 hover:bg-indigo-600 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          Passer l'introduction →
        </button>
      </div>
    </div>
  );
};
