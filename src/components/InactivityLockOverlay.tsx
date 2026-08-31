import React, { useState } from 'react';
import { UserAccount } from '../types';
import { Lock, Key, ArrowRight, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';

interface InactivityLockOverlayProps {
  isLocked: boolean;
  currentUser: UserAccount | null;
  onUnlock: (password: string) => boolean;
  onSwitchUser: () => void;
}

export const InactivityLockOverlay: React.FC<InactivityLockOverlayProps> = ({
  isLocked,
  currentUser,
  onUnlock,
  onSwitchUser,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLocked || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!passwordInput) return;

    const success = onUnlock(passwordInput);
    if (success) {
      setPasswordInput('');
    } else {
      setErrorMsg('Mot de passe incorrect. Impossible de déverrouiller la session.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-white">Session Verrouillée</h2>
          <p className="text-xs text-slate-400 mt-1">
            Veuillez entrer votre mot de passe pour reprendre le travail
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* User Account Info */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
              {currentUser.shopId === 'lingwala' ? 'L' : currentUser.shopId === 'limete' ? 'M' : 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500 font-medium truncate">{currentUser.shopName} • Role: {currentUser.role === 'admin' ? 'Administrateur' : 'Gérant'}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mot de passe de la session
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  autoFocus
                />
                <Key className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Déverrouiller la Session</span>
            </button>
          </form>

          {/* Quick unlock helper */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700 flex items-center justify-between">
              <span>Mot de passe par défaut :</span>
              <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">
                {currentUser.password || 'admin123'}
              </code>
            </div>
            <button
              type="button"
              onClick={() => onUnlock(currentUser.password || 'admin123')}
              className="w-full mt-1 py-1 px-2 text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Déverrouiller automatiquement
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-center">
            <button
              type="button"
              onClick={onSwitchUser}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Changer d'utilisateur ou se reconnecter</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
