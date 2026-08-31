export type ShopId = 'lingwala' | 'limete';

export interface DetailedExpenseItem {
  id: string;
  motif: string;
  amountFC: number;
  amountUSD: number;
  category?: string;
}

export interface DailyReportItem {
  id: string;
  shopId: ShopId;
  date: string; // DD/MM/YYYY format
  recettesFC: number;
  recettesUSD: number;
  depensesFC: number;
  depensesUSD: number;
  motifDepenses?: string; // Global motif summary or default
  expenseItems?: DetailedExpenseItem[]; // Detailed multi-expense line items per day
  notes?: string;
  isRestDay?: boolean;
}

export interface ExpenseCategoryItem {
  id: string;
  shopId: ShopId;
  rubrique: string;
  francs: number;
  dollars: number;
  description?: string;
}

export interface ReceivableItem {
  id: string;
  shopId: ShopId;
  client: string;
  description: string;
  details?: string; // e.g. "40 A3 dtf imprimé et 34 mètre de DTF"
  amountUSD: number;
  amountFC: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID';
  includedInMainReceipts: boolean;
  date: string;
}

export interface CashAdjustmentItem {
  id: string;
  shopId: ShopId;
  description: string;
  targetEntity: string;
  amountUSD: number;
  amountFC: number;
  type: 'ADVANCE' | 'EXPENSE_OUTLAY' | 'DEBT_SETTLEMENT';
  date: string;
  notes?: string;
}

export interface UserAccount {
  id: string; // 'lingwala', 'limete', 'admin'
  username: string;
  name: string;
  shopId: ShopId | 'all';
  shopName: string;
  role: 'shop_manager' | 'admin';
  password?: string;
}

export interface SecurityPolicy {
  strictLoginMode: boolean; // Hide password hints & quick demo login
  requirePasswordOnDelete: boolean; // Prompt for password before deleting reports or categories
  autoLockMinutes: number; // Inactivity auto-lock timeout in minutes (0 = disabled, 3, 5, 10, 15)
  restrictShopAccess: boolean; // Restrict shop managers exclusively to their assigned shop
}

export interface AuditLogItem {
  id: string;
  timestamp: string; // ISO date string
  formattedDate: string; // DD/MM/YYYY HH:mm:ss
  userId: string;
  userName: string;
  userRole: 'shop_manager' | 'admin';
  shopId: ShopId | 'all';
  actionCategory: 'LOGIN' | 'LOGOUT' | 'DATA_CREATE' | 'DATA_EDIT' | 'DATA_DELETE' | 'SECURITY_CHANGE' | 'PASSWORD_CHANGE' | 'SYSTEM_RESET';
  details: string;
  ipAddress?: string;
}

export interface CashDenominationCount {
  fc20000: number;
  fc10000: number;
  fc5000: number;
  fc1000: number;
  fc500: number;
  usd100: number;
  usd50: number;
  usd20: number;
  usd10: number;
  usd5: number;
  usd1: number;
}

export interface StockItem {
  id: string;
  shopId: ShopId;
  category: 'TONER' | 'ENCRE_DTF' | 'POUDRE_FILM' | 'BACHE_VINYLE' | 'PAPIER' | 'AUTRE';
  name: string;
  quantity: number;
  unit: string; // e.g. "Cartouche", "Litre", "Kg", "Rouleau", "Rame", "Paquet"
  minQuantityThreshold: number; // Low stock alert threshold
  lastRestockedDate?: string;
  unitPriceUSD?: number;
  supplier?: string;
  notes?: string;
}

export interface StockMovementLog {
  id: string;
  stockItemId: string;
  stockItemName: string;
  type: 'RESTOCK' | 'CONSUMPTION' | 'ADJUSTMENT';
  quantityChanged: number;
  previousQuantity: number;
  newQuantity: number;
  date: string; // DD/MM/YYYY HH:mm
  performedBy: string;
  reason?: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  shopId: ShopId | 'admin';
  ipAddress: string;
  status: 'ONLINE' | 'OFFLINE' | 'SYNCING';
  lastSyncTime: string;
  pendingChangesCount: number;
}

export interface SupabaseSyncConfig {
  enabled: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  autoSyncOnConnection: boolean;
  lastCloudSyncTimestamp: string | null;
  syncStatus: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR' | 'OFFLINE_QUEUED';
  queuedOperationsCount: number;
}


