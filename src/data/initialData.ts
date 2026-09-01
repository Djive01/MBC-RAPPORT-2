import { DailyReportItem, ExpenseCategoryItem, ReceivableItem, CashAdjustmentItem, UserAccount } from '../types';

export const USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'lingwala',
    username: 'lingwala',
    name: 'Gérant - Shop Lingwala',
    shopId: 'lingwala',
    shopName: 'Imprimerie Lingwala',
    role: 'shop_manager',
    password: 'lingwala123',
  },
  {
    id: 'limete',
    username: 'limete',
    name: 'Gérant - Shop Limete',
    shopId: 'limete',
    shopName: 'Imprimerie Limete',
    role: 'shop_manager',
    password: 'limete123',
  },
  {
    id: 'admin',
    username: 'admin',
    name: 'Direction Générale (Admin)',
    shopId: 'all',
    shopName: 'Toutes les Imprimeries',
    role: 'admin',
    password: 'admin123',
  },
];

export const INITIAL_DAILY_REPORTS: DailyReportItem[] = [
  // LINGWALA SHOP REPORTS
  { id: 'l-1', shopId: 'lingwala', date: '01/07/2026', recettesFC: 49500, recettesUSD: 0, depensesFC: 5000, depensesUSD: 0, motifDepenses: 'Frais de transport & coursier' },
  { id: 'l-2', shopId: 'lingwala', date: '02/07/2026', recettesFC: 171000, recettesUSD: 10, depensesFC: 8000, depensesUSD: 0, motifDepenses: 'Fournitures de bureau & papier' },
  { id: 'l-3', shopId: 'lingwala', date: '03/07/2026', recettesFC: 168700, recettesUSD: 119, depensesFC: 19000, depensesUSD: 7, motifDepenses: 'Carburant groupe & petit matériel' },
  { id: 'l-4', shopId: 'lingwala', date: '04/07/2026', recettesFC: 85200, recettesUSD: 25, depensesFC: 0, depensesUSD: 0 },
  { id: 'l-5', shopId: 'lingwala', date: '05/07/2026', recettesFC: 0, recettesUSD: 0, depensesFC: 0, depensesUSD: 0, isRestDay: true, notes: 'Dimanche - Jour de repos' },
  { id: 'l-6', shopId: 'lingwala', date: '06/07/2026', recettesFC: 281250, recettesUSD: 23, depensesFC: 5000, depensesUSD: 65, motifDepenses: 'Achat toner & frais Hiller' },
  { id: 'l-7', shopId: 'lingwala', date: '07/07/2026', recettesFC: 208500, recettesUSD: 60, depensesFC: 10000, depensesUSD: 30, motifDepenses: 'Consommables DTF & Transport' },
  { id: 'l-8', shopId: 'lingwala', date: '08/07/2026', recettesFC: 136750, recettesUSD: 15, depensesFC: 14000, depensesUSD: 0, motifDepenses: 'Carburant groupe électrogène' },
  { id: 'l-9', shopId: 'lingwala', date: '09/07/2026', recettesFC: 58250, recettesUSD: 75, depensesFC: 10000, depensesUSD: 19, motifDepenses: 'Frais de transport & collation' },
  { id: 'l-10', shopId: 'lingwala', date: '10/07/2026', recettesFC: 88000, recettesUSD: 114, depensesFC: 10000, depensesUSD: 35, motifDepenses: 'Maintenance préventive & Ingénieur' },
  { id: 'l-11', shopId: 'lingwala', date: '11/07/2026', recettesFC: 174000, recettesUSD: 36, depensesFC: 8000, depensesUSD: 10, motifDepenses: 'Fournitures diverses' },
  { id: 'l-12', shopId: 'lingwala', date: '12/07/2026', recettesFC: 0, recettesUSD: 0, depensesFC: 0, depensesUSD: 0, isRestDay: true, notes: 'Dimanche - Jour de repos' },
  { id: 'l-13', shopId: 'lingwala', date: '13/07/2026', recettesFC: 87000, recettesUSD: 60, depensesFC: 9500, depensesUSD: 33, motifDepenses: 'Carburant & poudres DTF' },
  { id: 'l-14', shopId: 'lingwala', date: '14/07/2026', recettesFC: 129200, recettesUSD: 16, depensesFC: 8000, depensesUSD: 0, motifDepenses: 'Frais de coursier' },
  { id: 'l-15', shopId: 'lingwala', date: '15/07/2026', recettesFC: 149500, recettesUSD: 16, depensesFC: 27000, depensesUSD: 0, motifDepenses: 'Carburant & entretien atelier' },
  { id: 'l-16', shopId: 'lingwala', date: '16/07/2026', recettesFC: 73750, recettesUSD: 16, depensesFC: 5000, depensesUSD: 11.5, motifDepenses: 'Petite fourniture bureau' },
  { id: 'l-17', shopId: 'lingwala', date: '17/07/2026', recettesFC: 138500, recettesUSD: 26, depensesFC: 18000, depensesUSD: 35, motifDepenses: 'Consommables & Carburant' },
  { id: 'l-18', shopId: 'lingwala', date: '18/07/2026', recettesFC: 56700, recettesUSD: 0, depensesFC: 31000, depensesUSD: 0, motifDepenses: 'Frais de transport & maintenance' },
  { id: 'l-19', shopId: 'lingwala', date: '19/07/2026', recettesFC: 0, recettesUSD: 0, depensesFC: 0, depensesUSD: 0, isRestDay: true, notes: 'Dimanche - Jour de repos' },
  { id: 'l-20', shopId: 'lingwala', date: '20/07/2026', recettesFC: 152000, recettesUSD: 4, depensesFC: 7500, depensesUSD: 0, motifDepenses: 'Achats divers atelier' },
  { id: 'l-21', shopId: 'lingwala', date: '21/07/2026', recettesFC: 162250, recettesUSD: 154, depensesFC: 48000, depensesUSD: 217, motifDepenses: 'Intervention Ingénieur & Consommables DTF' },
  { id: 'l-22', shopId: 'lingwala', date: '22/07/2026', recettesFC: 127300, recettesUSD: 126.5, depensesFC: 43000, depensesUSD: 30, motifDepenses: 'Frais Hiller & Carburant' },
  { id: 'l-23', shopId: 'lingwala', date: '23/07/2026', recettesFC: 74800, recettesUSD: 31, depensesFC: 5000, depensesUSD: 420, motifDepenses: 'Achat principal Toner Canon ($420)' },
  { id: 'l-24', shopId: 'lingwala', date: '24/07/2026', recettesFC: 257200, recettesUSD: 0, depensesFC: 22000, depensesUSD: 31, motifDepenses: 'Consommables DTF & Carburant' },
  { id: 'l-25', shopId: 'lingwala', date: '25/07/2026', recettesFC: 312550, recettesUSD: 176, depensesFC: 51000, depensesUSD: 35, motifDepenses: 'Réparation machine & Transport' },
  { id: 'l-26', shopId: 'lingwala', date: '26/07/2026', recettesFC: 0, recettesUSD: 0, depensesFC: 0, depensesUSD: 0, isRestDay: true, notes: 'Dimanche - Jour de repos' },
  { id: 'l-27', shopId: 'lingwala', date: '27/07/2026', recettesFC: 336100, recettesUSD: 55, depensesFC: 11500, depensesUSD: 76.5, motifDepenses: 'Fournitures & Carburant' },
  { id: 'l-28', shopId: 'lingwala', date: '28/07/2026', recettesFC: 475000, recettesUSD: 0, depensesFC: 35000, depensesUSD: 0, motifDepenses: 'Frais Hiller & Maintenance' },
  { id: 'l-29', shopId: 'lingwala', date: '29/07/2026', recettesFC: 184000, recettesUSD: 23, depensesFC: 30000, depensesUSD: 0, motifDepenses: 'Carburant groupe & coursier' },
  { id: 'l-30', shopId: 'lingwala', date: '30/07/2026', recettesFC: 197300, recettesUSD: 46, depensesFC: 7500, depensesUSD: 53.5, motifDepenses: 'Frais Hiller & Consommables' },
  { id: 'l-31', shopId: 'lingwala', date: '31/07/2026', recettesFC: 152500, recettesUSD: 72, depensesFC: 40000, depensesUSD: 20, motifDepenses: 'Achat encre & divers atelier' },
  { id: 'l-aug-1', shopId: 'lingwala', date: '01/08/2026', recettesFC: 210000, recettesUSD: 95, depensesFC: 15000, depensesUSD: 10, motifDepenses: 'Fournitures de rentrée' },
  { id: 'l-aug-2', shopId: 'lingwala', date: '02/08/2026', recettesFC: 0, recettesUSD: 0, depensesFC: 0, depensesUSD: 0, isRestDay: true, notes: 'Dimanche - Jour de repos' },
  { id: 'l-aug-3', shopId: 'lingwala', date: '03/08/2026', recettesFC: 310000, recettesUSD: 140, depensesFC: 25000, depensesUSD: 30, motifDepenses: 'Achat papier & carburant' },

  // LIMETE SHOP REPORTS
  { id: 'm-1', shopId: 'limete', date: '01/07/2026', recettesFC: 210000, recettesUSD: 45, depensesFC: 12000, depensesUSD: 15, motifDepenses: 'Achat rouleau bâche & transport' },
  { id: 'm-2', shopId: 'limete', date: '02/07/2026', recettesFC: 195000, recettesUSD: 80, depensesFC: 15000, depensesUSD: 0, motifDepenses: 'Carburant groupe Limete' },
  { id: 'm-3', shopId: 'limete', date: '03/07/2026', recettesFC: 320000, recettesUSD: 150, depensesFC: 25000, depensesUSD: 40, motifDepenses: 'Fourniture vinyle & solvant' },
  { id: 'm-4', shopId: 'limete', date: '04/07/2026', recettesFC: 140000, recettesUSD: 60, depensesFC: 10000, depensesUSD: 0, motifDepenses: 'Petits frais atelier Limete' },
  { id: 'm-5', shopId: 'limete', date: '05/07/2026', recettesFC: 0, recettesUSD: 0, depensesFC: 0, depensesUSD: 0, isRestDay: true, notes: 'Dimanche - Jour de repos' },
  { id: 'm-6', shopId: 'limete', date: '06/07/2026', recettesFC: 290000, recettesUSD: 110, depensesFC: 18000, depensesUSD: 25, motifDepenses: 'Frais électricité & coursier' },
  { id: 'm-7', shopId: 'limete', date: '07/07/2026', recettesFC: 240000, recettesUSD: 95, depensesFC: 20000, depensesUSD: 50, motifDepenses: 'Poudre DTF & Maintenance tête' },
  { id: 'm-8', shopId: 'limete', date: '08/07/2026', recettesFC: 180000, recettesUSD: 70, depensesFC: 12000, depensesUSD: 0, motifDepenses: 'Achat carburant atelier' },
  { id: 'm-9', shopId: 'limete', date: '09/07/2026', recettesFC: 310000, recettesUSD: 130, depensesFC: 30000, depensesUSD: 60, motifDepenses: 'Paiement sous-traitant découpe' },
  { id: 'm-10', shopId: 'limete', date: '10/07/2026', recettesFC: 275000, recettesUSD: 105, depensesFC: 14000, depensesUSD: 20, motifDepenses: 'Collation & fournitures bureau' },
  { id: 'm-11', shopId: 'limete', date: '11/07/2026', recettesFC: 200000, recettesUSD: 85, depensesFC: 10000, depensesUSD: 0, motifDepenses: 'Transport livraisons clients' },
  { id: 'm-12', shopId: 'limete', date: '12/07/2026', recettesFC: 0, recettesUSD: 0, depensesFC: 0, depensesUSD: 0, isRestDay: true, notes: 'Dimanche - Jour de repos' },
  { id: 'm-13', shopId: 'limete', date: '13/07/2026', recettesFC: 260000, recettesUSD: 120, depensesFC: 22000, depensesUSD: 35, motifDepenses: 'Achat encre Eco-Solvant' },
  { id: 'm-14', shopId: 'limete', date: '14/07/2026', recettesFC: 220000, recettesUSD: 90, depensesFC: 15000, depensesUSD: 0, motifDepenses: 'Entretien compresseur Limete' },
  { id: 'm-15', shopId: 'limete', date: '15/07/2026', recettesFC: 350000, recettesUSD: 210, depensesFC: 45000, depensesUSD: 120, motifDepenses: 'Remplacement carte mère traceur' },
  { id: 'm-16', shopId: 'limete', date: '16/07/2026', recettesFC: 190000, recettesUSD: 75, depensesFC: 8000, depensesUSD: 0, motifDepenses: 'Frais de transport' },
  { id: 'm-17', shopId: 'limete', date: '17/07/2026', recettesFC: 280000, recettesUSD: 140, depensesFC: 20000, depensesUSD: 40, motifDepenses: 'Consommables plastification' },
  { id: 'm-18', shopId: 'limete', date: '18/07/2026', recettesFC: 310000, recettesUSD: 160, depensesFC: 35000, depensesUSD: 50, motifDepenses: 'Achat rouleau bâche mat 50m' },
  { id: 'm-19', shopId: 'limete', date: '19/07/2026', recettesFC: 0, recettesUSD: 0, depensesFC: 0, depensesUSD: 0, isRestDay: true, notes: 'Dimanche - Jour de repos' },
  { id: 'm-20', shopId: 'limete', date: '20/07/2026', recettesFC: 245000, recettesUSD: 115, depensesFC: 16000, depensesUSD: 10, motifDepenses: 'Fournitures électriques' },
  { id: 'm-21', shopId: 'limete', date: '21/07/2026', recettesFC: 290000, recettesUSD: 130, depensesFC: 28000, depensesUSD: 75, motifDepenses: 'Maintenance traceur & Encre Cyan' },
  { id: 'm-22', shopId: 'limete', date: '22/07/2026', recettesFC: 230000, recettesUSD: 100, depensesFC: 15000, depensesUSD: 0, motifDepenses: 'Carburant livraison Limete' },
  { id: 'm-23', shopId: 'limete', date: '23/07/2026', recettesFC: 180000, recettesUSD: 65, depensesFC: 12000, depensesUSD: 30, motifDepenses: 'Achat accessoires de finition' },
  { id: 'm-24', shopId: 'limete', date: '24/07/2026', recettesFC: 340000, recettesUSD: 180, depensesFC: 30000, depensesUSD: 90, motifDepenses: 'Fourniture papier sublimation' },
  { id: 'm-25', shopId: 'limete', date: '25/07/2026', recettesFC: 390000, recettesUSD: 220, depensesFC: 40000, depensesUSD: 110, motifDepenses: 'Maintenance générale Limete' },
  { id: 'm-26', shopId: 'limete', date: '26/07/2026', recettesFC: 0, recettesUSD: 0, depensesFC: 0, depensesUSD: 0, isRestDay: true, notes: 'Dimanche - Jour de repos' },
  { id: 'm-27', shopId: 'limete', date: '27/07/2026', recettesFC: 310000, recettesUSD: 140, depensesFC: 20000, depensesUSD: 45, motifDepenses: 'Transport & manutention' },
  { id: 'm-28', shopId: 'limete', date: '28/07/2026', recettesFC: 420000, recettesUSD: 250, depensesFC: 50000, depensesUSD: 130, motifDepenses: 'Achat encre UV & Pièces' },
  { id: 'm-29', shopId: 'limete', date: '29/07/2026', recettesFC: 260000, recettesUSD: 110, depensesFC: 18000, depensesUSD: 20, motifDepenses: 'Carburant groupe Limete' },
  { id: 'm-30', shopId: 'limete', date: '30/07/2026', recettesFC: 295000, recettesUSD: 135, depensesFC: 22000, depensesUSD: 40, motifDepenses: 'Consommables atelier' },
  { id: 'm-31', shopId: 'limete', date: '31/07/2026', recettesFC: 280000, recettesUSD: 125, depensesFC: 25000, depensesUSD: 50, motifDepenses: 'Nettoyage & Clôture mensuelle Limete' },
  // LIMETE SHOP REPORTS - AOÛT 2026 (Rapport Financier Mensuel Limete Août 2026)
  { 
    id: 'm-aug-1', 
    shopId: 'limete', 
    date: '01/08/2026', 
    recettesFC: 55000, 
    recettesUSD: 45, 
    depensesFC: 10000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent',
    expenseItems: [
      { id: 'exp-m-aug-1', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  { 
    id: 'm-aug-2', 
    shopId: 'limete', 
    date: '02/08/2026', 
    recettesFC: 0, 
    recettesUSD: 0, 
    depensesFC: 0, 
    depensesUSD: 0, 
    isRestDay: true, 
    notes: 'Dimanche - Jour de repos' 
  },
  { 
    id: 'm-aug-3', 
    shopId: 'limete', 
    date: '03/08/2026', 
    recettesFC: 80000, 
    recettesUSD: 60, 
    depensesFC: 10000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent',
    expenseItems: [
      { id: 'exp-m-aug-3', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  { 
    id: 'm-aug-4', 
    shopId: 'limete', 
    date: '04/08/2026', 
    recettesFC: 90000, 
    recettesUSD: 85, 
    depensesFC: 20000, 
    depensesUSD: 50, 
    motifDepenses: 'Production Bache , Transport Agent, Reparation Courant, MBC Lingwala (Bache)',
    expenseItems: [
      { id: 'exp-m-aug-4a', motif: 'Production Bache', amountFC: 5000, amountUSD: 30, category: 'Production Bache' },
      { id: 'exp-m-aug-4b', motif: 'Transport Agent', amountFC: 15000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-aug-4c', motif: 'Reparation Courant', amountFC: 0, amountUSD: 10, category: 'Reparation Courant' },
      { id: 'exp-m-aug-4d', motif: 'MBC Lingwala (Bache)', amountFC: 0, amountUSD: 10, category: 'MBC Lingwala (Bache)' }
    ]
  },
  { 
    id: 'm-aug-5', 
    shopId: 'limete', 
    date: '05/08/2026', 
    recettesFC: 72500, 
    recettesUSD: 50, 
    depensesFC: 18000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent, Transport DTF',
    expenseItems: [
      { id: 'exp-m-aug-5a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-aug-5b', motif: 'Transport DTF', amountFC: 8000, amountUSD: 0, category: 'Transport DTF' }
    ]
  },
  { 
    id: 'm-aug-6', 
    shopId: 'limete', 
    date: '06/08/2026', 
    recettesFC: 58000, 
    recettesUSD: 35, 
    depensesFC: 12500, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent',
    expenseItems: [
      { id: 'exp-m-aug-6', motif: 'Transport agent', amountFC: 12500, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  { 
    id: 'm-aug-7', 
    shopId: 'limete', 
    date: '07/08/2026', 
    recettesFC: 79200, 
    recettesUSD: 65, 
    depensesFC: 21500, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent, Production Bache',
    expenseItems: [
      { id: 'exp-m-aug-7a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-aug-7b', motif: 'Production Bache', amountFC: 11500, amountUSD: 0, category: 'Production Bache' }
    ]
  },
  { 
    id: 'm-aug-8', 
    shopId: 'limete', 
    date: '08/08/2026', 
    recettesFC: 48000, 
    recettesUSD: 40, 
    depensesFC: 10000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent',
    expenseItems: [
      { id: 'exp-m-aug-8', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  { 
    id: 'm-aug-9', 
    shopId: 'limete', 
    date: '09/08/2026', 
    recettesFC: 0, 
    recettesUSD: 0, 
    depensesFC: 0, 
    depensesUSD: 0, 
    isRestDay: true, 
    notes: 'Dimanche - Jour de repos' 
  },
  { 
    id: 'm-aug-10', 
    shopId: 'limete', 
    date: '10/08/2026', 
    recettesFC: 85000, 
    recettesUSD: 75, 
    depensesFC: 23000, 
    depensesUSD: 40, 
    motifDepenses: 'Transport agent, Achat Papier coucher 200g',
    expenseItems: [
      { id: 'exp-m-aug-10a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-aug-10b', motif: 'Achat Papier coucher 200g', amountFC: 13000, amountUSD: 40, category: 'Achat Papier coucher 200g' }
    ]
  },
  { 
    id: 'm-aug-11', 
    shopId: 'limete', 
    date: '11/08/2026', 
    recettesFC: 62000, 
    recettesUSD: 35, 
    depensesFC: 10000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent',
    expenseItems: [
      { id: 'exp-m-aug-11', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  { 
    id: 'm-aug-12', 
    shopId: 'limete', 
    date: '12/08/2026', 
    recettesFC: 66000, 
    recettesUSD: 40, 
    depensesFC: 13499, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent, Achat papier colant',
    expenseItems: [
      { id: 'exp-m-aug-12a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-aug-12b', motif: 'Achat papier colant', amountFC: 3499, amountUSD: 0, category: 'Achat papier colant' }
    ]
  },
  { 
    id: 'm-aug-13', 
    shopId: 'limete', 
    date: '13/08/2026', 
    recettesFC: 62000, 
    recettesUSD: 30, 
    depensesFC: 10000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent',
    expenseItems: [
      { id: 'exp-m-aug-13', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  { 
    id: 'm-aug-14', 
    shopId: 'limete', 
    date: '14/08/2026', 
    recettesFC: 63000, 
    recettesUSD: 45, 
    depensesFC: 10000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent',
    expenseItems: [
      { id: 'exp-m-aug-14', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  { 
    id: 'm-aug-15', 
    shopId: 'limete', 
    date: '15/08/2026', 
    recettesFC: 0, 
    recettesUSD: 0, 
    depensesFC: 0, 
    depensesUSD: 0, 
    isRestDay: true, 
    notes: 'Assomption / Jour férié' 
  },
  { 
    id: 'm-aug-16', 
    shopId: 'limete', 
    date: '16/08/2026', 
    recettesFC: 0, 
    recettesUSD: 0, 
    depensesFC: 0, 
    depensesUSD: 0, 
    isRestDay: true, 
    notes: 'Dimanche - Jour de repos' 
  },
  { 
    id: 'm-aug-17', 
    shopId: 'limete', 
    date: '17/08/2026', 
    recettesFC: 58000, 
    recettesUSD: 35, 
    depensesFC: 10000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent',
    expenseItems: [
      { id: 'exp-m-aug-17', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  { 
    id: 'm-aug-18', 
    shopId: 'limete', 
    date: '18/08/2026', 
    recettesFC: 148000, 
    recettesUSD: 55, 
    depensesFC: 158497, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent, Production Gillet',
    expenseItems: [
      { id: 'exp-m-aug-18a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-aug-18b', motif: 'Production Gillet', amountFC: 148497, amountUSD: 0, category: 'Production Gillet' }
    ]
  },
  { 
    id: 'm-aug-19', 
    shopId: 'limete', 
    date: '19/08/2026', 
    recettesFC: 48000, 
    recettesUSD: 50, 
    depensesFC: 17000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent, Achat film emballage DGI',
    expenseItems: [
      { id: 'exp-m-aug-19a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-aug-19b', motif: 'Achat film emballage DGI', amountFC: 7000, amountUSD: 0, category: 'Achat film emballage DGI' }
    ]
  },
  { 
    id: 'm-aug-20', 
    shopId: 'limete', 
    date: '20/08/2026', 
    recettesFC: 55000, 
    recettesUSD: 45, 
    depensesFC: 10000, 
    depensesUSD: 0, 
    motifDepenses: 'Transport agent',
    notes: "Nous avons acheter 5 cartons de papier duplicateur qui n'est pas mentionner dans le logiciel donc 100$",
    expenseItems: [
      { id: 'exp-m-aug-20', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
];

export const INITIAL_EXPENSE_CATEGORIES: ExpenseCategoryItem[] = [
  // LINGWALA
  { id: 'cat-1', shopId: 'lingwala', rubrique: 'Achat toner', francs: 0, dollars: 420, description: 'Cartouches et poudres de toner' },
  { id: 'cat-2', shopId: 'lingwala', rubrique: 'Ingénieur', francs: 22000, dollars: 10, description: 'Interventions techniques & maintenance' },
  { id: 'cat-3', shopId: 'lingwala', rubrique: 'Consommables DTF', francs: 0, dollars: 310, description: 'Films, encres et poudre DTF' },
  { id: 'cat-4', shopId: 'lingwala', rubrique: 'Carburant', francs: 116000, dollars: 0, description: 'Essence/Gazole pour groupe & livraison' },
  { id: 'cat-5', shopId: 'lingwala', rubrique: 'Hiller', francs: 125000, dollars: 0, description: 'Frais opérationnels Hiller' },
  { id: 'cat-6', shopId: 'lingwala', rubrique: 'Réparation machine', francs: 0, dollars: 35, description: 'Pièces de rechange et réparation' },
  { id: 'cat-7', shopId: 'lingwala', rubrique: 'Autre', francs: 225000, dollars: 387.5, description: 'Dépenses diverses de fonctionnement' },

  // LIMETE (AOÛT 2026 - Tableau Détaillé des Dépenses par Rubrique)
  { id: 'cat-m-aug-1', shopId: 'limete', rubrique: 'Transport agent', francs: 167500, dollars: 0, description: 'Dépenses courantes' },
  { id: 'cat-m-aug-2', shopId: 'limete', rubrique: 'Achat film emballage DGI', francs: 7000, dollars: 0, description: 'Achat film emballage DGI' },
  { id: 'cat-m-aug-3', shopId: 'limete', rubrique: 'Production Gillet', francs: 148497, dollars: 0, description: 'Production Gillet' },
  { id: 'cat-m-aug-4', shopId: 'limete', rubrique: 'Achat papier colant', francs: 3499, dollars: 0, description: 'Achat papier colant' },
  { id: 'cat-m-aug-5', shopId: 'limete', rubrique: 'Achat Papier coucher 200g', francs: 13000, dollars: 40, description: 'Achat Papier coucher 200g' },
  { id: 'cat-m-aug-6', shopId: 'limete', rubrique: 'Production Bache', francs: 16500, dollars: 30, description: 'Production Bache' },
  { id: 'cat-m-aug-7', shopId: 'limete', rubrique: 'Transport DTF', francs: 8000, dollars: 0, description: 'Transport DTF' },
  { id: 'cat-m-aug-8', shopId: 'limete', rubrique: 'Reparation Courant', francs: 0, dollars: 10, description: 'Reparation Courant' },
  { id: 'cat-m-aug-9', shopId: 'limete', rubrique: 'MBC Lingwala (Bache)', francs: 0, dollars: 10, description: 'MBC Lingwala (Bache)' },
];

export const INITIAL_RECEIVABLES: ReceivableItem[] = [
  // LINGWALA
  {
    id: 'rec-1',
    shopId: 'lingwala',
    client: 'Imprimerie MBC Print 7ème rue',
    description: 'Impression DTF grand format',
    details: '40 A3 DTF imprimé et 34 mètre de DTF',
    amountUSD: 375,
    amountFC: 0,
    status: 'PENDING',
    includedInMainReceipts: false,
    date: '31/07/2026',
  },
  // LIMETE
  {
    id: 'rec-m1',
    shopId: 'limete',
    client: 'Agence Conseil Pub Limete',
    description: 'Bâches publicitaires 4x3m',
    details: '5 bâches grand format imprimées avec œillets',
    amountUSD: 420,
    amountFC: 150000,
    status: 'PENDING',
    includedInMainReceipts: false,
    date: '28/07/2026',
  },
];

export const INITIAL_CASH_ADJUSTMENTS: CashAdjustmentItem[] = [
  // LINGWALA
  {
    id: 'adj-1',
    shopId: 'lingwala',
    description: "Octroi pour achat de toner Canon à l'imprimerie 7ème rue",
    targetEntity: 'Imprimerie 7ème rue',
    amountUSD: 200,
    amountFC: 10000,
    type: 'ADVANCE',
    date: '25/07/2026',
    notes: 'Avance octroyée sur le fond de caisse pour fourniture toner Canon',
  },
  {
    id: 'adj-2',
    shopId: 'lingwala',
    description: "Paiement impression bâches pour MBC Print 7ème rue",
    targetEntity: 'Autre imprimerie (dette MBC 7ème rue)',
    amountUSD: 53,
    amountFC: 0,
    type: 'DEBT_SETTLEMENT',
    date: '28/07/2026',
    notes: 'Paiement effectué pour solder la dette de MBC Print 7ème rue auprès d\'une imprimerie tierce',
  },

  // LIMETE
  {
    id: 'adj-m1',
    shopId: 'limete',
    description: "Avance transport pour livraison urgente client Kingabwa",
    targetEntity: 'Chauffeur livraison Limete',
    amountUSD: 40,
    amountFC: 25000,
    type: 'ADVANCE',
    date: '20/07/2026',
    notes: 'Avance accordée pour acheminement commande',
  },
];

export const DEFAULT_EXCHANGE_RATE = 2850; // 1 USD = 2,850 FC
export const TARGET_PHYSICAL_CASH_FC = 3724650;

export const DEFAULT_SECURITY_POLICY = {
  strictLoginMode: false,
  requirePasswordOnDelete: true,
  autoLockMinutes: 0,
  restrictShopAccess: true, // Strict shop isolation with password access
};

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    formattedDate: '03/08/2026 08:00:00',
    userId: 'admin',
    userName: 'Direction Générale (Admin)',
    userRole: 'admin' as const,
    shopId: 'all' as const,
    actionCategory: 'LOGIN' as const,
    details: 'Initialisation du système de caisse et contrôle de sécurité.',
    ipAddress: '192.168.1.1 (Station Admin)',
  },
  {
    id: 'log-2',
    timestamp: new Date().toISOString(),
    formattedDate: '03/08/2026 08:15:00',
    userId: 'lingwala',
    userName: 'Gérant - Shop Lingwala',
    userRole: 'shop_manager' as const,
    shopId: 'lingwala' as const,
    actionCategory: 'DATA_CREATE' as const,
    details: 'Saisie du rapport journalier pour la caisse Lingwala.',
    ipAddress: '192.168.1.12 (Pos Lingwala)',
  },
];

export const INITIAL_STOCK_ITEMS = [
  // LINGWALA CONSUMABLES
  {
    id: 'st-l1',
    shopId: 'lingwala' as const,
    category: 'TONER' as const,
    name: 'Toner Canon Noir C-EXV 49',
    quantity: 1, // LOW STOCK ALERT
    unit: 'Cartouche',
    minQuantityThreshold: 2,
    lastRestockedDate: '23/07/2026',
    unitPriceUSD: 105,
    supplier: 'Fournisseur Hiller Kinshasa',
    notes: 'Toner principal pour presse numérique Canon',
  },
  {
    id: 'st-l2',
    shopId: 'lingwala' as const,
    category: 'TONER' as const,
    name: 'Toner Canon Cyan / Magenta / Jaune',
    quantity: 3,
    unit: 'Cartouche',
    minQuantityThreshold: 2,
    lastRestockedDate: '15/07/2026',
    unitPriceUSD: 110,
    supplier: 'Fournisseur Hiller Kinshasa',
  },
  {
    id: 'st-l3',
    shopId: 'lingwala' as const,
    category: 'POUDRE_FILM' as const,
    name: 'Film DTF A3 (Paquet de 100 feuilles)',
    quantity: 4,
    unit: 'Paquet',
    minQuantityThreshold: 3,
    lastRestockedDate: '27/07/2026',
    unitPriceUSD: 45,
    supplier: 'Import Textile Tech',
  },
  {
    id: 'st-l4',
    shopId: 'lingwala' as const,
    category: 'ENCRE_DTF' as const,
    name: 'Poudre DTF Blanche TPU 1Kg',
    quantity: 0, // OUT OF STOCK ALERT
    unit: 'Kg',
    minQuantityThreshold: 2,
    lastRestockedDate: '10/07/2026',
    unitPriceUSD: 25,
    supplier: 'Import Textile Tech',
    notes: '🚨 Urgent : Commander 5kg pour impressions maillots',
  },
  {
    id: 'st-l5',
    shopId: 'lingwala' as const,
    category: 'PAPIER' as const,
    name: 'Papier Couché A3 220g (Rames 250f)',
    quantity: 8,
    unit: 'Rame',
    minQuantityThreshold: 3,
    lastRestockedDate: '28/07/2026',
    unitPriceUSD: 18,
    supplier: 'Maison Papeterie Gombe',
  },

  // LIMETE CONSUMABLES
  {
    id: 'st-m1',
    shopId: 'limete' as const,
    category: 'BACHE_VINYLE' as const,
    name: 'Rouleau Bâche Mat 500g (3.2m x 50m)',
    quantity: 2,
    unit: 'Rouleau',
    minQuantityThreshold: 2,
    lastRestockedDate: '18/07/2026',
    unitPriceUSD: 160,
    supplier: 'Grand Dépôt Plastique Limete',
  },
  {
    id: 'st-m2',
    shopId: 'limete' as const,
    category: 'BACHE_VINYLE' as const,
    name: 'Vinyle Adhésif Blanc Brillant (1.27m x 50m)',
    quantity: 1, // LOW STOCK ALERT
    unit: 'Rouleau',
    minQuantityThreshold: 2,
    lastRestockedDate: '12/07/2026',
    unitPriceUSD: 85,
    supplier: 'Grand Dépôt Plastique Limete',
  },
  {
    id: 'st-m3',
    shopId: 'limete' as const,
    category: 'ENCRE_DTF' as const,
    name: 'Encre Eco-Solvant Cyan / Magenta 1L',
    quantity: 5,
    unit: 'Litre',
    minQuantityThreshold: 2,
    lastRestockedDate: '28/07/2026',
    unitPriceUSD: 35,
    supplier: 'Tech Print DRC',
  },
  {
    id: 'st-m4',
    shopId: 'limete' as const,
    category: 'AUTRE' as const,
    name: 'Boîte d\'Œillets Métalliques (1000 pcs)',
    quantity: 6,
    unit: 'Boîte',
    minQuantityThreshold: 2,
    lastRestockedDate: '20/07/2026',
    unitPriceUSD: 15,
  },
  {
    id: 'st-m5',
    shopId: 'limete' as const,
    category: 'PAPIER' as const,
    name: 'Papier Duplicateur (Cartons)',
    quantity: 5,
    unit: 'Carton',
    minQuantityThreshold: 2,
    lastRestockedDate: '20/08/2026',
    unitPriceUSD: 20,
    supplier: 'Fournisseur externe (100$)',
    notes: 'Achat de 5 cartons de papier duplicateur (100$) consigné en remarque du rapport financier Août 2026',
  },
];

export const INITIAL_NETWORK_NODES = [
  {
    id: 'node-lingwala',
    name: 'Imprimerie Lingwala (POS 01)',
    shopId: 'lingwala' as const,
    ipAddress: '192.168.1.12',
    status: 'ONLINE' as const,
    lastSyncTime: '03/08/2026 11:30:00',
    pendingChangesCount: 0,
  },
  {
    id: 'node-limete',
    name: 'Imprimerie Limete (POS 02)',
    shopId: 'limete' as const,
    ipAddress: '192.168.1.18',
    status: 'ONLINE' as const,
    lastSyncTime: '03/08/2026 11:28:15',
    pendingChangesCount: 1,
  },
  {
    id: 'node-admin',
    name: 'Direction Générale (Serveur Central)',
    shopId: 'admin' as const,
    ipAddress: '192.168.1.1',
    status: 'ONLINE' as const,
    lastSyncTime: '03/08/2026 11:30:00',
    pendingChangesCount: 0,
  },
];

export const DEFAULT_SUPABASE_CONFIG = {
  enabled: false,
  supabaseUrl: 'https://xyz-mbc-print.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  autoSyncOnConnection: true,
  lastCloudSyncTimestamp: '03/08/2026 09:15:00',
  syncStatus: 'IDLE' as const,
  queuedOperationsCount: 0,
};



