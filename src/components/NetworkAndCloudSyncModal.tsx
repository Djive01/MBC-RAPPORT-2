import React, { useState, useEffect } from 'react';
import { NetworkNode, SupabaseSyncConfig, UserAccount, AuditLogItem } from '../types';
import {
  Wifi,
  Cloud,
  CloudLightning,
  RefreshCw,
  Server,
  Globe,
  Database,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  X,
  Layers,
  ArrowUpRight,
  Send,
  Zap,
  Activity,
  Key,
  Link,
  Check,
  Radio
} from 'lucide-react';

interface NetworkAndCloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  networkNodes: NetworkNode[];
  onTriggerLanSync: () => void;
  supabaseConfig: SupabaseSyncConfig;
  onUpdateSupabaseConfig: (config: SupabaseSyncConfig) => void;
  onTriggerSupabaseSync: () => Promise<void>;
  currentUser: UserAccount | null;
  addAuditLog: (category: AuditLogItem['actionCategory'], details: string) => void;
}

export const NetworkAndCloudSyncModal: React.FC<NetworkAndCloudSyncModalProps> = ({
  isOpen,
  onClose,
  networkNodes,
  onTriggerLanSync,
  supabaseConfig,
  onUpdateSupabaseConfig,
  onTriggerSupabaseSync,
  currentUser,
  addAuditLog,
}) => {
  const [activeTab, setActiveTab] = useState<'LAN_NETWORK' | 'SUPABASE_CLOUD'>('LAN_NETWORK');
  const [isLanSyncing, setIsLanSyncing] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    '03/08/2026 11:30:00 - Connexion réseau local Lingwala <-> Direction active.',
    '03/08/2026 11:30:00 - Service de réplication Supabase prêt (Mode Hybride Hors-Ligne).',
  ]);

  // Form states for Supabase credentials
  const [urlInput, setUrlInput] = useState(supabaseConfig.supabaseUrl);
  const [keyInput, setKeyInput] = useState(supabaseConfig.supabaseAnonKey);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOpen) return null;

  const handleStartLanSync = () => {
    setIsLanSyncing(true);
    const timeStr = new Date().toLocaleTimeString('fr-FR');
    setSyncLogs((prev) => [
      `${timeStr} - 🔄 Démarrage de la synchronisation P2P Réseau Local...`,
      `${timeStr} - Envoi des paquets vers Lingwala POS (192.168.1.12)...`,
      `${timeStr} - Réception des journaux Limete POS (192.168.1.18)...`,
      ...prev,
    ]);

    setTimeout(() => {
      onTriggerLanSync();
      setIsLanSyncing(false);
      setSyncLogs((prev) => [
        `${new Date().toLocaleTimeString('fr-FR')} - ✅ Synchronisation réseau local terminée sans conflit !`,
        ...prev,
      ]);
      addAuditLog('DATA_EDIT', 'Synchronisation réseau local (LAN) exécutée avec succès.');
    }, 1500);
  };

  const handleStartCloudSync = async () => {
    setIsCloudSyncing(true);
    const timeStr = new Date().toLocaleTimeString('fr-FR');
    setSyncLogs((prev) => [
      `${timeStr} - ☁️ Connexion au serveur cloud Supabase en cours...`,
      `${timeStr} - Vérification de la clé API et transmission des enregistrements local storage...`,
      ...prev,
    ]);

    try {
      await onTriggerSupabaseSync();
      setIsCloudSyncing(false);
      setSyncLogs((prev) => [
        `${new Date().toLocaleTimeString('fr-FR')} - ✅ Synchronisation Cloud Supabase réussie ! Tous les rapports sont sauvegardés à distance.`,
        ...prev,
      ]);
      addAuditLog('DATA_EDIT', 'Synchronisation Cloud Supabase exécutée avec succès.');
    } catch (err) {
      setIsCloudSyncing(false);
      setSyncLogs((prev) => [
        `${new Date().toLocaleTimeString('fr-FR')} - ❌ Erreur de synchronisation cloud : Vérifier la connexion Internet.`,
        ...prev,
      ]);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...supabaseConfig,
      supabaseUrl: urlInput,
      supabaseAnonKey: keyInput,
    };
    onUpdateSupabaseConfig(updated);
    addAuditLog('SECURITY_CHANGE', 'Mise à jour des identifiants Supabase Cloud.');
    alert('Configuration Supabase enregistrée avec succès !');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Centre de Synchronisation Réseau & Cloud Supabase</h2>
              <p className="text-xs text-slate-400">
                Liaison réseau multi-sites (Lingwala, Limete, Direction) & Sauvegarde Cloud
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
            onClick={() => setActiveTab('LAN_NETWORK')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-2 border-t border-x cursor-pointer ${
              activeTab === 'LAN_NETWORK'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Wifi className="w-4 h-4 text-indigo-600" />
            <span>Réseau Local Multi-Sites (LAN)</span>
          </button>

          <button
            onClick={() => setActiveTab('SUPABASE_CLOUD')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center space-x-2 border-t border-x cursor-pointer ${
              activeTab === 'SUPABASE_CLOUD'
                ? 'bg-white border-slate-200 text-indigo-700 shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Cloud className="w-4 h-4 text-emerald-600" />
            <span>Cloud Supabase (Optionnel)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          
          {/* TAB 1: LAN NETWORK SYNC */}
          {activeTab === 'LAN_NETWORK' && (
            <div className="space-y-6">
              
              {/* LAN Overview Banner */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Liaison Réseau Local Active (Kinshasa)
                    </h3>
                    <p className="text-xs text-indigo-800 mt-0.5">
                      Permet l'échange en temps réel des journaux de caisse entre Lingwala, Limete et le serveur central sans dépendre d'Internet.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleStartLanSync}
                  disabled={isLanSyncing}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLanSyncing ? 'animate-spin' : ''}`} />
                  <span>{isLanSyncing ? 'Synchronisation...' : 'Synchroniser le Réseau'}</span>
                </button>
              </div>

              {/* Network Nodes Cards */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Stations & Postes de Caisse Connectés
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {networkNodes.map((node) => {
                    const isCentral = node.shopId === 'admin';

                    return (
                      <div
                        key={node.id}
                        className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isCentral
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isCentral ? 'Serveur Maître' : 'Poste Shop'}
                          </span>
                          <span className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>En Ligne</span>
                          </span>
                        </div>

                        <div>
                          <div className="font-bold text-sm text-slate-900">{node.name}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">IP: {node.ipAddress}</div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Dernier Sync:</span>
                          <span className="font-mono text-slate-700 font-semibold">{node.lastSyncTime}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sync Output Log Box */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white font-mono text-xs space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 text-[11px] font-sans font-bold uppercase">
                  <span>Console des Événements Réseau</span>
                  <span>Direct Socket LAN</span>
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto pt-1 text-slate-300">
                  {syncLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SUPABASE CLOUD SYNC */}
          {activeTab === 'SUPABASE_CLOUD' && (
            <div className="space-y-6">
              
              {/* Cloud Status Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isOnline ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-300'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-white ${
                    isOnline ? 'bg-emerald-600' : 'bg-slate-500'
                  }`}>
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {isOnline ? 'Connexion Internet : Disponible' : 'Mode Hors-Ligne (No Internet)'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        supabaseConfig.enabled ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {supabaseConfig.enabled ? 'Option Supabase Activée' : 'Option Inactive'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Grâce au mode <strong>Offline-First</strong>, toutes les données sont stockées en local puis poussées vers Supabase dès que le réseau est rétabli.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={supabaseConfig.enabled}
                      onChange={(e) => {
                        const updated = { ...supabaseConfig, enabled: e.target.checked };
                        onUpdateSupabaseConfig(updated);
                        addAuditLog('SECURITY_CHANGE', `Option Supabase Cloud: ${e.target.checked ? 'Activée' : 'Désactivée'}`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>

                  <button
                    onClick={handleStartCloudSync}
                    disabled={isCloudSyncing || !isOnline}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CloudLightning className={`w-4 h-4 ${isCloudSyncing ? 'animate-bounce' : ''}`} />
                    <span>{isCloudSyncing ? 'Export Cloud...' : 'Synchroniser Cloud'}</span>
                  </button>
                </div>
              </div>

              {/* Credentials Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span>Configuration du Projet Supabase PostgreSQL</span>
                </h4>

                <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      URL du Projet Supabase (https://xxx.supabase.co)
                    </label>
                    <input
                      type="url"
                      required
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Clé Publique Anon / Service Key
                    </label>
                    <input
                      type="password"
                      required
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[11px] text-slate-500">
                      Dernier Push Cloud: <strong>{supabaseConfig.lastCloudSyncTimestamp || 'Jamais'}</strong>
                    </span>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center space-x-1.5"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Sauvegarder Configuration</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Mode Hybride Réseau (LAN + Cloud Fallback)</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Fermer le Panneau Sync
          </button>
        </div>

      </div>
    </div>
  );
};
