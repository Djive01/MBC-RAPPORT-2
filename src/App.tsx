import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  DailyReportItem,
  ExpenseCategoryItem,
  ReceivableItem,
  CashAdjustmentItem,
  UserAccount,
  ShopId,
  SecurityPolicy,
  AuditLogItem,
  StockItem,
  StockMovementLog,
  NetworkNode,
  SupabaseSyncConfig
} from './types';
import { 
  INITIAL_DAILY_REPORTS, 
  INITIAL_EXPENSE_CATEGORIES, 
  INITIAL_RECEIVABLES, 
  INITIAL_CASH_ADJUSTMENTS, 
  DEFAULT_EXCHANGE_RATE,
  USER_ACCOUNTS,
  DEFAULT_SECURITY_POLICY,
  INITIAL_AUDIT_LOGS,
  INITIAL_STOCK_ITEMS,
  INITIAL_NETWORK_NODES,
  DEFAULT_SUPABASE_CONFIG
} from './data/initialData';
import { getAvailableMonths, filterReportsByMonth, parseMonthKey, isDateInRange } from './utils/monthUtils';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { DailyJournalTable } from './components/DailyJournalTable';
import { ExpensesBreakdown } from './components/ExpensesBreakdown';
import { ReceivablesAndAdvances } from './components/ReceivablesAndAdvances';
import { CashReconciliation } from './components/CashReconciliation';
import { AnalyticsView } from './components/AnalyticsView';
import { AiAssistantView } from './components/AiAssistantView';
import { DailyEntryModal } from './components/DailyEntryModal';
import { PrintReportView } from './components/PrintReportView';
import { LoginModal } from './components/LoginModal';
import { ElectronBuildModal } from './components/ElectronBuildModal';
import { SecurityManagementModal } from './components/SecurityManagementModal';
import { SecurityConfirmModal } from './components/SecurityConfirmModal';
import { InactivityLockOverlay } from './components/InactivityLockOverlay';
import { StockManagementView } from './components/StockManagementView';
import { NetworkAndCloudSyncModal } from './components/NetworkAndCloudSyncModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SplashScreen } from './components/SplashScreen';
import { AboutModal } from './components/AboutModal';

