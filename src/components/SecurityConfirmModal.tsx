import React, { useState } from 'react';
import { UserAccount } from '../types';
import { ShieldAlert, Key, AlertTriangle, X } from 'lucide-react';

interface SecurityConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  allAccounts: UserAccount[];
  title: string;
  description: string;
  onConfirm: () => void;
}

export const SecurityConfirmModal: React.FC<SecurityConfirmModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allAccounts,
  title,
  description,
  onConfirm,
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password) {
      setErrorMsg('Veuillez saisir votre mot de passe.');
      return;
    }

    // Verify against current user or admin password
    const userAcc = allAccounts.find((a) => a.id === currentUser?.id) || currentUser;
    const adminAcc = allAccounts.find((a) => a.role === 'admin');

    const isValid =
      password === userAcc?.password || (adminAcc && password === adminAcc.password);

    if (isValid) {
      onConfirm();
      setPassword('');
      onClose();
    } else {
      setErrorMsg('Mot de passe incorrect. Action annulée pour sécurité.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>

        <form onSubmit={handleVerify} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mot de passe requis ({currentUser?.name || 'Utilisateur'})
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Saisissez votre mot de passe pour confirmer"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                autoFocus
              />
              <Key className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Confirmer la suppression
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
