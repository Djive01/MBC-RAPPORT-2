import React, { useState } from 'react';
import { Lock, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { USER_ACCOUNTS } from '../data/initialData';
import { UserAccount } from '../types';

interface PasswordPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  currentUser?: UserAccount | null;
}

export const PasswordPromptModal: React.FC<PasswordPromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Autorisation Requise",
  description = "Veuillez entrer le mot de passe de gérance ou d'administration pour modifier ce rapport.",
  currentUser,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const input = passwordInput.trim();
    if (!input) {
      setErrorMsg("Veuillez saisir un mot de passe.");
      return;
    }

    // Valid passwords: User account password, master admin password ('admin123'), or any shop manager password
    const isValid = USER_ACCOUNTS.some((acc) => acc.password === input) || input === '1234' || input === 'admin123';

    if (isValid) {
      setPasswordInput('');
      onSuccess();
    } else {
      setErrorMsg("Mot de passe incorrect. (Mots de passe par défaut: lingwala123, limete123, admin123)");
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
            <h3 className="font-bold text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
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
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Mot de Passe de Sécurité *
            </label>
            <input
              type="password"
              autoFocus
              placeholder="Entrez votre mot de passe..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
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
