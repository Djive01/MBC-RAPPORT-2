import React, { useState } from 'react';
import { UserAccount } from '../types';
import { Lock, Store, ShieldCheck, Key, ArrowRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  strictMode?: boolean;
  onLoginSuccess: (user: UserAccount) => void;
  canClose?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  accounts,
  strictMode = false,
  onLoginSuccess,
  canClose = true,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('lingwala');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentAccountsList = accounts && accounts.length > 0 ? accounts : [];
  const selectedAccount = currentAccountsList.find((a) => a.id === selectedAccountId) || currentAccountsList[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedAccount && passwordInput === selectedAccount.password) {
      onLoginSuccess(selectedAccount);
      setPasswordInput('');
    } else {
      setErrorMsg(`Mot de passe incorrect pour le compte "${selectedAccount?.name || 'Sélectionné'}".`);
    }
  };

  const handleQuickDemoLogin = (acc: UserAccount) => {
    setSelectedAccountId(acc.id);
    setPasswordInput(acc.password || '');
    setErrorMsg('');
    onLoginSuccess(acc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Connexion & Accès aux Imprimeries</h2>
              <p className="text-xs text-slate-300">
                Sélectionnez le shop et entrez le mot de passe requis
              </p>
            </div>
          </div>

          {canClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Account Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Choisir le Compte / Lieu d'Imprimerie
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {currentAccountsList.map((acc) => {
                const isSelected = selectedAccountId === acc.id;
                const isLingwala = acc.shopId === 'lingwala';
                const isLimete = acc.shopId === 'limete';

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      setSelectedAccountId(acc.id);
                      setPasswordInput('');
                      setErrorMsg('');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                          isLingwala
                            ? 'bg-blue-600'
                            : isLimete
                            ? 'bg-emerald-600'
                            : 'bg-purple-600'
                        }`}
                      >
                        {isLingwala ? <Store className="w-4 h-4" /> : isLimete ? <Store className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{acc.shopName}</div>
                        <div className="text-[11px] text-slate-500">{acc.name}</div>
                      </div>
                    </div>

                    <div className="text-right flex items-center space-x-2">
                      {!strictMode && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                          Pass: {acc.password}
                        </span>
                      )}
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Password */}
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Mot de passe pour <strong>{selectedAccount?.shopName}</strong></span>
                {!strictMode && (
                  <span className="text-[11px] text-indigo-600 font-normal">Défaut: {selectedAccount?.password}</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={strictMode ? "Entrez le mot de passe de session" : `Entrez le mot de passe (ex: ${selectedAccount?.password})`}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                  autoFocus
                />
                <Key className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
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
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center cursor-pointer"
            >
              <span>Se Connecter au Compte</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </form>

          {strictMode && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Mode Sécurisé Strict Activé :</strong> Les mots de passe et boutons de raccourcis sont masqués pour la sécurité des imprimeries.</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
