import React, { useMemo, useState } from 'react';
import { DailyReportItem, ExpenseCategoryItem, ReceivableItem, CashAdjustmentItem, ShopId } from '../types';
import { formatFC, formatUSD } from '../utils/formatters';
import { formatMonthLabel, parseMonthKey, getDateRangeLabel } from '../utils/monthUtils';
import { Calendar, Printer, X, Download, MessageSquare, FileText } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';

interface PrintReportViewProps {
  reports: DailyReportItem[];
  categories: ExpenseCategoryItem[];
  receivables: ReceivableItem[];
  adjustments: CashAdjustmentItem[];
  activeShopId: ShopId | 'all';
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
  availableMonths?: string[];
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (start: string, end: string) => void;
  onClearDateRange?: () => void;
  onClose: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  reports,
  categories,
  receivables,
  adjustments,
  activeShopId,
  selectedMonth = '07/2026',
  onMonthChange,
  availableMonths = ['07/2026', '08/2026'],
  startDate = '',
  endDate = '',
  onDateRangeChange,
  onClearDateRange,
  onClose,
}) => {
  const [reportComments, setReportComments] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`mbc_report_comment_${selectedMonth}_${activeShopId}`);
      if (saved !== null) return saved;
    } catch {}
    if (selectedMonth === '08/2026' && (activeShopId === 'limete' || activeShopId === 'all')) {
      return "Nous avons acheter 5 cartons de papier duplicateur qui n'est pas mentionner dans le logiciel donc 100$";
    }
    return '';
  });

  // Sync comment when month or active shop changes
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(`mbc_report_comment_${selectedMonth}_${activeShopId}`);
      if (saved !== null) {
        setReportComments(saved);
        return;
      }
    } catch {}
    if (selectedMonth === '08/2026' && (activeShopId === 'limete' || activeShopId === 'all')) {
      setReportComments("Nous avons acheter 5 cartons de papier duplicateur qui n'est pas mentionner dans le logiciel donc 100$");
    } else {
      setReportComments('');
    }
  }, [selectedMonth, activeShopId]);

  // Persist comment changes to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem(`mbc_report_comment_${selectedMonth}_${activeShopId}`, reportComments);
    } catch {}
  }, [reportComments, selectedMonth, activeShopId]);
  const periodLabel = getDateRangeLabel(startDate, endDate, selectedMonth);
  const sumRecettesFC = reports.reduce((acc, r) => acc + r.recettesFC, 0);
  const sumRecettesUSD = reports.reduce((acc, r) => acc + r.recettesUSD, 0);
  const sumDepensesFC = reports.reduce((acc, r) => acc + r.depensesFC, 0);
  const sumDepensesUSD = reports.reduce((acc, r) => acc + r.depensesUSD, 0);

  const soldeFC = sumRecettesFC - sumDepensesFC;
  const soldeUSD = sumRecettesUSD - sumDepensesUSD;

  // Filter receivables and adjustments for selected month
  const monthReceivables = useMemo(() => {
    if (!selectedMonth || selectedMonth === 'all') return receivables;
    return receivables.filter((r) => parseMonthKey(r.date || '01/07/2026') === selectedMonth);
  }, [receivables, selectedMonth]);

  const monthAdjustments = useMemo(() => {
    if (!selectedMonth || selectedMonth === 'all') return adjustments;
    return adjustments.filter((a) => parseMonthKey(a.date || '01/07/2026') === selectedMonth);
  }, [adjustments, selectedMonth]);

  // Dynamic Category Breakdown for Section 2 according to selected month
  const monthCategories = useMemo(() => {
    const categoryTotals = new Map<string, { rubrique: string; description: string; francs: number; dollars: number }>();

    // Seed map with shop categories so existing rubrique names match
    categories.forEach((cat) => {
      categoryTotals.set(cat.rubrique.toLowerCase(), {
        rubrique: cat.rubrique,
        description: cat.description || '',
        francs: 0,
        dollars: 0,
      });
    });

    reports.forEach((report) => {
      if (report.expenseItems && report.expenseItems.length > 0) {
        report.expenseItems.forEach((item) => {
          if ((item.amountFC || 0) > 0 || (item.amountUSD || 0) > 0) {
            const key = (item.category || item.motif || 'Autre').toLowerCase();
            const existing = categoryTotals.get(key);
            if (existing) {
              existing.francs += item.amountFC || 0;
              existing.dollars += item.amountUSD || 0;
            } else {
              categoryTotals.set(key, {
                rubrique: item.category || item.motif || 'Autre',
                description: item.motif || 'Dépense journalière',
                francs: item.amountFC || 0,
                dollars: item.amountUSD || 0,
              });
            }
          }
        });
      } else if ((report.depensesFC || 0) > 0 || (report.depensesUSD || 0) > 0) {
        const motifKey = (report.motifDepenses || 'Dépenses journalières').toLowerCase();
        let matchedKey = '';
        for (const [k] of categoryTotals.entries()) {
          if (motifKey.includes(k) || k.includes(motifKey)) {
            matchedKey = k;
            break;
          }
        }

        if (matchedKey) {
          const existing = categoryTotals.get(matchedKey)!;
          existing.francs += report.depensesFC || 0;
          existing.dollars += report.depensesUSD || 0;
        } else {
          categoryTotals.set(motifKey, {
            rubrique: report.motifDepenses || 'Dépenses journalières',
            description: 'Dépenses courantes',
            francs: report.depensesFC || 0,
            dollars: report.depensesUSD || 0,
          });
        }
      }
    });

    // Baseline fallback for July 2026 default dataset if no itemized breakdown is recorded yet
    if (selectedMonth === '07/2026' || !selectedMonth || selectedMonth === 'all') {
      const sumCatFC = categories.reduce((s, c) => s + c.francs, 0);
      const sumCatUSD = categories.reduce((s, c) => s + c.dollars, 0);
      if (sumCatFC > 0 || sumCatUSD > 0) {
        categories.forEach((c) => {
          const key = c.rubrique.toLowerCase();
          const existing = categoryTotals.get(key);
          if (existing && existing.francs === 0 && existing.dollars === 0) {
            existing.francs = c.francs;
            existing.dollars = c.dollars;
          }
        });
      }
    }

    // Filter out categories with 0 FC and 0 USD for the selected month
    return Array.from(categoryTotals.values()).filter((c) => c.francs > 0 || c.dollars > 0);
  }, [reports, categories, selectedMonth]);

  const totalMonthCatFC = monthCategories.reduce((sum, c) => sum + c.francs, 0);
  const totalMonthCatUSD = monthCategories.reduce((sum, c) => sum + c.dollars, 0);

  // Total cash adjustments amounts for net calculations
  const totalAdjFC = monthAdjustments.reduce((sum, a) => sum + a.amountFC, 0);
  const totalAdjUSD = monthAdjustments.reduce((sum, a) => sum + a.amountUSD, 0);

  const netAvailableFC = soldeFC - totalAdjFC;
  const netAvailableUSD = soldeUSD - totalAdjUSD;

  const shopTitle = 
    activeShopId === 'lingwala' ? 'IMPRIMERIE DE LINGWALA' :
    activeShopId === 'limete' ? 'IMPRIMERIE DE LIMETE' :
    'RAPPORT CONSOLIDÉ (LINGWALA & LIMETE)';

  const handleOpenPrintPopup = () => {
    const reportElement = document.getElementById('printable-report-content');
    if (!reportElement) return;

    const popup = window.open('', '_blank', 'width=950,height=900,scrollbars=yes');
    if (!popup) {
      alert("Le navigateur a bloqué la fenêtre pop-up d'impression. Veuillez autoriser les fenêtres surgissantes (pop-ups).");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="utf-8">
          <title>Rapport Imprimerie MBC Print - ${formatMonthLabel(selectedMonth)}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              @page { size: A4 portrait; margin: 12mm 10mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .print\\:hidden { display: none !important; }
            }
            body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background: #ffffff; color: #0f172a; padding: 24px; }
          </style>
        </head>
        <body>
          <div style="max-width: 900px; margin: 0 auto;">
            ${reportElement.innerHTML}
          </div>
          <div class="print:hidden" style="margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            <button onclick="window.print()" style="background: linear-gradient(to right, #059669, #0d9488); color: white; font-weight: bold; padding: 12px 24px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
              🖨️ Lancer l'Impression / Sauvegarder en PDF
            </button>
            <button onclick="window.close()" style="background: #475569; color: white; font-weight: 600; padding: 12px 18px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; margin-left: 12px;">
              Fermer la fenêtre
            </button>
          </div>
          <script>
            setTimeout(() => {
              window.print();
            }, 600);
          </script>
        </body>
      </html>
    `;

    popup.document.open();
    popup.document.write(htmlContent);
    popup.document.close();
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn("Standard print failed, launching fallback popup:", err);
      handleOpenPrintPopup();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto p-8 font-sans text-slate-900 print:p-0 print-modal-container">
      
      {/* Floating Toolbar (Hidden when printing) */}
      <div className="print:hidden max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center bg-slate-900 text-white p-4 rounded-xl shadow-lg gap-4">
        <div>
          <h2 className="font-bold text-base">Aperçu Avant Impression - {shopTitle}</h2>
          <p className="text-xs text-slate-300">Formaté pour impression officielle A4 & Export PDF</p>
        </div>

        <div className="flex flex-wrap items-center space-x-2.5">
          {/* Month Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-white">
            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Mois :</span>
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange && onMonthChange(e.target.value)}
              className="bg-slate-900 font-bold text-white focus:outline-none cursor-pointer border border-slate-700 rounded px-1 py-0.5"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {formatMonthLabel(m)}
                </option>
              ))}
              <option value="all">Tous les mois</option>
            </select>
          </div>

          {/* Date Range Selector */}
          {onDateRangeChange && onClearDateRange && (
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={onDateRangeChange}
              onClearDateRange={onClearDateRange}
              compact
            />
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-lg transition-all flex items-center space-x-2 shadow-md cursor-pointer border border-emerald-400/30"
            title="Envoyer vers l'imprimante locale ou enregistrer au format PDF"
          >
            <Printer className="w-4 h-4 text-emerald-100" />
            <span>Lancer l'impression</span>
          </button>

          <button
            onClick={handleOpenPrintPopup}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
            title="Ouvrir dans une nouvelle fenêtre indépendante pour imprimer sans contraintes d'iframe"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Fenêtre Externe / PDF</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
            title="Quitter l'aperçu"
          >
            <X className="w-4 h-4" />
            <span>Fermer</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div id="printable-report-content" className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 border border-slate-200 print:border-none print:p-0">
        
        {/* Header Document */}
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              IMPRIMERIE MBC PRINT
            </h1>
            <p className="text-sm font-bold text-indigo-700 uppercase mt-0.5">
              {shopTitle}
            </p>
            <p className="text-xs text-slate-600 font-semibold">
              Service de comptabilité & Gestion des caisses — Kinshasa
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-extrabold text-slate-900">
              RAPPORT FINANCIER {startDate || endDate ? 'PAR PÉRIODE' : 'MENSUEL'}
            </h2>
            <p className="text-sm font-bold text-slate-700">
              Période : {periodLabel}
            </p>
          </div>
        </div>

        {/* 1. Tableau Synthèse Recettes et Dépenses */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            1. Tableau Synthèse Recettes et Dépenses ({periodLabel})
          </h3>
          <table className="w-full text-left border-collapse text-xs sm:text-sm border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800 uppercase">
              <tr>
                <th className="p-2.5 border border-slate-300">Désignation</th>
                <th className="p-2.5 border border-slate-300 text-right">Franc (FC)</th>
                <th className="p-2.5 border border-slate-300 text-right">Dollars ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-semibold">
              <tr>
                <td className="p-2.5 border border-slate-300 font-bold">Recettes Directes Encaissées</td>
                <td className="p-2.5 border border-slate-300 text-right text-emerald-800">{formatFC(sumRecettesFC)}</td>
                <td className="p-2.5 border border-slate-300 text-right text-emerald-800">{formatUSD(sumRecettesUSD)}</td>
              </tr>
              <tr>
                <td className="p-2.5 border border-slate-300 font-bold">Dépenses Opérationnelles</td>
                <td className="p-2.5 border border-slate-300 text-right text-rose-800">{formatFC(sumDepensesFC)}</td>
                <td className="p-2.5 border border-slate-300 text-right text-rose-800">{formatUSD(sumDepensesUSD)}</td>
              </tr>
              <tr className="bg-slate-100 font-extrabold">
                <td className="p-2.5 border border-slate-300">SOLDE THÉORIQUE BRUT</td>
                <td className="p-2.5 border border-slate-300 text-right text-blue-900">{formatFC(soldeFC)}</td>
                <td className="p-2.5 border border-slate-300 text-right text-blue-900">{formatUSD(soldeUSD)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. Tableau Détaillé des Dépenses par Rubrique */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            2. Tableau Détaillé des Dépenses par Rubrique ({formatMonthLabel(selectedMonth)})
          </h3>
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800 uppercase">
              <tr>
                <th className="p-2 border border-slate-300">Rubriques</th>
                <th className="p-2 border border-slate-300">Description / Motifs Principaux</th>
                <th className="p-2 border border-slate-300 text-right">Francs (FC)</th>
                <th className="p-2 border border-slate-300 text-right">Dollars ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-medium">
              {monthCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-500 italic">
                    Aucune dépense par rubrique enregistrée pour ce mois ({formatMonthLabel(selectedMonth)}).
                  </td>
                </tr>
              ) : (
                monthCategories.map((c, idx) => (
                  <tr key={`${c.rubrique}-${idx}`}>
                    <td className="p-2 border border-slate-300 font-semibold">{c.rubrique}</td>
                    <td className="p-2 border border-slate-300 text-slate-600">{c.description || '-'}</td>
                    <td className="p-2 border border-slate-300 text-right">{c.francs > 0 ? formatFC(c.francs) : '-'}</td>
                    <td className="p-2 border border-slate-300 text-right font-semibold">{c.dollars > 0 ? formatUSD(c.dollars) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-xs">
              <tr>
                <td colSpan={2} className="p-2 border border-slate-300 uppercase">TOTAL DÉPENSES (RUBRIQUES)</td>
                <td className="p-2 border border-slate-300 text-right">{formatFC(totalMonthCatFC)}</td>
                <td className="p-2 border border-slate-300 text-right">{formatUSD(totalMonthCatUSD)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 3. Relevé Chronologique des Motifs de Dépenses Journalières */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3">
            3. Relevé Chronologique des Motifs de Dépenses ({formatMonthLabel(selectedMonth)})
          </h3>
          <table className="w-full text-left border-collapse text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold text-slate-800 uppercase">
              <tr>
                <th className="p-2 border border-slate-300">Date</th>
                <th className="p-2 border border-slate-300">Motif / Justification de la Dépense</th>
                <th className="p-2 border border-slate-300 text-right">Francs (FC)</th>
                <th className="p-2 border border-slate-300 text-right">Dollars ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-medium">
              {reports.filter(r => r.depensesFC > 0 || r.depensesUSD > 0).length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-slate-500 italic">
                    Aucune dépense journalière enregistrée pour le mois de {formatMonthLabel(selectedMonth)}.
                  </td>
                </tr>
              ) : (
                reports.filter(r => r.depensesFC > 0 || r.depensesUSD > 0).map((r) => (
                  <tr key={r.id}>
                    <td className="p-2 border border-slate-300 font-semibold whitespace-nowrap">{r.date}</td>
                    <td className="p-2 border border-slate-300 text-slate-800">{r.motifDepenses || 'Dépenses courantes'}</td>
                    <td className="p-2 border border-slate-300 text-right">{r.depensesFC > 0 ? formatFC(r.depensesFC) : '-'}</td>
                    <td className="p-2 border border-slate-300 text-right font-semibold">{r.depensesUSD > 0 ? formatUSD(r.depensesUSD) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Notes, Remarques & Rapprochement de Caisse Dynamique */}
        <div className="bg-slate-50 border border-slate-300 p-4 rounded text-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm uppercase">
            4. Remarques, Créances & Ajustement du Fond de Caisse ({formatMonthLabel(selectedMonth)})
          </h3>
          
          <div className="space-y-3 text-slate-800 leading-relaxed">
            
            {/* Créances Clients Section */}
            <div>
              <p className="font-bold text-slate-900 mb-1">
                • Créances Clients Enregistrées ({formatMonthLabel(selectedMonth)}) :
              </p>
              {monthReceivables.length === 0 ? (
                <p className="text-slate-600 italic pl-3">
                  Aucune créance client enregistrée pour ce mois ({formatMonthLabel(selectedMonth)}).
                </p>
              ) : (
                <ul className="list-disc list-inside pl-3 space-y-1.5 text-slate-700">
                  {monthReceivables.map((rec) => (
                    <li key={rec.id}>
                      <strong>Créance Client ({rec.client}) :</strong> {rec.client} doit un montant de{' '}
                      {rec.amountUSD > 0 && <strong>{formatUSD(rec.amountUSD)} </strong>}
                      {rec.amountFC > 0 && <strong>{formatFC(rec.amountFC)} </strong>}
                      pour <em>{rec.description}</em> {rec.details ? `(${rec.details})` : ''}. Status :{' '}
                      <span className={rec.status === 'PAID' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                        {rec.status === 'PAID' ? 'RÉGLÉ' : 'EN ATTENTE DE PAIEMENT'}
                      </span>
                      . Ce montant n'est pas comptabilisé dans les recettes directes en caisse.
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ajustements & Décaissements de Caisse Section */}
            <div>
              <p className="font-bold text-slate-900 mb-1">
                • Opérations Directes & Ajustements du Fond de Caisse ({formatMonthLabel(selectedMonth)}) :
              </p>
              {monthAdjustments.length === 0 ? (
                <p className="text-slate-600 italic pl-3">
                  Aucun ajustement ou avance de caisse exceptionnel enregistré pour le mois de {formatMonthLabel(selectedMonth)}.
                </p>
              ) : (
                <ul className="list-disc list-inside pl-3 space-y-1.5 text-slate-700">
                  {monthAdjustments.map((a) => (
                    <li key={a.id}>
                      <strong>{a.description}</strong> ({a.targetEntity}) :{' '}
                      {a.amountUSD > 0 && <span className="font-bold text-slate-900">{formatUSD(a.amountUSD)} </span>}
                      {a.amountFC > 0 && <span className="font-bold text-slate-900">{formatFC(a.amountFC)} </span>}
                      — Type : <span className="italic">{a.type === 'ADVANCE' ? 'Avance de caisse' : a.type === 'DEBT_SETTLEMENT' ? 'Règlement dette' : 'Sortie directe'}</span>
                      {a.notes ? ` (${a.notes})` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Availability / Net Cash Summary */}
            <div className="pt-2 border-t border-slate-200 text-slate-900 font-medium">
              <p>
                • <strong>Fond de Caisse Réel et Disponible ({formatMonthLabel(selectedMonth)}) :</strong>
              </p>
              <p className="pl-3 mt-1 text-slate-700">
                Le solde théorique brut en caisse s'élève à <strong>{formatFC(soldeFC)}</strong> et <strong>{formatUSD(soldeUSD)}</strong>.
                {monthAdjustments.length > 0 ? (
                  <>
                    {' '}Suite aux avances et décaissements enregistrés ({formatFC(totalAdjFC)} / {formatUSD(totalAdjUSD)}), le fond de caisse réel disponible à la clôture de la période est évalué à <strong>{formatFC(netAvailableFC)}</strong> et <strong>{formatUSD(netAvailableUSD)}</strong>.
                  </>
                ) : (
                  <> Le solde disponible correspond exactement au solde théorique des encaissements directs.</>
                )}
              </p>
            </div>

          </div>
        </div>

        {/* 4. Observations & Commentaires Personnalisés (Modifiable à tout moment) */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600 print:hidden" />
              <span>4. Observations & Remarques du Rapport</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal lowercase italic print:hidden">
              (Modifiable à tout moment — s'affiche à l'impression & PDF)
            </span>
          </h3>

          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 print:border-slate-300 print:bg-slate-50 print:p-3 space-y-2">
            <label className="block text-xs font-bold text-slate-800 print:hidden">
              Saisissez ou modifiez vos commentaires avant l'impression / export PDF :
            </label>

            <textarea
              value={reportComments}
              onChange={(e) => setReportComments(e.target.value)}
              placeholder="Saisissez ici vos remarques ou explications particulières (ex: justification d'une dépense, validation sous réserve, note de gérance...)"
              rows={3}
              className="w-full bg-white border border-amber-300 focus:border-indigo-500 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-inner resize-y print:hidden font-sans"
            />

            {/* Contenu affiché lors de l'impression physique ou de la génération PDF */}
            <div className={`text-xs text-slate-800 whitespace-pre-wrap leading-relaxed ${reportComments ? 'block' : 'hidden print:block'}`}>
              {reportComments ? (
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                  <p className="font-semibold text-slate-900">{reportComments}</p>
                </div>
              ) : (
                <p className="text-slate-400 italic">Aucune remarque particulière consignée pour cette période.</p>
              )}
            </div>

            {/* Modèles de commentaires rapides */}
            <div className="pt-1 flex flex-wrap gap-1.5 print:hidden">
              <span className="text-[11px] text-slate-500 font-medium self-center mr-1">Raccourcis :</span>
              <button
                type="button"
                onClick={() => setReportComments((prev) => (prev ? `${prev}\n• Nous avons acheter 5 cartons de papier duplicateur qui n'est pas mentionner dans le logiciel donc 100$` : "Nous avons acheter 5 cartons de papier duplicateur qui n'est pas mentionner dans le logiciel donc 100$"))}
                className="text-[11px] bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-medium transition-colors cursor-pointer shadow-2xs"
              >
                + Achat 5 cartons papier (100$)
              </button>
              <button
                type="button"
                onClick={() => setReportComments((prev) => (prev ? `${prev}\n• Rapport vérifié, certifié conforme et approuvé par la gérance.` : '• Rapport vérifié, certifié conforme et approuvé par la gérance.'))}
                className="text-[11px] bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-medium transition-colors cursor-pointer shadow-2xs"
              >
                + Certifié conforme
              </button>
              <button
                type="button"
                onClick={() => setReportComments((prev) => (prev ? `${prev}\n• Écart de caisse régularisé après audit et vérification des pièces justificatives.` : '• Écart de caisse régularisé après audit et vérification des pièces justificatives.'))}
                className="text-[11px] bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-medium transition-colors cursor-pointer shadow-2xs"
              >
                + Écart régularisé
              </button>
              <button
                type="button"
                onClick={() => setReportComments((prev) => (prev ? `${prev}\n• Comprend un achat de consommables et matériel exceptionnel ce mois-ci.` : '• Comprend un achat de consommables et matériel exceptionnel ce mois-ci.'))}
                className="text-[11px] bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-medium transition-colors cursor-pointer shadow-2xs"
              >
                + Dépense exceptionnelle
              </button>
              {reportComments && (
                <button
                  type="button"
                  onClick={() => setReportComments('')}
                  className="text-[11px] text-rose-600 hover:text-rose-700 underline font-semibold ml-auto cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-10 grid grid-cols-3 gap-6 text-center text-xs font-semibold text-slate-700">
          <div>
            <p className="border-b border-slate-400 pb-12 mb-2">Le Caissier</p>
            <p className="text-[11px] font-normal text-slate-500">Signature & Date</p>
          </div>
          <div>
            <p className="border-b border-slate-400 pb-12 mb-2">Le Comptable</p>
            <p className="text-[11px] font-normal text-slate-500">Signature & Date</p>
          </div>
          <div>
            <p className="border-b border-slate-400 pb-12 mb-2">La Gérance</p>
            <p className="text-[11px] font-normal text-slate-500">Approbation</p>
          </div>
        </div>

      </div>

      {/* Bottom Floating Action Bar (Hidden when printing) */}
      <div className="print:hidden max-w-4xl mx-auto mt-6 flex justify-between items-center bg-slate-100 border border-slate-200 p-4 rounded-xl shadow-sm">
        <p className="text-xs text-slate-600 font-medium">
          Rapport mensuel prêt pour impression officielle A4 ou enregistrement PDF.
        </p>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-lg transition-all flex items-center space-x-2 shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-100" />
            <span>Lancer l'impression</span>
          </button>
          <button
            onClick={handleOpenPrintPopup}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Fenêtre Externe / PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>

    </div>
  );
};

