import React, { useState } from 'react';
import { UserAccount, SecurityPolicy, AuditLogItem } from '../types';
import {
  ShieldCheck,
  UserCheck,
  Key,
  Lock,
  Clock,
  EyeOff,
  Trash2,
  FileText,
  Search,
  Download,
  AlertTriangle,
  X,
  Check,
  Sliders,
  History,
  Shield,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface SecurityManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  onUpdatePassword: (accountId: string, newPass: string) => void;
  securityPolicy: SecurityPolicy;
  onUpdatePolicy: (newPolicy: SecurityPolicy) => void;
  auditLogs: AuditLogItem[];
  onClearAuditLogs: () => void;
  addAuditLog: (category: AuditLogItem['actionCategory'], details: string) => void;
}

export const SecurityManagementModal: React.FC<SecurityManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accounts,
  onUpdatePassword,
  securityPolicy,
  onUpdatePolicy,
  auditLogs,
  onClearAuditLogs,
  addAuditLog,
}) => {
  const [activeTab, setActiveTab] = useState<'ACCOUNTS' | 'POLICIES' | 'AUDIT'>('ACCOUNTS');

  // Password Change State
  const [selectedAccId, setSelectedAccId] = useState<string>(currentUser?.id || 'lingwala');
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Audit Search State
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin';

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg('');
    setPassSuccessMsg('');

    const targetAccount = accounts.find((a) => a.id === selectedAccId);
    if (!targetAccount) return;

    // Validation
    if (!isAdmin && currentPassInput !== targetAccount.password) {
      setPassErrorMsg('L\'ancien mot de passe saisi est incorrect.');
      return;
    }

    if (newPassInput.length < 4) {
      setPassErrorMsg('Le nouveau mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setPassErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    onUpdatePassword(selectedAccId, newPassInput);
    setPassSuccessMsg(`Le mot de passe du compte "${targetAccount.name}" a été mis à jour avec succès !`);
    addAuditLog('PASSWORD_CHANGE', `Modification du mot de passe du compte [${targetAccount.shopName}]`);

    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
  };

  const handleExportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `journal_securite_mbc_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog('SECURITY_CHANGE', 'Exportation du journal d\'audit complet.');
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.formattedDate.includes(auditSearch);

    const matchesCategory =
      auditCategoryFilter === 'ALL' || log.actionCategory === auditCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Centre de Sécurité & Contrôle d'Accès</h2>
              <p className="text-xs text-slate-400">
                Gestion des comptes, des rôles, des politiques de sécurité et journal d'audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-b border-slate-200 bg-slate-50 px-5 pt-3 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ACCOUNTS')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-2 border-t border-x cursor-pointer ${
              activeTab === 'ACCOUNTS'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Gestion des Comptes ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('POLICIES')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-2 border-t border-x cursor-pointer ${
              activeTab === 'POLICIES'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Politiques de Sécurité</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-2 border-t border-x cursor-pointer ${
              activeTab === 'AUDIT'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Journal d'Audit ({auditLogs.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          
          {/* TAB 1: ACCOUNTS & PASSWORDS */}
          {activeTab === 'ACCOUNTS' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Comptes Utilisateurs & Niveau d'Accès actuels
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {accounts.map((acc) => {
                    const isAccAdmin = acc.role === 'admin';
                    const isSelected = selectedAccId === acc.id;

                    return (
                      <div
                        key={acc.id}
                        onClick={() => setSelectedAccId(acc.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-white shadow-md ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isAccAdmin
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {isAccAdmin ? 'Administrateur' : 'Gérant Shop'}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </div>

                        <div className="font-bold text-sm text-slate-900">{acc.shopName}</div>
                        <div className="text-xs text-slate-500">{acc.name}</div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Identifiant: <strong>{acc.username}</strong></span>
                          <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            Pass: {acc.password}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Password Change Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 border-b border-slate-100 pb-3">
                  <Key className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-sm">
                    Modifier le Mot de Passe de : <span className="text-indigo-600">{accounts.find(a => a.id === selectedAccId)?.name}</span>
                  </h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                  {!isAdmin && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mot de passe actuel *
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassInput}
                        onChange={(e) => setCurrentPassInput(e.target.value)}
                        placeholder="Saisissez le mot de passe actuel"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nouveau mot de passe *
                      </label>
                      <div className="relative">
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          value={newPassInput}
                          onChange={(e) => setNewPassInput(e.target.value)}
                          placeholder="Min 4 caractères"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                        >
                          {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirmer le nouveau mot de passe *
                      </label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        value={confirmPassInput}
                        onChange={(e) => setConfirmPassInput(e.target.value)}
                        placeholder="Répétez le mot de passe"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  {passErrorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{passErrorMsg}</span>
                    </div>
                  )}

                  {passSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{passSuccessMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Enregistrer le nouveau mot de passe</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY POLICIES */}
          {activeTab === 'POLICIES' && (
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <span>Politiques Globales de Sécurité du Logiciel</span>
                </h3>

                <div className="space-y-4">
                  {/* Toggle Strict Login Mode */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-0.5 max-w-xl">
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <span>Mode Connexion Strict (Masquer Mots de Passe sur l'Écran de Connexion)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Si activé, les mots de passe par défaut et boutons de démo ne s'affichent plus sur l'écran de connexion pour empêcher toute infiltration visuelle.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityPolicy.strictLoginMode}
                        onChange={(e) => {
                          const updated = { ...securityPolicy, strictLoginMode: e.target.checked };
                          onUpdatePolicy(updated);
                          addAuditLog('SECURITY_CHANGE', `Modification du mode de connexion strict: ${e.target.checked ? 'Activé' : 'Désactivé'}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Toggle Require Password On Delete */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-0.5 max-w-xl">
                      <div className="text-xs font-bold text-slate-900">
                        Confirmation Obligatoire par Mot de Passe pour les Suppressions
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Affiche une fenêtre de sécurité exigeant la saisie du mot de passe avant toute suppression de rapport journalier ou de catégorie.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityPolicy.requirePasswordOnDelete}
                        onChange={(e) => {
                          const updated = { ...securityPolicy, requirePasswordOnDelete: e.target.checked };
                          onUpdatePolicy(updated);
                          addAuditLog('SECURITY_CHANGE', `Confirmation mot de passe sur suppression: ${e.target.checked ? 'Activée' : 'Désactivée'}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Toggle Restrict Shop Access */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-0.5 max-w-xl">
                      <div className="text-xs font-bold text-slate-900">
                        Isolation des Imprimeries (Restreindre les Gérants à leur propre Shop)
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Empêche un gérant de basculer la vue sur l'autre imprimerie sans l'autorisation préalable de l'administrateur.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityPolicy.restrictShopAccess}
                        onChange={(e) => {
                          const updated = { ...securityPolicy, restrictShopAccess: e.target.checked };
                          onUpdatePolicy(updated);
                          addAuditLog('SECURITY_CHANGE', `Restriction d'accès par shop: ${e.target.checked ? 'Activée' : 'Désactivée'}`);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Auto Lock Inactivity Minutes */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 max-w-xl">
                      <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span>Délai de Verrouillage Automatique pour Inactivité</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Verrouille automatiquement l'écran si aucune action n'est détectée pendant ce délai.
                      </p>
                    </div>
                    <select
                      value={securityPolicy.autoLockMinutes}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated = { ...securityPolicy, autoLockMinutes: val };
                        onUpdatePolicy(updated);
                        addAuditLog('SECURITY_CHANGE', `Délai d'inactivité réglé sur : ${val === 0 ? 'Désactivé' : val + ' minutes'}`);
                      }}
                      className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value={0}>Désactivé</option>
                      <option value={3}>3 minutes</option>
                      <option value={5}>5 minutes (Recommandé)</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT TRAIL */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-4">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      placeholder="Rechercher dans les journaux..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <select
                    value={auditCategoryFilter}
                    onChange={(e) => setAuditCategoryFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ALL">Toutes catégories</option>
                    <option value="LOGIN">Connexions (LOGIN)</option>
                    <option value="DATA_CREATE">Créations (DATA_CREATE)</option>
                    <option value="DATA_EDIT">Modifications (DATA_EDIT)</option>
                    <option value="DATA_DELETE">Suppressions (DATA_DELETE)</option>
                    <option value="SECURITY_CHANGE">Sécurité (SECURITY_CHANGE)</option>
                    <option value="PASSWORD_CHANGE">Mots de passe (PASSWORD_CHANGE)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleExportAuditLogs}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter JSON</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={onClearAuditLogs}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Vider le journal</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Logs Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                        <th className="py-2.5 px-3">Date & Heure</th>
                        <th className="py-2.5 px-3">Utilisateur</th>
                        <th className="py-2.5 px-3">Catégorie</th>
                        <th className="py-2.5 px-3">Détail de l'opération</th>
                        <th className="py-2.5 px-3 text-right">Origine</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                            Aucune entrée trouvée dans le journal d'audit.
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.map((log) => {
                          const isDelete = log.actionCategory === 'DATA_DELETE';
                          const isSecurity = log.actionCategory === 'SECURITY_CHANGE' || log.actionCategory === 'PASSWORD_CHANGE';

                          return (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                {log.formattedDate}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="font-bold text-slate-800">{log.userName}</span>
                                <span className="text-[10px] text-slate-400 block uppercase">
                                  {log.userRole === 'admin' ? 'Admin' : log.shopId}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    isDelete
                                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                      : isSecurity
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                  }`}
                                >
                                  {log.actionCategory}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-700 font-medium">
                                {log.details}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-[10px] text-slate-400 whitespace-nowrap">
                                {log.ipAddress || 'Station Locale'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptage local & traçabilité active des transactions</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Fermer le Centre de Sécurité
          </button>
        </div>

      </div>
    </div>
  );
};
