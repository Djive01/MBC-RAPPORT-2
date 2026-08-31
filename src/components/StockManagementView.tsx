import React, { useState } from 'react';
import { StockItem, StockMovementLog, ShopId } from '../types';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit,
  TrendingDown,
  Layers,
  History,
  AlertCircle,
  X,
  Check,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface StockManagementViewProps {
  stockItems: StockItem[];
  activeShopId: ShopId | 'all';
  onAddStockItem: (newItem: Omit<StockItem, 'id'>) => void;
  onUpdateStockQuantity: (id: string, delta: number, reason?: string) => void;
  onDeleteStockItem: (id: string) => void;
  movementLogs: StockMovementLog[];
}

export const StockManagementView: React.FC<StockManagementViewProps> = ({
  stockItems,
  activeShopId,
  onAddStockItem,
  onUpdateStockQuantity,
  onDeleteStockItem,
  movementLogs,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'ALERT' | 'OUT'>('ALL');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickAdjustItem, setQuickAdjustItem] = useState<StockItem | null>(null);
  const [adjustType, setAdjustType] = useState<'RESTOCK' | 'CONSUMPTION'>('RESTOCK');
  const [adjustQtyInput, setAdjustQtyInput] = useState<number>(1);
  const [adjustReasonInput, setAdjustReasonInput] = useState('');
  const [showLogsModal, setShowLogsModal] = useState(false);

  // New Stock Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<StockItem['category']>('TONER');
  const [newItemShopId, setNewItemShopId] = useState<ShopId>(
    activeShopId === 'all' ? 'lingwala' : activeShopId
  );
  const [newItemQuantity, setNewItemQuantity] = useState(5);
  const [newItemUnit, setNewItemUnit] = useState('Cartouche');
  const [newItemThreshold, setNewItemThreshold] = useState(2);
  const [newItemPriceUSD, setNewItemPriceUSD] = useState<number>(0);
  const [newItemSupplier, setNewItemSupplier] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');

  // Filtering
  const filteredItems = stockItems.filter((item) => {
    const matchesShop = activeShopId === 'all' || item.shopId === activeShopId;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

    let matchesStatus = true;
    if (selectedStatusFilter === 'ALERT') {
      matchesStatus = item.quantity <= item.minQuantityThreshold && item.quantity > 0;
    } else if (selectedStatusFilter === 'OUT') {
      matchesStatus = item.quantity === 0;
    }

    return matchesShop && matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate High-level KPIs
  const shopStockItems = stockItems.filter(
    (item) => activeShopId === 'all' || item.shopId === activeShopId
  );
  const totalConsumablesCount = shopStockItems.length;
  const lowStockAlerts = shopStockItems.filter(
    (item) => item.quantity <= item.minQuantityThreshold && item.quantity > 0
  );
  const outOfStockAlerts = shopStockItems.filter((item) => item.quantity === 0);

  const handleCreateStockItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    onAddStockItem({
      shopId: newItemShopId,
      category: newItemCategory,
      name: newItemName,
      quantity: newItemQuantity,
      unit: newItemUnit,
      minQuantityThreshold: newItemThreshold,
      unitPriceUSD: newItemPriceUSD,
      supplier: newItemSupplier,
      notes: newItemNotes,
      lastRestockedDate: new Date().toLocaleDateString('fr-FR'),
    });

    // Reset Form
    setNewItemName('');
    setNewItemQuantity(5);
    setNewItemSupplier('');
    setNewItemNotes('');
    setIsAddModalOpen(false);
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAdjustItem) return;

    const delta = adjustType === 'RESTOCK' ? adjustQtyInput : -adjustQtyInput;
    onUpdateStockQuantity(quickAdjustItem.id, delta, adjustReasonInput);

    setQuickAdjustItem(null);
    setAdjustQtyInput(1);
    setAdjustReasonInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Banner for Low Stock / Out of Stock */}
      {(lowStockAlerts.length > 0 || outOfStockAlerts.length > 0) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 shadow-xs mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Alerte de Réapprovisionnement Stock ({lowStockAlerts.length + outOfStockAlerts.length} Articles Nouveaux)
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {outOfStockAlerts.length > 0 && (
                  <span className="font-bold text-rose-700 mr-2">
                    🚨 {outOfStockAlerts.length} consommable(s) en RUPTURE TOTALE !
                  </span>
                )}
                {lowStockAlerts.length > 0 && (
                  <span>
                    ⚠️ {lowStockAlerts.length} article(s) sous le seuil critique de sécurité.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setSelectedStatusFilter('ALERT')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Voir les Articles en Alerte
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Consomables */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consommables Référencés</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{totalConsumablesCount}</div>
            <span className="text-[10px] text-slate-500">Toners, Encres DTF, Bâches, Papier</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Stock Normal */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stock Optimal (OK)</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {totalConsumablesCount - (lowStockAlerts.length + outOfStockAlerts.length)}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">Niveau de réserve conforme</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Alertes Stock Bas */}
        <div
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'ALERT' ? 'ALL' : 'ALERT')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            lowStockAlerts.length > 0
              ? 'bg-amber-50 border-amber-300 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Alerte Stock Bas</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{lowStockAlerts.length}</div>
            <span className="text-[10px] text-amber-700 font-medium">Sous le seuil de sécurité</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Rupture de Stock */}
        <div
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'OUT' ? 'ALL' : 'OUT')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            outOfStockAlerts.length > 0
              ? 'bg-rose-50 border-rose-300 shadow-xs'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div>
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Ruptures de Stock</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">{outOfStockAlerts.length}</div>
            <span className="text-[10px] text-rose-700 font-bold">Action immédiate requise</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Stock Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Controls Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Chercher toner, encre, bâche..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">Toutes les catégories</option>
              <option value="TONER">Toners Numériques</option>
              <option value="ENCRE_DTF">Encres DTF & Solvants</option>
              <option value="POUDRE_FILM">Poudres & Films DTF</option>
              <option value="BACHE_VINYLE">Bâches & Vinyles</option>
              <option value="PAPIER">Papier & Supports</option>
              <option value="AUTRE">Autres Consommables</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">Tous les états</option>
              <option value="ALERT">⚠️ Stock Bas uniquement</option>
              <option value="OUT">🚨 Rupture de Stock uniquement</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLogsModal(true)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>Historique Mouvements</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Consommable</span>
            </button>
          </div>

        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <th className="py-3 px-4">Article Consommable</th>
                <th className="py-3 px-4">Imprimerie / Shop</th>
                <th className="py-3 px-4 text-center">Quantité en Stock</th>
                <th className="py-3 px-4 text-center">Seuil d'Alerte</th>
                <th className="py-3 px-4">État & Statut</th>
                <th className="py-3 px-4">Dernier Réappro.</th>
                <th className="py-3 px-4 text-right">Ajustement Rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                    Aucun consommable correspondant trouvé dans le stock.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isOut = item.quantity === 0;
                  const isLow = item.quantity <= item.minQuantityThreshold && !isOut;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isOut ? 'bg-rose-50/40' : isLow ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Name & Category */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                        <div className="text-[10px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded uppercase font-semibold">
                            {item.category}
                          </span>
                          {item.supplier && <span>Fournisseur: {item.supplier}</span>}
                        </div>
                      </td>

                      {/* Shop */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.shopId === 'lingwala' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.shopId === 'lingwala' ? 'Lingwala' : 'Limete'}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`text-sm font-extrabold px-2.5 py-1 rounded-xl ${
                          isOut
                            ? 'bg-rose-100 text-rose-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {item.quantity} {item.unit}s
                        </span>
                      </td>

                      {/* Min Threshold */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500 text-[11px]">
                        ≤ {item.minQuantityThreshold} {item.unit}s
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isOut ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>Rupture de Stock</span>
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Stock Bas (Alerte)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Stock Conforme</span>
                          </span>
                        )}
                      </td>

                      {/* Last Restocked */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {item.lastRestockedDate || 'Non spécifié'}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setQuickAdjustItem(item);
                              setAdjustType('RESTOCK');
                              setAdjustQtyInput(1);
                            }}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 font-bold transition-colors cursor-pointer flex items-center space-x-1"
                            title="Entrée en Stock (+)"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Recharger</span>
                          </button>

                          <button
                            onClick={() => {
                              setQuickAdjustItem(item);
                              setAdjustType('CONSUMPTION');
                              setAdjustQtyInput(1);
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 font-bold transition-colors cursor-pointer flex items-center space-x-1"
                            title="Sortie / Consommation Atelier (-)"
                          >
                            <Minus className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Utiliser</span>
                          </button>

                          <button
                            onClick={() => onDeleteStockItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer la référence"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards View */}
        <div className="block md:hidden divide-y divide-slate-200">
          {filteredItems.map((item) => {
            const isOut = item.quantity === 0;
            const isLow = item.quantity <= item.minQuantityThreshold && !isOut;

            return (
              <div key={item.id} className="p-4 space-y-3 bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Catégorie : <span className="font-semibold text-slate-700">{item.category}</span> • Shop: {item.shopId}
                    </div>
                  </div>
                  {isOut ? (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-full">
                      Rupture
                    </span>
                  ) : isLow ? (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                      Alerte Stock
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      OK
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Quantité Disponible</span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {item.quantity} {item.unit}s
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Seuil de Sécurité</span>
                    <span className="font-mono text-slate-600">≤ {item.minQuantityThreshold} {item.unit}s</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    onClick={() => {
                      setQuickAdjustItem(item);
                      setAdjustType('RESTOCK');
                      setAdjustQtyInput(1);
                    }}
                    className="flex-1 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Recharger (+1)</span>
                  </button>
                  <button
                    onClick={() => {
                      setQuickAdjustItem(item);
                      setAdjustType('CONSUMPTION');
                      setAdjustQtyInput(1);
                    }}
                    className="flex-1 py-1.5 bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Utiliser (-1)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* MODAL 1: ADD NEW STOCK CONSUMABLE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Référencer un Nouveau Consommable</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStockItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Désignation du Consommable *
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="ex: Toner Canon Noir C-EXV 49 ou Encre DTF Cyan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="TONER">Toner Numérique</option>
                    <option value="ENCRE_DTF">Encre DTF / Solvant</option>
                    <option value="POUDRE_FILM">Poudre / Film DTF</option>
                    <option value="BACHE_VINYLE">Bâche / Vinyle</option>
                    <option value="PAPIER">Papier & Supports</option>
                    <option value="AUTRE">Autres Consommables</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Imprimerie / Shop *
                  </label>
                  <select
                    value={newItemShopId}
                    onChange={(e) => setNewItemShopId(e.target.value as ShopId)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="lingwala">Shop Lingwala</option>
                    <option value="limete">Shop Limete</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantité Initiale *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unité de Mesure *
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="Cartouche, Litre, Kg..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seuil Alerte *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newItemThreshold}
                    onChange={(e) => setNewItemThreshold(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom du Fournisseur / Provenance
                </label>
                <input
                  type="text"
                  value={newItemSupplier}
                  onChange={(e) => setNewItemSupplier(e.target.value)}
                  placeholder="ex: Fournisseur Hiller Kinshasa"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Enregistrer l'Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK ADJUSTMENT (RESTOCK / CONSUMPTION) */}
      {quickAdjustItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <span>Mouvement de Stock : {quickAdjustItem.name}</span>
              </h3>
              <button
                onClick={() => setQuickAdjustItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAdjustType('RESTOCK')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    adjustType === 'RESTOCK'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + Réapprovisionnement
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('CONSUMPTION')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    adjustType === 'CONSUMPTION'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  - Utilisation / Consommation
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantité ({quickAdjustItem.unit}s)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQtyInput}
                  onChange={(e) => setAdjustQtyInput(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 font-mono"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motif ou Note de service (Optionnel)
                </label>
                <input
                  type="text"
                  value={adjustReasonInput}
                  onChange={(e) => setAdjustReasonInput(e.target.value)}
                  placeholder="ex: Achat facture #9283 ou Impression commande client 50 maillots"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickAdjustItem(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer ${
                    adjustType === 'RESTOCK' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Valider le Mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: MOVEMENT LOGS HISTORY */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Journal Historique des Mouvements de Stock</h3>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-3">
              {movementLogs.length === 0 ? (
                <p className="text-center py-8 text-slate-400 italic text-xs">
                  Aucun mouvement de stock enregistré pour le moment.
                </p>
              ) : (
                movementLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{log.stockItemName}</span>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {log.date} • Par {log.performedBy} {log.reason ? `(${log.reason})` : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        log.type === 'RESTOCK' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.type === 'RESTOCK' ? '+' : ''}{log.quantityChanged}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        Nouveau stock: {log.newQuantity}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
