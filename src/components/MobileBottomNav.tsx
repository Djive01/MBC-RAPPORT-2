import React from 'react';
import {
  FileText,
  PieChart,
  Package,
  Receipt,
  Sparkles,
  Wifi,
  Plus,
  BarChart3,
  MoreHorizontal
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'journal' | 'expenses' | 'receivables' | 'cash' | 'analytics' | 'ai' | 'stock';
  setActiveTab: (tab: 'journal' | 'expenses' | 'receivables' | 'cash' | 'analytics' | 'ai' | 'stock') => void;
  onOpenAddReportModal: () => void;
  onOpenSyncModal: () => void;
  lowStockAlertCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddReportModal,
  onOpenSyncModal,
  lowStockAlertCount,
}) => {
  return (
    <>
      {/* Floating Action Button for Rapid Entry on Mobile */}
      <button
        onClick={onOpenAddReportModal}
        className="md:hidden fixed bottom-18 right-4 z-40 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-2xl border-2 border-white cursor-pointer active:scale-95 transition-transform"
        title="Nouveau Rapport Journalier"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-slate-400 px-2 py-1.5 flex justify-around items-center shadow-2xl backdrop-blur-md bg-opacity-95">
        
        {/* Tab 1: Journal */}
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'journal' ? 'text-indigo-400 font-bold bg-slate-800/80' : 'hover:text-slate-200'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Journal</span>
        </button>

        {/* Tab 2: Expenses */}
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'expenses' ? 'text-indigo-400 font-bold bg-slate-800/80' : 'hover:text-slate-200'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Dépenses</span>
        </button>

        {/* Tab 3: Stock Consommables + Badge */}
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
            activeTab === 'stock' ? 'text-indigo-400 font-bold bg-slate-800/80' : 'hover:text-slate-200'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Stock</span>
          {lowStockAlertCount > 0 && (
            <span className="absolute top-0.5 right-1.5 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
              {lowStockAlertCount}
            </span>
          )}
        </button>

        {/* Tab 4: Receivables & Outlays */}
        <button
          onClick={() => setActiveTab('receivables')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'receivables' ? 'text-indigo-400 font-bold bg-slate-800/80' : 'hover:text-slate-200'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Créances</span>
        </button>

        {/* Tab 5: Sync Network/Cloud */}
        <button
          onClick={onOpenSyncModal}
          className="flex flex-col items-center py-1 px-2.5 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
        >
          <Wifi className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Sync</span>
        </button>

        {/* Tab 6: AI Assistant */}
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'ai' ? 'text-indigo-400 font-bold bg-slate-800/80' : 'hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="text-[10px] mt-0.5">IA</span>
        </button>

      </nav>
    </>
  );
};