// Safe localStorage parse helper
function safeStorageParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Error parsing localStorage for ${key}, using fallback`, e);
    return fallback;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`Failed to set localStorage key: ${key}`, e);
  }
}

export default function App() {
  // Splash Screen & About Modal
  const [showSplash, setShowSplash] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'journal' | 'expenses' | 'receivables' | 'cash' | 'analytics' | 'ai' | 'stock'>('journal');
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mbc_exchange_rate');
      return saved ? Number(saved) || DEFAULT_EXCHANGE_RATE : DEFAULT_EXCHANGE_RATE;
    } catch {
      return DEFAULT_EXCHANGE_RATE;
    }
  });
  const [currencyDisplayMode, setCurrencyDisplayMode] = useState<'dual' | 'fc' | 'usd'>('dual');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('mbc_selected_month');
      return saved || '08/2026';
    } catch {
      return '08/2026';
    }
  });
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearDateRange = () => {
    setStartDate('');
    setEndDate('');
  };
  
  // Account & Shop Access State
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    return safeStorageParse('mbc_user_accounts', USER_ACCOUNTS);
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return safeStorageParse('mbc_current_user', USER_ACCOUNTS[0]);
  });

  const [activeShopId, setActiveShopId] = useState<ShopId | 'all'>(() => {
    const savedUser = safeStorageParse<UserAccount | null>('mbc_current_user', null);
    if (savedUser && savedUser.shopId) {
      return savedUser.shopId;
    }
    return 'lingwala';
  });

  // Security & Audit States
  const [securityPolicy, setSecurityPolicy] = useState<SecurityPolicy>(() => {
    return safeStorageParse('mbc_security_policy', DEFAULT_SECURITY_POLICY);
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    return safeStorageParse('mbc_audit_logs', INITIAL_AUDIT_LOGS);
  });

  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // Stock & Inventory State
  const [stockItems, setStockItems] = useState<StockItem[]>(() => {
    return safeStorageParse('mbc_stock_items', INITIAL_STOCK_ITEMS);
  });

  const [movementLogs, setMovementLogs] = useState<StockMovementLog[]>(() => {
    return safeStorageParse('mbc_stock_logs', []);
  });

  // Network LAN & Supabase Sync States
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>(() => {
    return safeStorageParse('mbc_network_nodes', INITIAL_NETWORK_NODES);
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseSyncConfig>(() => {
    return safeStorageParse('mbc_supabase_config', DEFAULT_SUPABASE_CONFIG);
  });

  // Security Action Confirmation Modal
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<DailyReportItem | null>(null);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [isElectronModalOpen, setIsElectronModalOpen] = useState(false);

  // Core Data States with localStorage persistence
  const [reports, setReports] = useState<DailyReportItem[]>(() => {
    return safeStorageParse('mbc_daily_reports', INITIAL_DAILY_REPORTS);
  });

  const [categories, setCategories] = useState<ExpenseCategoryItem[]>(() => {
    return safeStorageParse('mbc_expense_categories', INITIAL_EXPENSE_CATEGORIES);
  });

  const [receivables, setReceivables] = useState<ReceivableItem[]>(() => {
    return safeStorageParse('mbc_receivables', INITIAL_RECEIVABLES);
  });

  const [adjustments, setAdjustments] = useState<CashAdjustmentItem[]>(() => {
    return safeStorageParse('mbc_cash_adjustments', INITIAL_CASH_ADJUSTMENTS);
  });

  // Persist to localStorage
  useEffect(() => {
    safeSetItem('mbc_daily_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    safeSetItem('mbc_expense_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeSetItem('mbc_receivables', JSON.stringify(receivables));
  }, [receivables]);

  useEffect(() => {
    safeSetItem('mbc_cash_adjustments', JSON.stringify(adjustments));
  }, [adjustments]);

  useEffect(() => {
    safeSetItem('mbc_stock_items', JSON.stringify(stockItems));
  }, [stockItems]);

  useEffect(() => {
    safeSetItem('mbc_stock_logs', JSON.stringify(movementLogs));
  }, [movementLogs]);

  useEffect(() => {
    safeSetItem('mbc_network_nodes', JSON.stringify(networkNodes));
  }, [networkNodes]);

  useEffect(() => {
    safeSetItem('mbc_supabase_config', JSON.stringify(supabaseConfig));
  }, [supabaseConfig]);

  useEffect(() => {
    safeSetItem('mbc_exchange_rate', exchangeRate.toString());
  }, [exchangeRate]);

  useEffect(() => {
    safeSetItem('mbc_selected_month', selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    if (currentUser) {
      safeSetItem('mbc_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    safeSetItem('mbc_user_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    safeSetItem('mbc_security_policy', JSON.stringify(securityPolicy));
  }, [securityPolicy]);

  useEffect(() => {
    safeSetItem('mbc_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helper to add structured audit logs
  const addAuditLog = useCallback(
    (actionCategory: AuditLogItem['actionCategory'], details: string) => {
      const now = new Date();
      const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const newLog: AuditLogItem = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: now.toISOString(),
        formattedDate,
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || 'Inconnu',
        userRole: currentUser?.role || 'shop_manager',
        shopId: activeShopId,
        actionCategory,
        details,
        ipAddress: 'Station Locale (Windows / Web)',
      };

      setAuditLogs((prev) => [newLog, ...prev]);
    },
    [currentUser, activeShopId]
  );

  // Inactivity Auto-Lock Timer Logic
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (securityPolicy.autoLockMinutes > 0 && !isSessionLocked) {
      const timeoutMs = securityPolicy.autoLockMinutes * 60 * 1000;
      inactivityTimerRef.current = setTimeout(() => {
        setIsSessionLocked(true);
        addAuditLog('SECURITY_CHANGE', `Verrouillage automatique de la session après ${securityPolicy.autoLockMinutes} min d'inactivité.`);
      }, timeoutMs);
    }
  }, [securityPolicy.autoLockMinutes, isSessionLocked, addAuditLog]);

  useEffect(() => {
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    resetInactivityTimer();

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [resetInactivityTimer]);

  // Unlock Session Handler
  const handleUnlockSession = (passwordInput: string): boolean => {
    const currentAcc = accounts.find((a) => a.id === currentUser?.id) || currentUser;
    const adminAcc = accounts.find((a) => a.role === 'admin');

    const isValid =
      passwordInput === currentAcc?.password || (adminAcc && passwordInput === adminAcc.password);

    if (isValid) {
      setIsSessionLocked(false);
      addAuditLog('LOGIN', `Déverrouillage de session réussi pour le compte [${currentUser?.name}].`);
      return true;
    }

    addAuditLog('LOGIN', `Échec de déverrouillage de session : mot de passe incorrect pour [${currentUser?.name}].`);
    return false;
  };

  // Password Update Handler
  const handleUpdatePassword = (accountId: string, newPass: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, password: newPass } : acc))
    );
    if (currentUser?.id === accountId) {
      setCurrentUser((prev) => (prev ? { ...prev, password: newPass } : prev));
    }
  };

  // Login Handler
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (securityPolicy.restrictShopAccess && user.role !== 'admin') {
      setActiveShopId(user.shopId);
    } else if (user.shopId !== 'all') {
      setActiveShopId(user.shopId);
    }
    setIsLoginModalOpen(false);
    addAuditLog('LOGIN', `Connexion réussie de l'utilisateur [${user.name}] avec accès au Shop ${user.shopName}.`);
  };

  // Stock Handlers
  const handleAddStockItem = (newItem: Omit<StockItem, 'id'>) => {
    const item: StockItem = {
      ...newItem,
      id: `st-${Date.now()}`,
    };
    setStockItems((prev) => [...prev, item]);
    addAuditLog('DATA_CREATE', `Ajout consommable en stock : "${newItem.name}" (${newItem.quantity} ${newItem.unit}s).`);
  };

  const handleUpdateStockQuantity = (id: string, delta: number, reason?: string) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const prevQty = item.quantity;
          const newQty = Math.max(0, item.quantity + delta);
          
          // Log movement
          const newLog: StockMovementLog = {
            id: `mov-${Date.now()}`,
            stockItemId: item.id,
            stockItemName: item.name,
            type: delta >= 0 ? 'RESTOCK' : 'CONSUMPTION',
            quantityChanged: Math.abs(delta),
            previousQuantity: prevQty,
            newQuantity: newQty,
            date: new Date().toLocaleString('fr-FR'),
            performedBy: currentUser?.name || 'Agent',
            reason: reason || (delta >= 0 ? 'Réapprovisionnement' : 'Consommation atelier'),
          };
          setMovementLogs((logs) => [newLog, ...logs]);

          addAuditLog('DATA_EDIT', `Ajustement stock [${item.name}] : ${prevQty} -> ${newQty} ${item.unit}s.`);
          return {
            ...item,
            quantity: newQty,
            lastRestockedDate: delta > 0 ? new Date().toLocaleDateString('fr-FR') : item.lastRestockedDate,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteStockItem = (id: string) => {
    const target = stockItems.find((s) => s.id === id);
    if (window.confirm(`Supprimer définitivement "${target?.name}" du registre de stock ?`)) {
      setStockItems((prev) => prev.filter((s) => s.id !== id));
      addAuditLog('DATA_DELETE', `Suppression référence stock : "${target?.name}".`);
    }
  };

  // Network LAN & Cloud Handlers
  const handleTriggerLanSync = () => {
    const updatedTime = new Date().toLocaleString('fr-FR');
    setNetworkNodes((prev) =>
      prev.map((node) => ({
        ...node,
        status: 'ONLINE',
        lastSyncTime: updatedTime,
        pendingChangesCount: 0,
      }))
    );
  };

  const handleTriggerSupabaseSync = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSupabaseConfig((prev) => ({
          ...prev,
          lastCloudSyncTimestamp: new Date().toLocaleString('fr-FR'),
          syncStatus: 'SUCCESS',
          queuedOperationsCount: 0,
        }));
        resolve();
      }, 1200);
    });
  };

  // Low stock counter for header badge
  const lowStockAlertCount = stockItems.filter((s) => {
    const matchesShop = activeShopId === 'all' || s.shopId === activeShopId;
    return matchesShop && s.quantity <= s.minQuantityThreshold;
  }).length;

  // Available Months list dynamically built from reports
  const availableMonths = useMemo(() => {
    return getAvailableMonths(reports);
  }, [reports]);

  // Filtered Datasets based on activeShopId & selectedMonth
  const reportsByShop = useMemo(() => {
    return reports.filter((r) => activeShopId === 'all' || r.shopId === activeShopId);
  }, [reports, activeShopId]);

  const filteredReports = useMemo(() => {
    return filterReportsByMonth(reportsByShop, selectedMonth, startDate, endDate);
  }, [reportsByShop, selectedMonth, startDate, endDate]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => activeShopId === 'all' || c.shopId === activeShopId);
  }, [categories, activeShopId]);

  const filteredReceivables = useMemo(() => {
    return receivables.filter((r) => {
      const matchesShop = activeShopId === 'all' || r.shopId === activeShopId;
      if (startDate || endDate) {
        return matchesShop && isDateInRange(r.date || '', startDate, endDate);
      }
      const rMonth = parseMonthKey(r.date || '01/07/2026');
      const matchesMonth = !selectedMonth || selectedMonth === 'all' || rMonth === selectedMonth;
      return matchesShop && matchesMonth;
    });
  }, [receivables, activeShopId, selectedMonth, startDate, endDate]);

  const filteredAdjustments = useMemo(() => {
    return adjustments.filter((a) => {
      const matchesShop = activeShopId === 'all' || a.shopId === activeShopId;
      if (startDate || endDate) {
        return matchesShop && isDateInRange(a.date || '', startDate, endDate);
      }
      const aMonth = parseMonthKey(a.date || '01/07/2026');
      const matchesMonth = !selectedMonth || selectedMonth === 'all' || aMonth === selectedMonth;
      return matchesShop && matchesMonth;
    });
  }, [adjustments, activeShopId, selectedMonth, startDate, endDate]);

  // Default Shop ID for new entries
  const currentShopIdForNewEntry: ShopId = activeShopId === 'all' ? 'lingwala' : activeShopId;

  // Handlers for Daily Reports
  const handleSaveReport = (reportData: Omit<DailyReportItem, 'id'> & { id?: string }) => {
    const targetShopId = reportData.shopId || currentShopIdForNewEntry;
    
    if (reportData.id) {
      // Edit existing
      setReports((prev) =>
        prev.map((r) => (r.id === reportData.id ? ({ ...reportData, shopId: targetShopId, id: reportData.id } as DailyReportItem) : r))
      );
      addAuditLog('DATA_EDIT', `Modification du rapport de caisse du ${reportData.date} pour le shop ${targetShopId}.`);
    } else {
      // Add new
      const newReport: DailyReportItem = {
        ...reportData,
        shopId: targetShopId,
        id: `report-${Date.now()}`,
      };
      setReports((prev) => [newReport, ...prev]);
      addAuditLog('DATA_CREATE', `Saisie du rapport de caisse du ${reportData.date} (Recettes: ${reportData.recettesFC} FC / $${reportData.recettesUSD}).`);
    }

    // Auto switch active shop if user added for a different shop so they see their newly saved report
    if (activeShopId !== 'all' && activeShopId !== targetShopId && !securityPolicy.restrictShopAccess) {
      setActiveShopId(targetShopId);
    }

    // Auto adjust selected month to ensure the newly added/edited report is visible
    const reportMonth = parseMonthKey(reportData.date);
    if (reportMonth && selectedMonth !== 'all' && selectedMonth !== reportMonth) {
      setSelectedMonth(reportMonth);
    }

    setEditingReport(null);
  };

  const executeDeleteReport = (id: string) => {
    const reportToDelete = reports.find((r) => r.id === id);
    setReports((prev) => prev.filter((r) => r.id !== id));
    addAuditLog('DATA_DELETE', `Suppression du rapport journalier [Date: ${reportToDelete?.date || id}].`);
  };

  const handleDeleteReport = (id: string) => {
    const reportToDelete = reports.find((r) => r.id === id);

    if (securityPolicy.requirePasswordOnDelete) {
      setConfirmModalConfig({
        isOpen: true,
        title: 'Confirmation Sécurisée de Suppression',
        description: `Êtes-vous sûr de vouloir supprimer définitivement le rapport journalier du ${reportToDelete?.date || id} ? Saisissez votre mot de passe.`,
        onConfirm: () => executeDeleteReport(id),
      });
    } else if (window.confirm('Voulez-vous vraiment supprimer cette journée ?')) {
      executeDeleteReport(id);
    }
  };

  const handleEditReportClick = (report: DailyReportItem) => {
    setEditingReport(report);
    setIsDailyModalOpen(true);
  };

  // Handlers for Categories
  const handleAddCategory = (newCat: Omit<ExpenseCategoryItem, 'id'>) => {
    const item: ExpenseCategoryItem = {
      ...newCat,
      shopId: newCat.shopId || currentShopIdForNewEntry,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, item]);
    addAuditLog('DATA_CREATE', `Ajout de la rubrique de dépense "${newCat.rubrique}" (${newCat.francs} FC / $${newCat.dollars}).`);
  };

  const handleEditCategory = (updatedCat: ExpenseCategoryItem) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
    addAuditLog('DATA_EDIT', `Mise à jour de la rubrique "${updatedCat.rubrique}".`);
  };

  const executeDeleteCategory = (id: string) => {
    const catToDelete = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('DATA_DELETE', `Suppression de la rubrique de dépense "${catToDelete?.rubrique || id}".`);
  };

  const handleDeleteCategory = (id: string) => {
    const catToDelete = categories.find((c) => c.id === id);

    if (securityPolicy.requirePasswordOnDelete) {
      setConfirmModalConfig({
        isOpen: true,
        title: 'Validation Mot de Passe Requise',
        description: `Suppression de la rubrique "${catToDelete?.rubrique || id}". Entrez le mot de passe pour confirmer.`,
        onConfirm: () => executeDeleteCategory(id),
      });
    } else if (window.confirm('Supprimer cette rubrique de dépense ?')) {
      executeDeleteCategory(id);
    }
  };

  // Handlers for Receivables & Adjustments
  const handleToggleReceivableStatus = (id: string) => {
    setReceivables((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'PAID' ? 'PENDING' : 'PAID';
          addAuditLog('DATA_EDIT', `Changement de statut créance [Client: ${r.client}] -> ${nextStatus}.`);
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const handleAddReceivable = (newRec: Omit<ReceivableItem, 'id'>) => {
    const item: ReceivableItem = {
      ...newRec,
      shopId: newRec.shopId || currentShopIdForNewEntry,
      id: `rec-${Date.now()}`,
    };
    setReceivables((prev) => [...prev, item]);
    addAuditLog('DATA_CREATE', `Création créance client "${newRec.client}" ($${newRec.amountUSD} / ${newRec.amountFC} FC).`);
  };

  const handleEditReceivable = (updated: ReceivableItem) => {
    setReceivables((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    addAuditLog('DATA_EDIT', `Modification de la créance client "${updated.client}".`);
  };

  const handleDeleteReceivable = (id: string) => {
    setReceivables((prev) => prev.filter((r) => r.id !== id));
    addAuditLog('DATA_DELETE', `Suppression de la créance client (ID: ${id}).`);
  };

  const handleAddAdjustment = (newAdj: Omit<CashAdjustmentItem, 'id'>) => {
    const item: CashAdjustmentItem = {
      ...newAdj,
      shopId: newAdj.shopId || currentShopIdForNewEntry,
      id: `adj-${Date.now()}`,
    };
    setAdjustments((prev) => [...prev, item]);
    addAuditLog('DATA_CREATE', `Enregistrement avance/sortie de caisse : "${newAdj.description}" à ${newAdj.targetEntity}.`);
  };

  const handleEditAdjustment = (updated: CashAdjustmentItem) => {
    setAdjustments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    addAuditLog('DATA_EDIT', `Modification de l'ajustement/avance de caisse "${updated.description}".`);
  };

  const handleDeleteAdjustment = (id: string) => {
    setAdjustments((prev) => prev.filter((a) => a.id !== id));
    addAuditLog('DATA_DELETE', `Suppression de l'ajustement/avance de caisse (ID: ${id}).`);
  };

  // Reset Data Handler
  const executeResetData = () => {
    localStorage.clear();
    setReports(INITIAL_DAILY_REPORTS);
    setCategories(INITIAL_EXPENSE_CATEGORIES);
    setReceivables(INITIAL_RECEIVABLES);
    setAdjustments(INITIAL_CASH_ADJUSTMENTS);
    setStockItems(INITIAL_STOCK_ITEMS);
    setMovementLogs([]);
    setNetworkNodes(INITIAL_NETWORK_NODES);
    setExchangeRate(DEFAULT_EXCHANGE_RATE);
    setSecurityPolicy(DEFAULT_SECURITY_POLICY);
    setSelectedMonth('07/2026');
    setActiveShopId('lingwala');
    setStartDate('');
    setEndDate('');
    setActiveTab('journal');
    addAuditLog('SYSTEM_RESET', 'Restauration complète des données initiales (Juillet et Août 2026).');
  };

  const handleResetData = () => {
    if (securityPolicy.requirePasswordOnDelete) {
      setConfirmModalConfig({
        isOpen: true,
        title: 'REINITIALISATION DU SYSTEME',
        description: 'ATTENTION : Cette opération remettra toutes les données d\'origine (Lingwala et Limete). Veuillez saisir votre mot de passe pour confirmer.',
        onConfirm: executeResetData,
      });
    } else if (window.confirm("Restaurer l'ensemble des données initiales de l'application (Juillet & Août 2026) ?")) {
      executeResetData();
    }
  };

  // Total summary calculations on filtered dataset
  const totalRecettesFC = (filteredReports || []).reduce((acc, r) => acc + (Number(r?.recettesFC) || 0), 0);
  const totalRecettesUSD = (filteredReports || []).reduce((acc, r) => acc + (Number(r?.recettesUSD) || 0), 0);
  const totalDepensesFC = (filteredReports || []).reduce((acc, r) => acc + (Number(r?.depensesFC) || 0), 0);
  const totalDepensesUSD = (filteredReports || []).reduce((acc, r) => acc + (Number(r?.depensesUSD) || 0), 0);
  const totalReceivablesUSD = (filteredReceivables || [])
    .filter((r) => r && r.status !== 'PAID')
    .reduce((sum, r) => sum + (Number(r?.amountUSD) || 0), 0);

  const soldeTheoreticalFC = totalRecettesFC - totalDepensesFC;
  const soldeTheoreticalUSD = totalRecettesUSD - totalDepensesUSD;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-16 md:pb-6">
      
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        exchangeRate={exchangeRate}
        setExchangeRate={setExchangeRate}
        currencyDisplayMode={currencyDisplayMode}
        setCurrencyDisplayMode={setCurrencyDisplayMode}
        currentUser={currentUser}
        activeShopId={activeShopId}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        availableMonths={availableMonths}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={handleDateRangeChange}
        onClearDateRange={handleClearDateRange}
        setActiveShopId={(shopId) => {
          if (securityPolicy.restrictShopAccess && currentUser?.role !== 'admin' && shopId !== currentUser?.shopId) {
            alert('Accès restreint par politique de sécurité : vous êtes assigné exclusivement à votre imprimerie.');
            return;
          }
          setActiveShopId(shopId);
          addAuditLog('DATA_EDIT', `Bascule de la vue active sur l'imprimerie [${shopId}].`);
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenAddModal={() => {
          setEditingReport(null);
          setIsDailyModalOpen(true);
        }}
        onPrint={() => setIsPrintViewOpen(true)}
        onResetData={handleResetData}
        onOpenElectronModal={() => setIsElectronModalOpen(true)}
        onLockSession={() => {
          setIsSessionLocked(true);
          addAuditLog('SECURITY_CHANGE', `Verrouillage manuel de session déclenché par [${currentUser?.name}].`);
        }}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        lowStockAlertCount={lowStockAlertCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top KPI Cards */}
        <SummaryCards
          totalRecettesFC={totalRecettesFC}
          totalRecettesUSD={totalRecettesUSD}
          totalDepensesFC={totalDepensesFC}
          totalDepensesUSD={totalDepensesUSD}
          totalReceivablesUSD={totalReceivablesUSD}
          exchangeRate={exchangeRate}
          currencyDisplayMode={currencyDisplayMode}
          onNavigateTab={setActiveTab}
        />

        {/* Tab 1: Daily Journal Table */}
        {activeTab === 'journal' && (
          <DailyJournalTable
            reports={filteredReports}
            onAddReport={() => {
              setEditingReport(null);
              setIsDailyModalOpen(true);
            }}
            onEditReport={handleEditReportClick}
            onDeleteReport={handleDeleteReport}
            exchangeRate={exchangeRate}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            onClearDateRange={handleClearDateRange}
          />
        )}

        {/* Tab 2: Expense Categories Breakdown */}
        {activeTab === 'expenses' && (
          <ExpensesBreakdown
            categories={filteredCategories}
            reports={filteredReports}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onEditReport={handleEditReportClick}
            onOpenDailyEntry={() => {
              setEditingReport(null);
              setIsDailyModalOpen(true);
            }}
            exchangeRate={exchangeRate}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            onClearDateRange={handleClearDateRange}
          />
        )}

        {/* Tab 3: Stock Management & Consumables */}
        {activeTab === 'stock' && (
          <StockManagementView
            stockItems={stockItems}
            activeShopId={activeShopId}
            onAddStockItem={handleAddStockItem}
            onUpdateStockQuantity={handleUpdateStockQuantity}
            onDeleteStockItem={handleDeleteStockItem}
            movementLogs={movementLogs}
          />
        )}

        {/* Tab 4: Receivables & Cash Outlays */}
        {activeTab === 'receivables' && (
          <ReceivablesAndAdvances
            receivables={filteredReceivables}
            adjustments={filteredAdjustments}
            onToggleReceivableStatus={handleToggleReceivableStatus}
            onAddReceivable={handleAddReceivable}
            onEditReceivable={handleEditReceivable}
            onDeleteReceivable={handleDeleteReceivable}
            onAddAdjustment={handleAddAdjustment}
            onEditAdjustment={handleEditAdjustment}
            onDeleteAdjustment={handleDeleteAdjustment}
            exchangeRate={exchangeRate}
          />
        )}

        {/* Tab 5: Cash Reconciliation */}
        {activeTab === 'cash' && (
          <CashReconciliation
            soldeTheoreticalFC={soldeTheoreticalFC}
            soldeTheoreticalUSD={soldeTheoreticalUSD}
            exchangeRate={exchangeRate}
          />
        )}

        {/* Tab 6: Analytics & Visual Charts */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            reports={filteredReports}
            categories={filteredCategories}
            exchangeRate={exchangeRate}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            availableMonths={availableMonths}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            onClearDateRange={handleClearDateRange}
          />
        )}

        {/* Tab 7: AI Assistant Gemini */}
        {activeTab === 'ai' && (
          <AiAssistantView
            reports={filteredReports}
            categories={filteredCategories}
            receivables={filteredReceivables}
            adjustments={filteredAdjustments}
            exchangeRate={exchangeRate}
            activeShopId={activeShopId}
          />
        )}

      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddReportModal={() => {
          setEditingReport(null);
          setIsDailyModalOpen(true);
        }}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        lowStockAlertCount={lowStockAlertCount}
      />

      {/* Network LAN & Cloud Supabase Sync Modal */}
      <NetworkAndCloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        networkNodes={networkNodes}
        onTriggerLanSync={handleTriggerLanSync}
        supabaseConfig={supabaseConfig}
        onUpdateSupabaseConfig={setSupabaseConfig}
        onTriggerSupabaseSync={handleTriggerSupabaseSync}
        currentUser={currentUser}
        addAuditLog={addAuditLog}
      />

      {/* Login / Shop Account Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        accounts={accounts}
        strictMode={securityPolicy.strictLoginMode}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Security Center Management Modal */}
      <SecurityManagementModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        currentUser={currentUser}
        accounts={accounts}
        onUpdatePassword={handleUpdatePassword}
        securityPolicy={securityPolicy}
        onUpdatePolicy={(p) => setSecurityPolicy(p)}
        auditLogs={auditLogs}
        onClearAuditLogs={() => {
          setAuditLogs([]);
          addAuditLog('SECURITY_CHANGE', 'Purge complète du journal d\'audit par l\'administrateur.');
        }}
        addAuditLog={addAuditLog}
      />

      {/* Inactivity Session Lock Screen */}
      <InactivityLockOverlay
        isLocked={isSessionLocked}
        currentUser={currentUser}
        onUnlock={handleUnlockSession}
        onSwitchUser={() => {
          setIsSessionLocked(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Password Confirmation Dialog for Sensitive Actions */}
      <SecurityConfirmModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        currentUser={currentUser}
        allAccounts={accounts}
        title={confirmModalConfig.title}
        description={confirmModalConfig.description}
        onConfirm={confirmModalConfig.onConfirm}
      />

      {/* Daily Entry Add/Edit Modal */}
      <DailyEntryModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        onSave={handleSaveReport}
        editingReport={editingReport}
        defaultShopId={currentShopIdForNewEntry}
      />

      {/* Electron Build Guide Modal */}
      <ElectronBuildModal
        isOpen={isElectronModalOpen}
        onClose={() => setIsElectronModalOpen(false)}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Print / Export View */}
      {isPrintViewOpen && (
        <PrintReportView
          reports={filteredReports}
          categories={filteredCategories}
          receivables={filteredReceivables}
          adjustments={filteredAdjustments}
          activeShopId={activeShopId}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          availableMonths={availableMonths}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          onClearDateRange={handleClearDateRange}
          onClose={() => setIsPrintViewOpen(false)}
        />
      )}

    </div>
  );
}
