import React, { useState } from 'react';
import { Lock, ShieldAlert, X, CheckCircle2, Store, Shield } from 'lucide-react';
import { USER_ACCOUNTS } from '../data/initialData';
import { UserAccount, ShopId } from '../types';

interface PasswordPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (authenticatedUser?: UserAccount) => void;
  title?: string;
  description?: string;
  currentUser?: UserAccount | null;
  accounts?: UserAccount[];
  targetShopId?: ShopId | 'all';
  targetRole?: 'admin' | 'shop_manager';
}

export const PasswordPromptModal: React.FC<PasswordPromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Autorisation Requise",
  description = "Veuillez entrer le mot de passe de gérance ou d'administration.",
  currentUser,
  accounts = USER_ACCOUNTS,
  targetShopId,
  targetRole,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAccounts = accounts && accounts.length > 0 ? accounts : USER_ACCOUNTS;
  const adminAcc = currentAccounts.find((a) => a.role === 'admin') || USER_ACCOUNTS[2];
  const targetAcc = targetShopId && targetShopId !== 'all' 
    ? currentAccounts.find((a) => a.shopId === targetShopId)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const input = passwordInput.trim();
    if (!input) {
      setErrorMsg("Veuillez saisir un mot de passe.");
      return;
    }

    let authenticatedUser: UserAccount | undefined;

    // Check specific authorization rules
    if (targetRole === 'admin' || targetShopId === 'all') {
      // Must be Admin password
      if (input === adminAcc.password) {
        authenticatedUser = adminAcc;
      }
    } else if (targetShopId === 'lingwala') {
      const lingwalaAcc = currentAccounts.find((a) => a.id === 'lingwala') || USER_ACCOUNTS[0];
      if (input === lingwalaAcc.password) {
        authenticatedUser = lingwalaAcc;
      } else if (input === adminAcc.password) {
        authenticatedUser = adminAcc;
      }
    } else if (targetShopId === 'limete') {
      const limeteAcc = currentAccounts.find((a) => a.id === 'limete') || USER_ACCOUNTS[1];
      if (input === limeteAcc.password) {
        authenticatedUser = limeteAcc;
      } else if (input === adminAcc.password) {
        authenticatedUser = adminAcc;
      }
    } else {
      // General action authorization: check current user's password, or target account's, or admin
      const currentAcc = currentAccounts.find((a) => a.id === currentUser?.id);
      if (currentAcc && input === currentAcc.password) {
        authenticatedUser = currentAcc;
      } else if (input === adminAcc.password) {
        authenticatedUser = adminAcc;
      } else {
        // Check if matches any matching manager
        const matching = currentAccounts.find((a) => a.password === input);
        if (matching) {
          authenticatedUser = matching;
        }
      }
    }

    if (authenticatedUser) {
      setPasswordInput('');
      onSuccess(authenticatedUser);
    } else {
      if (targetShopId === 'limete') {
        setErrorMsg("Mot de passe incorrect pour le Shop Limete ou l'Administration.");
      } else if (targetShopId === 'lingwala') {
        setErrorMsg("Mot de passe incorrect pour le Shop Lingwala ou l'Administration.");
      } else if (targetShopId === 'all' || targetRole === 'admin') {
        setErrorMsg("Mot de passe incorrect pour l'Administration Générale.");
      } else {
        setErrorMsg("Mot de passe de sécurité incorrect.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">{title}</h3>
              {targetShopId && (
                <div className="flex items-center space-x-1 text-[11px] text-slate-300">
                  <Store className="w-3 h-3 text-indigo-400" />
                  <span>
                    Cible : {targetShopId === 'lingwala' ? 'Imprimerie Lingwala' : targetShopId === 'limete' ? 'Imprimerie Limete' : 'Direction Générale (Tous)'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start space-x-2.5 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{description}</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
              <span>Mot de Passe de Sécurité *</span>
              {targetShopId && (
                <span className="text-[10px] font-normal text-slate-500">
                  {targetShopId === 'lingwala' ? 'Pass Lingwala ou Admin' : targetShopId === 'limete' ? 'Pass Limete ou Admin' : 'Pass Direction Admin'}
                </span>
              )}
            </label>
            <input
              type="password"
              autoFocus
              placeholder="Saisissez le mot de passe requis..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Valider & Déverrouiller
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
