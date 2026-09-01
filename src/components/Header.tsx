import React from 'react';
import { 
  FileText, 
  PlusCircle, 
  Printer, 
  RotateCcw, 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  Calculator, 
  Store,
  UserCheck,
  Lock,
  ChevronDown,
  Sparkles,
  Monitor,
  Package,
  Wifi,
  Info,
  Calendar
} from 'lucide-react';
import { UserAccount, ShopId } from '../types';
import { MbcLogo } from './MbcLogo';
import { formatMonthLabel } from '../utils/monthUtils';
import { DateRangePicker } from './DateRangePicker';

interface HeaderProps {
  activeTab: 'journal' | 'expenses' | 'receivables' | 'cash' | 'analytics' | 'ai' | 'stock';
  setActiveTab: (tab: 'journal' | 'expenses' | 'receivables' | 'cash' | 'analytics' | 'ai' | 'stock') => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  currencyDisplayMode: 'dual' | 'fc' | 'usd';
  setCurrencyDisplayMode: (mode: 'dual' | 'fc' | 'usd') => void;
  currentUser: UserAccount | null;
  activeShopId: ShopId | 'all';
  setActiveShopId: (shopId: ShopId | 'all') => void;
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  availableMonths?: string[];
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (start: string, end: string) => void;
  onClearDateRange?: () => void;
  onOpenLoginModal: () => void;
  onOpenAddModal: () => void;
  onPrint: () => void;
  onResetData: () => void;
  onOpenElectronModal?: () => void;
  onLockSession?: () => void;
  onOpenSecurityModal?: () => void;
  onOpenSyncModal?: () => void;
  onOpenAboutModal?: () => void;
  lowStockAlertCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  exchangeRate,
  setExchangeRate,
  currencyDisplayMode,
  setCurrencyDisplayMode,
  currentUser,
  activeShopId,
  setActiveShopId,
  selectedMonth = '07/2026',
  onMonthChange,
  availableMonths = ['07/2026', '08/2026'],
  startDate = '',
  endDate = '',
  onDateRangeChange,
  onClearDateRange,
  onOpenLoginModal,
  onOpenAddModal,
  onPrint,
  onResetData,
  onOpenElectronModal,
  onLockSession,
  onOpenSecurityModal,
  onOpenSyncModal,
  onOpenAboutModal,
  lowStockAlertCount = 0,
}) => {

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Logo & Title Section with Active Shop Badge */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAboutModal}
              className="p-1 rounded-xl hover:bg-slate-100 transition-transform active:scale-95 cursor-pointer"
              title="À propos de MBC Print Manager (v1.1.0)"
            >
              <MbcLogo size="md" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  MBC Print Manager
                </h1>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700 border border-indigo-200">
                  v1.1.0
                </span>
                
                {/* Active Shop Badge */}
                {activeShopId === 'lingwala' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center">
                    <Store className="w-3 h-3 mr-1" />
                    Shop LINGWALA
                  </span>
                )}
                {activeShopId === 'limete' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center">
                    <Store className="w-3 h-3 mr-1" />
                    Shop LIMETE
                  </span>
                )}
                {activeShopId === 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center">
                    <Store className="w-3 h-3 mr-1" />
                    Vue Consolidée (2 Shops)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Interactive Month Selector */}
                <div className="inline-flex items-center space-x-1.5 bg-indigo-50/90 border border-indigo-200/80 rounded-lg px-2.5 py-1 text-xs shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-bold text-slate-700">Mois :</span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => onMonthChange && onMonthChange(e.target.value)}
                    className="bg-transparent text-xs font-black text-indigo-900 focus:outline-none cursor-pointer pr-1"
                    title="Sélectionnez le mois à afficher"
                  >
                    {availableMonths.map((m) => (
                      <option key={m} value={m}>
                        {formatMonthLabel(m)}
                      </option>
                    ))}
                    <option value="all">Tous les mois</option>
                  </select>
                </div>

                {/* Custom Date Range Picker (Date X à Date Y) */}
                {onDateRangeChange && onClearDateRange && (
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onDateRangeChange={onDateRangeChange}
                    onClearDateRange={onClearDateRange}
                    compact
                  />
                )}

                <span className="text-slate-300 hidden sm:inline">•</span>

                <span className="text-xs text-slate-600 font-bold">
                  {activeShopId === 'lingwala' ? 'Imprimerie de Lingwala' : activeShopId === 'limete' ? 'Imprimerie de Limete' : 'Toutes les Imprimeries (Consolidé)'}
                </span>

                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shadow-2xs" title="Toutes vos saisies, ajouts, modifications et suppressions sont sauvegardés immédiatement et automatiquement dans votre mémoire locale.">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sauvegarde auto active
                </span>
              </div>
            </div>
          </div>

          {/* Right Controls & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">

            {/* About Modal Trigger */}
            {onOpenAboutModal && (
              <button
                onClick={onOpenAboutModal}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                title="À propos de MBC Print Manager v1.1.0"
              >
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">À propos</span>
              </button>
            )}

            {/* Sync Network / Cloud Modal Trigger */}
            {onOpenSyncModal && (
              <button
                onClick={onOpenSyncModal}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 text-xs transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                title="Réseau Lingwala-Limete-Direction & Cloud Supabase"
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="hidden sm:inline">Sync Réseau & Cloud</span>
              </button>
            )}

            {/* Account & Security Buttons */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 text-xs gap-1">
              <button
                onClick={onOpenLoginModal}
                className="flex items-center space-x-1.5 px-2 py-1 bg-white hover:bg-slate-100 rounded text-slate-700 font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                title="Changer de compte ou réauthentifier"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[110px] truncate">{currentUser ? currentUser.name : 'Se Connecter'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {onOpenSecurityModal && (
                <button
                  onClick={onOpenSecurityModal}
                  className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded border border-indigo-200 transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Ouvrir le Centre de Sécurité & Habilitations"
                >
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Sécurité</span>
                </button>
              )}

              {onLockSession && currentUser && (
                <button
                  onClick={onLockSession}
                  className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors cursor-pointer"
                  title="Verrouiller la session immédiatement"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                </button>
              )}
            </div>

            {/* Shop Selector Dropdown / Pills */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveShopId('lingwala')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center ${
                  activeShopId === 'lingwala'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Afficher le rapport de l'Imprimerie de Lingwala"
              >
                Lingwala
              </button>

              <button
                onClick={() => setActiveShopId('limete')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center ${
                  activeShopId === 'limete'
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Afficher le rapport de l'Imprimerie de Limete"
              >
                Limete
              </button>

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setActiveShopId('all')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center ${
                    activeShopId === 'all'
                      ? 'bg-purple-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Afficher la synthèse des deux imprimeries"
                >
                  Tous (Consolidé)
                </button>
              )}
            </div>

            {/* Taux de Change */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-500 mr-2 font-medium">1 $ =</span>
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value) || 1)}
                className="w-14 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-center font-bold text-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                title="Taux de conversion USD en FC"
              />
              <span className="text-slate-500 ml-1 font-medium">FC</span>
            </div>

            {/* Currency Mode Selector */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setCurrencyDisplayMode('dual')}
                className={`px-2 py-1 rounded-md transition-all ${
                  currencyDisplayMode === 'dual'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Affichage bidevise (FC & USD)"
              >
                Dual
              </button>
              <button
                onClick={() => setCurrencyDisplayMode('fc')}
                className={`px-2 py-1 rounded-md transition-all ${
                  currencyDisplayMode === 'fc'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tout convertir en FC"
              >
                FC
              </button>
              <button
                onClick={() => setCurrencyDisplayMode('usd')}
                className={`px-2 py-1 rounded-md transition-all ${
                  currencyDisplayMode === 'usd'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tout convertir en USD"
              >
                USD ($)
              </button>
            </div>

            {/* Main Action Buttons */}
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center shadow-md active:scale-95 cursor-pointer"
              title="Enregistrer une nouvelle journée (Recettes & Dépenses)"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>+ Journée</span>
            </button>

            <button
              onClick={onPrint}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center shadow-sm active:scale-95 cursor-pointer border border-slate-700 hover:border-slate-600"
              title="Ouvrir la vue d'impression mensuelle A4 / PDF"
            >
              <Printer className="w-4 h-4 mr-1.5 text-emerald-400" />
              <span>Imprimer Rapport</span>
            </button>

            {onOpenElectronModal && (
              <button
                onClick={onOpenElectronModal}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors inline-flex items-center shadow-xs cursor-pointer"
                title="Consulter le guide de génération de l'application autonome Windows (.exe)"
              >
                <Monitor className="w-4 h-4 mr-1.5 text-indigo-400" />
                <span className="hidden xl:inline">App.exe</span>
              </button>
            )}

            <button
              onClick={onResetData}
              className="p-2 bg-slate-100 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Restaurer le jeu de données d'exemple"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 mt-3 overflow-x-auto pb-0.5 scrollbar-none text-xs sm:text-sm font-medium border-t border-slate-100 pt-2.5">
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'journal'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className={`w-4 h-4 mr-2 ${activeTab === 'journal' ? 'text-white' : 'text-indigo-600'}`} />
            Journal des Opérations
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'expenses'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PieChart className={`w-4 h-4 mr-2 ${activeTab === 'expenses' ? 'text-white' : 'text-rose-500'}`} />
            Détails des Dépenses
          </button>

          {/* STOCK & CONSOMMABLES TAB */}
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex items-center px-3.5 py-2 rounded-lg whitespace-nowrap transition-all relative ${
              activeTab === 'stock'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Package className={`w-4 h-4 mr-2 ${activeTab === 'stock' ? 'text-white' : 'text-amber-500'}`} />
            <span>Stock Consommables</span>
            {lowStockAlertCount > 0 && (
              <span className="ml-2 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 animate-pulse">
                {lowStockAlertCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('receivables')}
            className={`flex items-center px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'receivables'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CreditCard className={`w-4 h-4 mr-2 ${activeTab === 'receivables' ? 'text-white' : 'text-amber-500'}`} />
            Créances & Avances
          </button>

          <button
            onClick={() => setActiveTab('cash')}
            className={`flex items-center px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'cash'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calculator className={`w-4 h-4 mr-2 ${activeTab === 'cash' ? 'text-white' : 'text-emerald-600'}`} />
            Rapprochement Caisse
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <TrendingUp className={`w-4 h-4 mr-2 ${activeTab === 'analytics' ? 'text-white' : 'text-indigo-500'}`} />
            Synthèse & Graphiques
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center px-3.5 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md'
                : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200 font-bold'
            }`}
          >
            <Sparkles className={`w-4 h-4 mr-2 ${activeTab === 'ai' ? 'text-amber-300' : 'text-indigo-600 animate-pulse'}`} />
            Assistant IA Gemini
          </button>
        </nav>
      </div>
    </header>
  );
};



