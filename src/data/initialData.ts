import { DailyReportItem, ExpenseCategoryItem, ReceivableItem, CashAdjustmentItem, UserAccount } from '../types';

export const USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'lingwala',
    username: 'lingwala',
    name: 'Gérant - Shop Lingwala',
    shopId: 'lingwala',
    shopName: 'Imprimerie Lingwala',
    role: 'shop_manager',
    password: 'Israel123',
  },
  {
    id: 'limete',
    username: 'limete',
    name: 'Gérant - Shop Limete',
    shopId: 'limete',
    shopName: 'Imprimerie Limete',
    role: 'shop_manager',
    password: 'Djive123',
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

  // LINGWALA SHOP REPORTS - SEPTEMBRE 2026 (Rapport Mensuel Complet Shop Lingwala Septembre 2026)
  {
    id: 'l-sep-1',
    shopId: 'lingwala',
    date: '01/09/2026',
    recettesFC: 220000,
    recettesUSD: 95,
    depensesFC: 20000,
    depensesUSD: 15,
    motifDepenses: 'Frais Hiller, Transport & coursier',
    incomeItems: [
      { id: 'inc-l-sep-1a', category: 'Impression et photocopie', motif: 'Impressions syllabus & polycopies rentrée', amountFC: 110000, amountUSD: 45 },
      { id: 'inc-l-sep-1b', category: 'DTF', motif: 'Flocage DTF polos scolaires', amountFC: 70000, amountUSD: 35 },
      { id: 'inc-l-sep-1c', category: 'Fourniture', motif: 'Rames papier duplicateur & papeterie', amountFC: 40000, amountUSD: 15 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-1a', motif: 'Frais Hiller', amountFC: 15000, amountUSD: 0, category: 'Hiller' },
      { id: 'exp-l-sep-1b', motif: 'Transport & coursier', amountFC: 5000, amountUSD: 15, category: 'Transport agent' }
    ]
  },
  {
    id: 'l-sep-2',
    shopId: 'lingwala',
    date: '02/09/2026',
    recettesFC: 185000,
    recettesUSD: 110,
    depensesFC: 15000,
    depensesUSD: 0,
    motifDepenses: 'Fournitures de bureau & papier',
    incomeItems: [
      { id: 'inc-l-sep-2a', category: 'Impression et photocopie', motif: 'Tirage dossiers & thèses universitaires', amountFC: 105000, amountUSD: 60 },
      { id: 'inc-l-sep-2b', category: 'DTF', motif: 'Transferts textile DTF t-shirts', amountFC: 55000, amountUSD: 35 },
      { id: 'inc-l-sep-2c', category: 'Autres', motif: 'Reliures spirale & plastification', amountFC: 25000, amountUSD: 15 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-2', motif: 'Fournitures de bureau & papier', amountFC: 15000, amountUSD: 0, category: 'Papier & fournitures' }
    ]
  },
  {
    id: 'l-sep-3',
    shopId: 'lingwala',
    date: '03/09/2026',
    recettesFC: 195000,
    recettesUSD: 130,
    depensesFC: 25000,
    depensesUSD: 30,
    motifDepenses: 'Carburant groupe Lingwala, Petit matériel',
    incomeItems: [
      { id: 'inc-l-sep-3a', category: 'DTF', motif: 'Impression bobine DTF 30 mètres', amountFC: 115000, amountUSD: 80 },
      { id: 'inc-l-sep-3b', category: 'Bâche', motif: 'Bâche événementielle 3x2m avec œillets', amountFC: 50000, amountUSD: 35 },
      { id: 'inc-l-sep-3c', category: 'Fourniture', motif: 'Enveloppes & papier bristol', amountFC: 30000, amountUSD: 15 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-3a', motif: 'Carburant groupe Lingwala', amountFC: 20000, amountUSD: 0, category: 'Carburant' },
      { id: 'exp-l-sep-3b', motif: 'Petit matériel atelier', amountFC: 5000, amountUSD: 30, category: 'Maintenance' }
    ]
  },
  {
    id: 'l-sep-4',
    shopId: 'lingwala',
    date: '04/09/2026',
    recettesFC: 260000,
    recettesUSD: 165,
    depensesFC: 30000,
    depensesUSD: 45,
    motifDepenses: 'Consommables DTF, Transport',
    incomeItems: [
      { id: 'inc-l-sep-4a', category: 'DTF', motif: 'Transferts DTF grande série entreprise', amountFC: 140000, amountUSD: 105 },
      { id: 'inc-l-sep-4b', category: 'Impression et photocopie', motif: 'Impression brochures couleur quadri', amountFC: 85000, amountUSD: 40 },
      { id: 'inc-l-sep-4c', category: 'Polo', motif: '12 Polos marqués avec logo', amountFC: 35000, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-4a', motif: 'Consommables DTF', amountFC: 20000, amountUSD: 45, category: 'Consommables DTF' },
      { id: 'exp-l-sep-4b', motif: 'Transport coursier', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'l-sep-5',
    shopId: 'lingwala',
    date: '05/09/2026',
    recettesFC: 140000,
    recettesUSD: 60,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Frais coursier & livraisons',
    incomeItems: [
      { id: 'inc-l-sep-5a', category: 'Impression et photocopie', motif: 'Photocopies A4 & scans haute définition', amountFC: 80000, amountUSD: 35 },
      { id: 'inc-l-sep-5b', category: 'Fourniture', motif: 'Chemises plastifiées & fardes', amountFC: 60000, amountUSD: 25 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-5', motif: 'Frais coursier & livraisons', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'l-sep-6',
    shopId: 'lingwala',
    date: '06/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Dimanche - Jour de repos'
  },
  {
    id: 'l-sep-7',
    shopId: 'lingwala',
    date: '07/09/2026',
    recettesFC: 245000,
    recettesUSD: 140,
    depensesFC: 22000,
    depensesUSD: 70,
    motifDepenses: 'Achat toner Canon, Frais Hiller',
    incomeItems: [
      { id: 'inc-l-sep-7a', category: 'Impression et photocopie', motif: 'Tirage cartes de visite & flyers', amountFC: 130000, amountUSD: 75 },
      { id: 'inc-l-sep-7b', category: 'DTF', motif: 'Impression textile DTF métrage', amountFC: 85000, amountUSD: 45 },
      { id: 'inc-l-sep-7c', category: 'Autres', motif: 'Infographie & PAO', amountFC: 30000, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-7a', motif: 'Frais Hiller', amountFC: 22000, amountUSD: 0, category: 'Hiller' },
      { id: 'exp-l-sep-7b', motif: 'Achat toner Canon', amountFC: 0, amountUSD: 70, category: 'Achat toner' }
    ]
  },
  {
    id: 'l-sep-8',
    shopId: 'lingwala',
    date: '08/09/2026',
    recettesFC: 175000,
    recettesUSD: 85,
    depensesFC: 18000,
    depensesUSD: 0,
    motifDepenses: 'Carburant groupe électrogène',
    incomeItems: [
      { id: 'inc-l-sep-8a', category: 'Impression et photocopie', motif: 'Copies & reliures comptables', amountFC: 95000, amountUSD: 50 },
      { id: 'inc-l-sep-8b', category: 'Fourniture', motif: 'Papeterie diverse & stylos', amountFC: 50000, amountUSD: 20 },
      { id: 'inc-l-sep-8c', category: 'Bâche', motif: 'Petite bâche banderole', amountFC: 30000, amountUSD: 15 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-8', motif: 'Carburant groupe électrogène', amountFC: 18000, amountUSD: 0, category: 'Carburant' }
    ]
  },
  {
    id: 'l-sep-9',
    shopId: 'lingwala',
    date: '09/09/2026',
    recettesFC: 210000,
    recettesUSD: 125,
    depensesFC: 20000,
    depensesUSD: 25,
    motifDepenses: 'Maintenance préventive & Ingénieur',
    incomeItems: [
      { id: 'inc-l-sep-9a', category: 'DTF', motif: '20 mètres DTF haute résolution', amountFC: 120000, amountUSD: 75 },
      { id: 'inc-l-sep-9b', category: 'Polo', motif: '18 Polos personnalisés entreprise', amountFC: 60000, amountUSD: 35 },
      { id: 'inc-l-sep-9c', category: 'Impression et photocopie', motif: 'Plastification affiches A3', amountFC: 30000, amountUSD: 15 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-9a', motif: 'Maintenance préventive Ingénieur', amountFC: 20000, amountUSD: 25, category: 'Ingénieur' }
    ]
  },
  {
    id: 'l-sep-10',
    shopId: 'lingwala',
    date: '10/09/2026',
    recettesFC: 165000,
    recettesUSD: 90,
    depensesFC: 12000,
    depensesUSD: 0,
    motifDepenses: 'Transport & collation atelier',
    incomeItems: [
      { id: 'inc-l-sep-10a', category: 'Impression et photocopie', motif: 'Tirage rapports administratifs', amountFC: 95000, amountUSD: 55 },
      { id: 'inc-l-sep-10b', category: 'Fourniture', motif: 'Rames papier & chemises cartonnées', amountFC: 45000, amountUSD: 20 },
      { id: 'inc-l-sep-10c', category: 'Autres', motif: 'Agrafage grand format & finitions', amountFC: 25000, amountUSD: 15 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-10', motif: 'Transport & collation atelier', amountFC: 12000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'l-sep-11',
    shopId: 'lingwala',
    date: '11/09/2026',
    recettesFC: 230000,
    recettesUSD: 150,
    depensesFC: 28000,
    depensesUSD: 40,
    motifDepenses: 'Consommables DTF & poudres',
    incomeItems: [
      { id: 'inc-l-sep-11a', category: 'DTF', motif: 'Impression DTF maillots clubs', amountFC: 130000, amountUSD: 90 },
      { id: 'inc-l-sep-11b', category: 'Impression et photocopie', motif: 'Brochures quadri papier couché', amountFC: 70000, amountUSD: 40 },
      { id: 'inc-l-sep-11c', category: 'Bâche', motif: 'Bâche roll-up aluminium', amountFC: 30000, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-11a', motif: 'Consommables DTF & poudres', amountFC: 20000, amountUSD: 40, category: 'Consommables DTF' },
      { id: 'exp-l-sep-11b', motif: 'Frais de coursier', amountFC: 8000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'l-sep-12',
    shopId: 'lingwala',
    date: '12/09/2026',
    recettesFC: 155000,
    recettesUSD: 75,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Frais coursier',
    incomeItems: [
      { id: 'inc-l-sep-12a', category: 'Impression et photocopie', motif: 'Photocopies grand volume & scans', amountFC: 90000, amountUSD: 45 },
      { id: 'inc-l-sep-12b', category: 'Fourniture', motif: 'Fournitures scolaires & papeterie', amountFC: 40000, amountUSD: 20 },
      { id: 'inc-l-sep-12c', category: 'Autres', motif: 'Plastification documents A4/A3', amountFC: 25000, amountUSD: 10 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-12', motif: 'Frais coursier', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'l-sep-13',
    shopId: 'lingwala',
    date: '13/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Dimanche - Jour de repos'
  },
  {
    id: 'l-sep-14',
    shopId: 'lingwala',
    date: '14/09/2026',
    recettesFC: 270000,
    recettesUSD: 180,
    depensesFC: 35000,
    depensesUSD: 50,
    motifDepenses: 'Frais Hiller, Carburant groupe',
    incomeItems: [
      { id: 'inc-l-sep-14a', category: 'DTF', motif: 'Impression bobine DTF 35m', amountFC: 150000, amountUSD: 110 },
      { id: 'inc-l-sep-14b', category: 'Polo', motif: '25 Polos personnalisés entreprise', amountFC: 80000, amountUSD: 50 },
      { id: 'inc-l-sep-14c', category: 'Impression et photocopie', motif: 'Tirage plans architecte A3', amountFC: 40000, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-14a', motif: 'Frais Hiller', amountFC: 20000, amountUSD: 0, category: 'Hiller' },
      { id: 'exp-l-sep-14b', motif: 'Carburant groupe', amountFC: 15000, amountUSD: 50, category: 'Carburant' }
    ]
  },
  {
    id: 'l-sep-15',
    shopId: 'lingwala',
    date: '15/09/2026',
    recettesFC: 190000,
    recettesUSD: 115,
    depensesFC: 16000,
    depensesUSD: 0,
    motifDepenses: 'Fournitures diverses atelier',
    incomeItems: [
      { id: 'inc-l-sep-15a', category: 'Impression et photocopie', motif: 'Tirages rapports de gestion', amountFC: 110000, amountUSD: 65 },
      { id: 'inc-l-sep-15b', category: 'Fourniture', motif: 'Pochettes plastiques & boîtes d\'archives', amountFC: 50000, amountUSD: 30 },
      { id: 'inc-l-sep-15c', category: 'Autres', motif: 'Reliures thermiques', amountFC: 30000, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-15', motif: 'Fournitures diverses atelier', amountFC: 16000, amountUSD: 0, category: 'Papier & fournitures' }
    ]
  },
  {
    id: 'l-sep-16',
    shopId: 'lingwala',
    date: '16/09/2026',
    recettesFC: 225000,
    recettesUSD: 135,
    depensesFC: 20000,
    depensesUSD: 30,
    motifDepenses: 'Intervention Ingénieur machine',
    incomeItems: [
      { id: 'inc-l-sep-16a', category: 'DTF', motif: 'Flocage DTF casquettes & tabliers', amountFC: 125000, amountUSD: 75 },
      { id: 'inc-l-sep-16b', category: 'Bâche', motif: 'Bâche enseigne 3x1.5m', amountFC: 60000, amountUSD: 40 },
      { id: 'inc-l-sep-16c', category: 'Impression et photocopie', motif: 'Photocopies A4 express', amountFC: 40000, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-16', motif: 'Intervention Ingénieur machine', amountFC: 20000, amountUSD: 30, category: 'Ingénieur' }
    ]
  },
  {
    id: 'l-sep-17',
    shopId: 'lingwala',
    date: '17/09/2026',
    recettesFC: 180000,
    recettesUSD: 95,
    depensesFC: 14000,
    depensesUSD: 0,
    motifDepenses: 'Carburant livraison',
    incomeItems: [
      { id: 'inc-l-sep-17a', category: 'Impression et photocopie', motif: 'Impression affiches A2 couleur', amountFC: 100000, amountUSD: 55 },
      { id: 'inc-l-sep-17b', category: 'Fourniture', motif: 'Rames papier & fardes à élastique', amountFC: 50000, amountUSD: 25 },
      { id: 'inc-l-sep-17c', category: 'Autres', motif: 'Découpe massicot & finitions', amountFC: 30000, amountUSD: 15 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-17', motif: 'Carburant livraison', amountFC: 14000, amountUSD: 0, category: 'Carburant' }
    ]
  },
  {
    id: 'l-sep-18',
    shopId: 'lingwala',
    date: '18/09/2026',
    recettesFC: 295000,
    recettesUSD: 190,
    depensesFC: 45000,
    depensesUSD: 65,
    motifDepenses: 'Achat toner Canon & Consommables DTF',
    incomeItems: [
      { id: 'inc-l-sep-18a', category: 'DTF', motif: 'Impression DTF grande commande événementielle', amountFC: 165000, amountUSD: 110 },
      { id: 'inc-l-sep-18b', category: 'Impression et photocopie', motif: 'Livrets d\'accueil 32 pages', amountFC: 80000, amountUSD: 50 },
      { id: 'inc-l-sep-18c', category: 'Polo', motif: '15 Polos marqués floqués', amountFC: 50000, amountUSD: 30 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-18a', motif: 'Consommables DTF', amountFC: 25000, amountUSD: 0, category: 'Consommables DTF' },
      { id: 'exp-l-sep-18b', motif: 'Achat toner Canon', amountFC: 20000, amountUSD: 65, category: 'Achat toner' }
    ]
  },
  {
    id: 'l-sep-19',
    shopId: 'lingwala',
    date: '19/09/2026',
    recettesFC: 130000,
    recettesUSD: 55,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-l-sep-19a', category: 'Impression et photocopie', motif: 'Copies & reliures pour étudiants', amountFC: 75000, amountUSD: 30 },
      { id: 'inc-l-sep-19b', category: 'Fourniture', motif: 'Fournitures de bureau express', amountFC: 35000, amountUSD: 15 },
      { id: 'inc-l-sep-19c', category: 'Autres', motif: 'Plastification permis & badges', amountFC: 20000, amountUSD: 10 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-19', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'l-sep-20',
    shopId: 'lingwala',
    date: '20/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Dimanche - Jour de repos'
  },
  {
    id: 'l-sep-21',
    shopId: 'lingwala',
    date: '21/09/2026',
    recettesFC: 240000,
    recettesUSD: 160,
    depensesFC: 25000,
    depensesUSD: 35,
    motifDepenses: 'Frais Hiller & Papier',
    incomeItems: [
      { id: 'inc-l-sep-21a', category: 'DTF', motif: '25 mètres DTF transfert', amountFC: 130000, amountUSD: 95 },
      { id: 'inc-l-sep-21b', category: 'Impression et photocopie', motif: 'Tirage brochures publicitaires', amountFC: 75000, amountUSD: 45 },
      { id: 'inc-l-sep-21c', category: 'Bâche', motif: 'Bâche 2x1m', amountFC: 35000, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-21a', motif: 'Frais Hiller', amountFC: 25000, amountUSD: 0, category: 'Hiller' },
      { id: 'exp-l-sep-21b', motif: 'Achat Papier duplicateur', amountFC: 0, amountUSD: 35, category: 'Papier & fournitures' }
    ]
  },
  {
    id: 'l-sep-22',
    shopId: 'lingwala',
    date: '22/09/2026',
    recettesFC: 185000,
    recettesUSD: 105,
    depensesFC: 15000,
    depensesUSD: 0,
    motifDepenses: 'Carburant groupe Lingwala',
    incomeItems: [
      { id: 'inc-l-sep-22a', category: 'Impression et photocopie', motif: 'Photocopies A4 & scans comptables', amountFC: 105000, amountUSD: 60 },
      { id: 'inc-l-sep-22b', category: 'Fourniture', motif: 'Rames papier & fardes', amountFC: 50000, amountUSD: 25 },
      { id: 'inc-l-sep-22c', category: 'Autres', motif: 'Mise en page graphique', amountFC: 30000, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-22', motif: 'Carburant groupe Lingwala', amountFC: 15000, amountUSD: 0, category: 'Carburant' }
    ]
  },
  {
    id: 'l-sep-23',
    shopId: 'lingwala',
    date: '23/09/2026',
    recettesFC: 215000,
    recettesUSD: 140,
    depensesFC: 20000,
    depensesUSD: 25,
    motifDepenses: 'Petit matériel & coursier',
    incomeItems: [
      { id: 'inc-l-sep-23a', category: 'Polo', motif: '20 Polos coton marqués recto/verso', amountFC: 110000, amountUSD: 70 },
      { id: 'inc-l-sep-23b', category: 'DTF', motif: 'Impression textile DTF', amountFC: 65000, amountUSD: 45 },
      { id: 'inc-l-sep-23c', category: 'Impression et photocopie', motif: 'Flyers couleur A5', amountFC: 40000, amountUSD: 25 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-23a', motif: 'Petit matériel atelier', amountFC: 10000, amountUSD: 25, category: 'Maintenance' },
      { id: 'exp-l-sep-23b', motif: 'Frais coursier', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'l-sep-24',
    shopId: 'lingwala',
    date: '24/09/2026',
    recettesFC: 170000,
    recettesUSD: 85,
    depensesFC: 12000,
    depensesUSD: 0,
    motifDepenses: 'Fournitures bureau',
    incomeItems: [
      { id: 'inc-l-sep-24a', category: 'Impression et photocopie', motif: 'Impressions mémoires & reliures', amountFC: 95000, amountUSD: 50 },
      { id: 'inc-l-sep-24b', category: 'Fourniture', motif: 'Fournitures de bureau & stylos', amountFC: 45000, amountUSD: 20 },
      { id: 'inc-l-sep-24c', category: 'Autres', motif: 'Plastification documents', amountFC: 30000, amountUSD: 15 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-24', motif: 'Fournitures bureau', amountFC: 12000, amountUSD: 0, category: 'Papier & fournitures' }
    ]
  },
  {
    id: 'l-sep-25',
    shopId: 'lingwala',
    date: '25/09/2026',
    recettesFC: 280000,
    recettesUSD: 175,
    depensesFC: 38000,
    depensesUSD: 55,
    motifDepenses: 'Consommables DTF & Réparation machine',
    incomeItems: [
      { id: 'inc-l-sep-25a', category: 'DTF', motif: 'Impression DTF grande série 30m', amountFC: 155000, amountUSD: 100 },
      { id: 'inc-l-sep-25b', category: 'Bâche', motif: 'Bâche grand format 4x2.5m', amountFC: 75000, amountUSD: 45 },
      { id: 'inc-l-sep-25c', category: 'Impression et photocopie', motif: 'Affiches quadri papier 200g', amountFC: 50000, amountUSD: 30 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-25a', motif: 'Consommables DTF', amountFC: 20000, amountUSD: 20, category: 'Consommables DTF' },
      { id: 'exp-l-sep-25b', motif: 'Réparation machine', amountFC: 18000, amountUSD: 35, category: 'Réparation machine' }
    ]
  },
  {
    id: 'l-sep-26',
    shopId: 'lingwala',
    date: '26/09/2026',
    recettesFC: 145000,
    recettesUSD: 70,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-l-sep-26a', category: 'Impression et photocopie', motif: 'Copies & reliures expresses', amountFC: 85000, amountUSD: 40 },
      { id: 'inc-l-sep-26b', category: 'Fourniture', motif: 'Papeterie & fardes', amountFC: 35000, amountUSD: 20 },
      { id: 'inc-l-sep-26c', category: 'Autres', motif: 'Plastification documents', amountFC: 25000, amountUSD: 10 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-26', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'l-sep-27',
    shopId: 'lingwala',
    date: '27/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Dimanche - Jour de repos'
  },
  {
    id: 'l-sep-28',
    shopId: 'lingwala',
    date: '28/09/2026',
    recettesFC: 260000,
    recettesUSD: 165,
    depensesFC: 30000,
    depensesUSD: 40,
    motifDepenses: 'Frais Hiller & Carburant',
    incomeItems: [
      { id: 'inc-l-sep-28a', category: 'DTF', motif: 'Bobine DTF 25m', amountFC: 140000, amountUSD: 95 },
      { id: 'inc-l-sep-28b', category: 'Polo', motif: '16 Polos floqués entreprise', amountFC: 70000, amountUSD: 45 },
      { id: 'inc-l-sep-28c', category: 'Impression et photocopie', motif: 'Tirage documents administratifs', amountFC: 50000, amountUSD: 25 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-28a', motif: 'Frais Hiller', amountFC: 15000, amountUSD: 0, category: 'Hiller' },
      { id: 'exp-l-sep-28b', motif: 'Carburant groupe', amountFC: 15000, amountUSD: 40, category: 'Carburant' }
    ]
  },
  {
    id: 'l-sep-29',
    shopId: 'lingwala',
    date: '29/09/2026',
    recettesFC: 195000,
    recettesUSD: 120,
    depensesFC: 15000,
    depensesUSD: 0,
    motifDepenses: 'Maintenance préventive atelier',
    incomeItems: [
      { id: 'inc-l-sep-29a', category: 'Impression et photocopie', motif: 'Impressions & scans haute résolution', amountFC: 110000, amountUSD: 65 },
      { id: 'inc-l-sep-29b', category: 'Fourniture', motif: 'Vente rames papier duplicateur', amountFC: 55000, amountUSD: 35 },
      { id: 'inc-l-sep-29c', category: 'Autres', motif: 'Infographie logo & mise en page', amountFC: 30000, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-29', motif: 'Maintenance préventive atelier', amountFC: 15000, amountUSD: 0, category: 'Maintenance' }
    ]
  },
  {
    id: 'l-sep-30',
    shopId: 'lingwala',
    date: '30/09/2026',
    recettesFC: 320000,
    recettesUSD: 210,
    depensesFC: 50000,
    depensesUSD: 60,
    motifDepenses: 'Clôture mensuelle, Achat toner & Collation',
    incomeItems: [
      { id: 'inc-l-sep-30a', category: 'Impression et photocopie', motif: 'Tirage rapports finaux & bilan', amountFC: 150000, amountUSD: 100 },
      { id: 'inc-l-sep-30b', category: 'DTF', motif: 'Flocage événementiel t-shirts fin de mois', amountFC: 110000, amountUSD: 70 },
      { id: 'inc-l-sep-30c', category: 'Fourniture', motif: 'Fournitures & papeterie diverses', amountFC: 60000, amountUSD: 40 }
    ],
    expenseItems: [
      { id: 'exp-l-sep-30a', motif: 'Achat toner', amountFC: 25000, amountUSD: 60, category: 'Achat toner' },
      { id: 'exp-l-sep-30b', motif: 'Clôture mensuelle & collation atelier', amountFC: 25000, amountUSD: 0, category: 'Frais généraux' }
    ]
  },

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
    incomeItems: [
      { id: 'inc-m-aug-1a', category: 'Impression et photocopie', motif: 'Impressions A4 & photocopies', amountFC: 30000, amountUSD: 15 },
      { id: 'inc-m-aug-1b', category: 'DTF', motif: 'Transferts textile DTF', amountFC: 25000, amountUSD: 30 }
    ],
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
    incomeItems: [
      { id: 'inc-m-aug-3a', category: 'Bâche', motif: 'Bâche 3x2m avec œillets', amountFC: 50000, amountUSD: 40 },
      { id: 'inc-m-aug-3b', category: 'Impression et photocopie', motif: 'Tirages plans & dossiers', amountFC: 30000, amountUSD: 20 }
    ],
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
    incomeItems: [
      { id: 'inc-m-aug-4a', category: 'Polo', motif: '20 polos personnalisés entreprise', amountFC: 40000, amountUSD: 45 },
      { id: 'inc-m-aug-4b', category: 'Bâche', motif: 'Vinyle grand format', amountFC: 30000, amountUSD: 25 },
      { id: 'inc-m-aug-4c', category: 'Fourniture', motif: '5 rames papier duplicateur', amountFC: 20000, amountUSD: 15 }
    ],
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
    incomeItems: [
      { id: 'inc-m-aug-5a', category: 'DTF', motif: 'Impression DTF métrage', amountFC: 45000, amountUSD: 35 },
      { id: 'inc-m-aug-5b', category: 'Autres', motif: 'Infographie & plastification', amountFC: 27500, amountUSD: 15 }
    ],
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
    incomeItems: [
      { id: 'inc-m-aug-6a', category: 'Impression et photocopie', motif: 'Tirages rapports de gestion', amountFC: 38000, amountUSD: 20 },
      { id: 'inc-m-aug-6b', category: 'Fourniture', motif: 'Papeterie diverse', amountFC: 20000, amountUSD: 15 }
    ],
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

  // LIMETE SHOP REPORTS - SEPTEMBRE 2026 (Rapport Officiel Conforme - Imprimerie Limete)
  // Période : Septembre 2026 | Taux : 1$ = 2300 FC
  // Recettes : 1 571 150 FC / $830 | Dépenses : 419 400 FC / $514 | Solde : 1 151 750 FC / $316
  {
    id: 'm-sep-01',
    shopId: 'limete',
    date: '01/09/2026',
    recettesFC: 57500,
    recettesUSD: 140,
    depensesFC: 10000,
    depensesUSD: 30,
    motifDepenses: 'Transport agent, Manzaka: Réparation de serrure porte devant',
    incomeItems: [
      { id: 'inc-m-sep-01a', category: 'Impression et photocopie', motif: 'Impressions & photocopies', amountFC: 57500, amountUSD: 40 },
      { id: 'inc-m-sep-01b', category: 'Bâche', motif: 'Production bâche', amountFC: 0, amountUSD: 100 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-01a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-01b', motif: 'Manzaka: Réparation de serrure porte devant', amountFC: 0, amountUSD: 30, category: 'Manzaka: Réparation de serrure porte devant' }
    ]
  },
  {
    id: 'm-sep-02',
    shopId: 'limete',
    date: '02/09/2026',
    recettesFC: 69000,
    recettesUSD: 0,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-02a', category: 'Impression et photocopie', motif: 'Tirages & impressions documents', amountFC: 69000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-02', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-03',
    shopId: 'limete',
    date: '03/09/2026',
    recettesFC: 225650,
    recettesUSD: 0,
    depensesFC: 85900,
    depensesUSD: 0,
    motifDepenses: 'Transport agent, Production bache',
    incomeItems: [
      { id: 'inc-m-sep-03a', category: 'Bâche', motif: 'Bâche grand format avec œillets', amountFC: 175650, amountUSD: 0 },
      { id: 'inc-m-sep-03b', category: 'Impression et photocopie', motif: 'Copies & impressions', amountFC: 50000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-03a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-03b', motif: 'Production bache', amountFC: 75900, amountUSD: 0, category: 'Production Bache' }
    ]
  },
  {
    id: 'm-sep-04',
    shopId: 'limete',
    date: '04/09/2026',
    recettesFC: 157000,
    recettesUSD: 0,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-04a', category: 'Bâche', motif: 'Bâche événementielle', amountFC: 107000, amountUSD: 0 },
      { id: 'inc-m-sep-04b', category: 'DTF', motif: 'Transfert DTF textile', amountFC: 50000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-04', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-05',
    shopId: 'limete',
    date: '05/09/2026',
    recettesFC: 69000,
    recettesUSD: 30,
    depensesFC: 65000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent, Production des chèques 2 pcs, Achat torche',
    incomeItems: [
      { id: 'inc-m-sep-05a', category: 'Impression et photocopie', motif: 'Impressions diverses', amountFC: 69000, amountUSD: 0 },
      { id: 'inc-m-sep-05b', category: 'Polo', motif: 'Polos imprimés', amountFC: 0, amountUSD: 30 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-05a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-05b', motif: 'Production des chèques 2 pcs', amountFC: 37000, amountUSD: 0, category: 'Production des chèques 2 pcs' },
      { id: 'exp-m-sep-05c', motif: 'Achat torche', amountFC: 18000, amountUSD: 0, category: 'Achat torche' }
    ]
  },
  {
    id: 'm-sep-06',
    shopId: 'limete',
    date: '06/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Dimanche - Jour de repos'
  },
  {
    id: 'm-sep-07',
    shopId: 'limete',
    date: '07/09/2026',
    recettesFC: 92000,
    recettesUSD: 0,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-07a', category: 'Impression et photocopie', motif: 'Photocopies & tirage dossiers', amountFC: 92000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-07', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-08',
    shopId: 'limete',
    date: '08/09/2026',
    recettesFC: 80500,
    recettesUSD: 0,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-08a', category: 'Impression et photocopie', motif: 'Tirages plans & copies', amountFC: 80500, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-08', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-09',
    shopId: 'limete',
    date: '09/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Pas d\'activité ce jour'
  },
  {
    id: 'm-sep-10',
    shopId: 'limete',
    date: '10/09/2026',
    recettesFC: 46000,
    recettesUSD: 30,
    depensesFC: 18000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent, Transport Vareuse ecole',
    incomeItems: [
      { id: 'inc-m-sep-10a', category: 'Polo', motif: 'Vareuses école & polos', amountFC: 26000, amountUSD: 30 },
      { id: 'inc-m-sep-10b', category: 'Impression et photocopie', motif: 'Documents scolaires', amountFC: 20000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-10a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-10b', motif: 'Transport Vareuse ecole', amountFC: 8000, amountUSD: 0, category: 'Transport Vareuse ecole' }
    ]
  },
  {
    id: 'm-sep-11',
    shopId: 'limete',
    date: '11/09/2026',
    recettesFC: 80500,
    recettesUSD: 0,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-11a', category: 'Impression et photocopie', motif: 'Tirages couleur & copies', amountFC: 80500, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-11', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-12',
    shopId: 'limete',
    date: '12/09/2026',
    recettesFC: 69000,
    recettesUSD: 0,
    depensesFC: 5000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-12a', category: 'Impression et photocopie', motif: 'Copies & reliures', amountFC: 69000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-12', motif: 'Transport agent', amountFC: 5000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-13',
    shopId: 'limete',
    date: '13/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Dimanche - Jour de repos'
  },
  {
    id: 'm-sep-14',
    shopId: 'limete',
    date: '14/09/2026',
    recettesFC: 92000,
    recettesUSD: 0,
    depensesFC: 17000,
    depensesUSD: 18,
    motifDepenses: 'Transport agent, Achat papier copiant pour MBC Lingwala',
    incomeItems: [
      { id: 'inc-m-sep-14a', category: 'Fourniture', motif: 'Papeterie & papier copiant', amountFC: 92000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-14a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-14b', motif: 'Achat papier copiant pour MBC Lingwala', amountFC: 7000, amountUSD: 18, category: 'Achat papier copiant pour MBC Lingwala' }
    ]
  },
  {
    id: 'm-sep-15',
    shopId: 'limete',
    date: '15/09/2026',
    recettesFC: 80500,
    recettesUSD: 0,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-15a', category: 'Impression et photocopie', motif: 'Impressions & scans', amountFC: 80500, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-15', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-16',
    shopId: 'limete',
    date: '16/09/2026',
    recettesFC: 34500,
    recettesUSD: 50,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-16a', category: 'DTF', motif: 'Transfert DTF', amountFC: 14500, amountUSD: 50 },
      { id: 'inc-m-sep-16b', category: 'Impression et photocopie', motif: 'Copies A4', amountFC: 20000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-16', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-17',
    shopId: 'limete',
    date: '17/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Pas d\'activité ce jour'
  },
  {
    id: 'm-sep-18',
    shopId: 'limete',
    date: '18/09/2026',
    recettesFC: 80500,
    recettesUSD: 0,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-18a', category: 'Impression et photocopie', motif: 'Tirage brochures', amountFC: 80500, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-18', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-19',
    shopId: 'limete',
    date: '19/09/2026',
    recettesFC: 69000,
    recettesUSD: 0,
    depensesFC: 30000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent, reparation courant manzaka',
    incomeItems: [
      { id: 'inc-m-sep-19a', category: 'Impression et photocopie', motif: 'Impressions diverses', amountFC: 69000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-19a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-19b', motif: 'reparation courant manzaka', amountFC: 20000, amountUSD: 0, category: 'reparation courant manzaka' }
    ]
  },
  {
    id: 'm-sep-20',
    shopId: 'limete',
    date: '20/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Dimanche - Jour de repos'
  },
  {
    id: 'm-sep-21',
    shopId: 'limete',
    date: '21/09/2026',
    recettesFC: 46000,
    recettesUSD: 20,
    depensesFC: 10000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent',
    incomeItems: [
      { id: 'inc-m-sep-21a', category: 'Impression et photocopie', motif: 'Impressions & scans', amountFC: 46000, amountUSD: 0 },
      { id: 'inc-m-sep-21b', category: 'Polo', motif: 'Polos entreprise', amountFC: 0, amountUSD: 20 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-21', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' }
    ]
  },
  {
    id: 'm-sep-22',
    shopId: 'limete',
    date: '22/09/2026',
    recettesFC: 69000,
    recettesUSD: 0,
    depensesFC: 18000,
    depensesUSD: 94,
    motifDepenses: 'Transport agent, Transport vareuse pour ecole, Réparation courant snel',
    incomeItems: [
      { id: 'inc-m-sep-22a', category: 'Impression et photocopie', motif: 'Copies & reliures', amountFC: 69000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-22a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-22b', motif: 'Transport vareuse pour ecole', amountFC: 8000, amountUSD: 0, category: 'Transport vareuse pour ecole' },
      { id: 'exp-m-sep-22c', motif: 'Réparation courant snel', amountFC: 0, amountUSD: 94, category: 'Réparation courant snel' }
    ]
  },
  {
    id: 'm-sep-23',
    shopId: 'limete',
    date: '23/09/2026',
    recettesFC: 46000,
    recettesUSD: 0,
    depensesFC: 13500,
    depensesUSD: 25,
    motifDepenses: 'Transport agent, Forfait internet , Réparation Connexion internet',
    incomeItems: [
      { id: 'inc-m-sep-23a', category: 'Impression et photocopie', motif: 'Impressions & tirages', amountFC: 46000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-23a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-23b', motif: 'Forfait internet', amountFC: 3500, amountUSD: 0, category: 'Forfait internet' },
      { id: 'exp-m-sep-23c', motif: 'Réparation Connexion internet', amountFC: 0, amountUSD: 25, category: 'Réparation Connexion internet' }
    ]
  },
  {
    id: 'm-sep-24',
    shopId: 'limete',
    date: '24/09/2026',
    recettesFC: 0,
    recettesUSD: 460,
    depensesFC: 10000,
    depensesUSD: 347,
    motifDepenses: 'Transport agent, Assistance a Rigaine, Achat routeur , Installation Manzaka',
    incomeItems: [
      { id: 'inc-m-sep-24a', category: 'Bâche', motif: 'Grand contrat bâches & enseignes (Record du mois)', amountFC: 0, amountUSD: 460 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-24a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-24b', motif: 'Assistance a Rigaine', amountFC: 0, amountUSD: 40, category: 'Assistance a Rigaine' },
      { id: 'exp-m-sep-24c', motif: 'Achat routeur', amountFC: 0, amountUSD: 75, category: 'Achat routeur' },
      { id: 'exp-m-sep-24d', motif: 'Installation Manzaka', amountFC: 0, amountUSD: 232, category: 'Installation Manzaka' }
    ]
  },
  {
    id: 'm-sep-25',
    shopId: 'limete',
    date: '25/09/2026',
    recettesFC: 51500,
    recettesUSD: 100,
    depensesFC: 32000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent, Bache production',
    incomeItems: [
      { id: 'inc-m-sep-25a', category: 'Bâche', motif: 'Bâches publicitaires', amountFC: 21500, amountUSD: 100 },
      { id: 'inc-m-sep-25b', category: 'Impression et photocopie', motif: 'Copies & impressions', amountFC: 30000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-25a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-25b', motif: 'Bache production', amountFC: 22000, amountUSD: 0, category: 'Bache production' }
    ]
  },
  {
    id: 'm-sep-26',
    shopId: 'limete',
    date: '26/09/2026',
    recettesFC: 56000,
    recettesUSD: 0,
    depensesFC: 15000,
    depensesUSD: 0,
    motifDepenses: 'Transport agent, Transport agent Connexion',
    incomeItems: [
      { id: 'inc-m-sep-26a', category: 'Impression et photocopie', motif: 'Tirages finaux & reliures', amountFC: 56000, amountUSD: 0 }
    ],
    expenseItems: [
      { id: 'exp-m-sep-26a', motif: 'Transport agent', amountFC: 10000, amountUSD: 0, category: 'Transport agent' },
      { id: 'exp-m-sep-26b', motif: 'Transport agent Connexion', amountFC: 5000, amountUSD: 0, category: 'Transport agent Connexion' }
    ]
  },
  {
    id: 'm-sep-27',
    shopId: 'limete',
    date: '27/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Dimanche - Jour de repos'
  },
  {
    id: 'm-sep-28',
    shopId: 'limete',
    date: '28/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Fin de période'
  },
  {
    id: 'm-sep-29',
    shopId: 'limete',
    date: '29/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Fin de période'
  },
  {
    id: 'm-sep-30',
    shopId: 'limete',
    date: '30/09/2026',
    recettesFC: 0,
    recettesUSD: 0,
    depensesFC: 0,
    depensesUSD: 0,
    isRestDay: true,
    notes: 'Clôture mensuelle Septembre 2026'
  },
];

export const INITIAL_EXPENSE_CATEGORIES: ExpenseCategoryItem[] = [
  // LINGWALA (JUILLET 2026)
  { id: 'cat-1', shopId: 'lingwala', rubrique: 'Achat toner', francs: 0, dollars: 420, description: 'Cartouches et poudres de toner' },
  { id: 'cat-2', shopId: 'lingwala', rubrique: 'Ingénieur', francs: 22000, dollars: 10, description: 'Interventions techniques & maintenance' },
  { id: 'cat-3', shopId: 'lingwala', rubrique: 'Consommables DTF', francs: 0, dollars: 310, description: 'Films, encres et poudre DTF' },
  { id: 'cat-4', shopId: 'lingwala', rubrique: 'Carburant', francs: 116000, dollars: 0, description: 'Essence/Gazole pour groupe & livraison' },
  { id: 'cat-5', shopId: 'lingwala', rubrique: 'Hiller', francs: 125000, dollars: 0, description: 'Frais opérationnels Hiller' },
  { id: 'cat-6', shopId: 'lingwala', rubrique: 'Réparation machine', francs: 0, dollars: 35, description: 'Pièces de rechange et réparation' },
  { id: 'cat-7', shopId: 'lingwala', rubrique: 'Autre', francs: 225000, dollars: 387.5, description: 'Dépenses diverses de fonctionnement' },

  // LINGWALA (SEPTEMBRE 2026 - Tableau Détaillé des Dépenses par Rubrique)
  { id: 'cat-l-sep-1', shopId: 'lingwala', rubrique: 'Hiller', francs: 112000, dollars: 0, description: 'Frais opérationnels Hiller Lingwala' },
  { id: 'cat-l-sep-2', shopId: 'lingwala', rubrique: 'Achat toner', francs: 45000, dollars: 195, description: 'Cartouches et toner Canon quadri' },
  { id: 'cat-l-sep-3', shopId: 'lingwala', rubrique: 'Consommables DTF', francs: 85000, dollars: 105, description: 'Films, encres et poudres thermofusibles DTF' },
  { id: 'cat-l-sep-4', shopId: 'lingwala', rubrique: 'Carburant', francs: 117000, dollars: 90, description: 'Carburant groupe électrogène & livraison' },
  { id: 'cat-l-sep-5', shopId: 'lingwala', rubrique: 'Ingénieur', francs: 58000, dollars: 90, description: 'Maintenance préventive & interventions ingénieur' },
  { id: 'cat-l-sep-6', shopId: 'lingwala', rubrique: 'Fournitures & Papier', francs: 43000, dollars: 35, description: 'Papier duplicateur, bristol & papeterie' },
  { id: 'cat-l-sep-7', shopId: 'lingwala', rubrique: 'Transport agent', francs: 80000, dollars: 15, description: 'Frais de transport coursier & livraisons' },
  { id: 'cat-l-sep-8', shopId: 'lingwala', rubrique: 'Clôture & Frais généraux', francs: 25000, dollars: 0, description: 'Collation atelier & clôture mensuelle' },

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

  // LIMETE (SEPTEMBRE 2026 - Tableau Détaillé des Dépenses par Rubrique)
  { id: 'cat-m-sep-1', shopId: 'limete', rubrique: 'Transport agent', francs: 210000, dollars: 0, description: 'Dépenses courantes' },
  { id: 'cat-m-sep-2', shopId: 'limete', rubrique: 'Production Bache', francs: 75900, dollars: 0, description: 'Production Bache' },
  { id: 'cat-m-sep-3', shopId: 'limete', rubrique: 'Transport agent Connexion', francs: 10000, dollars: 0, description: 'Transport agent Connexion' },
  { id: 'cat-m-sep-4', shopId: 'limete', rubrique: 'Bache production', francs: 22000, dollars: 0, description: 'Bache production' },
  { id: 'cat-m-sep-5', shopId: 'limete', rubrique: 'Assistance a Rigaine', francs: 0, dollars: 40, description: 'Assistance a Rigaine' },
  { id: 'cat-m-sep-6', shopId: 'limete', rubrique: 'Achat routeur', francs: 0, dollars: 75, description: 'Achat routeur' },
  { id: 'cat-m-sep-7', shopId: 'limete', rubrique: 'Installation Manzaka', francs: 0, dollars: 232, description: 'Installation Manzaka' },
  { id: 'cat-m-sep-8', shopId: 'limete', rubrique: 'Forfait internet', francs: 3500, dollars: 0, description: 'Forfait internet' },
  { id: 'cat-m-sep-9', shopId: 'limete', rubrique: 'Réparation Connexion internet', francs: 0, dollars: 25, description: 'Réparation Connexion internet' },
  { id: 'cat-m-sep-10', shopId: 'limete', rubrique: 'Transport vareuse pour ecole', francs: 8000, dollars: 0, description: 'Transport vareuse pour ecole' },
  { id: 'cat-m-sep-11', shopId: 'limete', rubrique: 'Réparation courant snel', francs: 0, dollars: 94, description: 'Réparation courant snel' },
  { id: 'cat-m-sep-12', shopId: 'limete', rubrique: 'reparation courant manzaka', francs: 20000, dollars: 0, description: 'reparation courant manzaka' },
  { id: 'cat-m-sep-13', shopId: 'limete', rubrique: 'Achat papier copiant pour MBC Lingwala', francs: 7000, dollars: 18, description: 'Achat papier copiant pour MBC Lingwala' },
  { id: 'cat-m-sep-14', shopId: 'limete', rubrique: 'Transport Vareuse ecole', francs: 8000, dollars: 0, description: 'Transport Vareuse ecole' },
  { id: 'cat-m-sep-15', shopId: 'limete', rubrique: 'Production des chèques 2 pcs', francs: 37000, dollars: 0, description: 'Production des chèques 2 pcs' },
  { id: 'cat-m-sep-16', shopId: 'limete', rubrique: 'Achat torche', francs: 18000, dollars: 0, description: 'Achat torche' },
  { id: 'cat-m-sep-17', shopId: 'limete', rubrique: 'Manzaka: Réparation de serrure porte devant', francs: 0, dollars: 30, description: 'Manzaka: Réparation de serrure porte devant' },
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

export const DEFAULT_EXCHANGE_RATE = 2300; // 1 USD = 2,300 FC (Taux officiel appliqué Septembre 2026)
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



