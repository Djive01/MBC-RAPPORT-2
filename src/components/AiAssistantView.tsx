import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Send, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Lightbulb, 
  FileText,
  DollarSign,
  Store,
  Zap,
  HelpCircle
} from 'lucide-react';
import Markdown from 'react-markdown';
import { DailyReportItem, ExpenseCategoryItem, ReceivableItem, CashAdjustmentItem, ShopId } from '../types';
import { formatFC, formatUSD } from '../utils/formatters';

interface AiAssistantViewProps {
  reports: DailyReportItem[];
  categories: ExpenseCategoryItem[];
  receivables: ReceivableItem[];
  adjustments: CashAdjustmentItem[];
  exchangeRate: number;
  activeShopId: ShopId | 'all';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  reports,
  categories,
  receivables,
  adjustments,
  exchangeRate,
  activeShopId,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'analysis' | 'chat'>('analysis');
  
  // AI Analysis state
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Bonjour ! Je suis votre Assistant IA Financier dédié à **MBC Print**.\n\nJe peux analyser vos recettes, vos dépenses par catégorie (toner, carburant, maintenance...), l'état de vos créances clients et les écarts de caisse pour Lingwala et Limete.\n\nPosez-moi une question ou cliquez sur **Générer l'Analyse Financière IA** ci-dessus !",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userQuery, setUserQuery] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Calculate high-level financial metrics for context
  const totalRecettesFC = reports.reduce((acc, r) => acc + r.recettesFC, 0);
  const totalRecettesUSD = reports.reduce((acc, r) => acc + r.recettesUSD, 0);
  const totalDepensesFC = reports.reduce((acc, r) => acc + r.depensesFC, 0);
  const totalDepensesUSD = reports.reduce((acc, r) => acc + r.depensesUSD, 0);
  const pendingReceivablesUSD = receivables.filter(r => r.status !== 'PAID').reduce((sum, r) => sum + r.amountUSD, 0);
  const pendingReceivablesFC = receivables.filter(r => r.status !== 'PAID').reduce((sum, r) => sum + r.amountFC, 0);
  const totalAdjustmentsUSD = adjustments.reduce((sum, a) => sum + a.amountUSD, 0);

  const soldeNetFC = totalRecettesFC - totalDepensesFC;
  const soldeNetUSD = totalRecettesUSD - totalDepensesUSD;

  // Prepare full JSON context payload for Gemini
  const getFinancialContext = () => {
    return {
      shopContexte: activeShopId === 'lingwala' ? 'Imprimerie LINGWALA' : activeShopId === 'limete' ? 'Imprimerie LIMETE' : 'Consolidé (Lingwala + Limete)',
      tauxChangeUSD_FC: exchangeRate,
      statistiquesSynthese: {
        totalRecettesFC,
        totalRecettesUSD,
        totalDepensesFC,
        totalDepensesUSD,
        soldeNetFC,
        soldeNetUSD,
        creancesEnAttenteUSD: pendingReceivablesUSD,
        creancesEnAttenteFC: pendingReceivablesFC,
        ajustementsCaisseUSD: totalAdjustmentsUSD,
        nombreJoursEnregistres: reports.length,
      },
      rubriquesDepenses: categories.map(c => ({
        shop: c.shopId,
        rubrique: c.rubrique,
        depensesFC: c.francs,
        depensesUSD: c.dollars,
        description: c.description
      })),
      creancesClientsPrincipales: receivables.slice(0, 10).map(r => ({
        shop: r.shopId,
        client: r.client,
        description: r.description,
        montantUSD: r.amountUSD,
        statut: r.status,
        date: r.date
      })),
      ajustementsCaisse: adjustments.slice(0, 10).map(a => ({
        shop: a.shopId,
        description: a.description,
        beneficiaire: a.targetEntity,
        montantUSD: a.amountUSD,
        type: a.type
      }))
    };
  };

  const handleGenerateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'analysis',
          reportContext: getFinancialContext(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Erreur serveur lors de la génération de l'analyse.");
      }

      setAnalysisResult(data.result);
    } catch (err: any) {
      console.error('Error fetching AI analysis:', err);
      setAnalysisError(err.message || "Impossible de contacter l'assistant IA.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendChatMessage = async (queryText?: string) => {
    const textToSend = (queryText || userQuery).trim();
    if (!textToSend || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setUserQuery('');
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          userQuery: textToSend,
          reportContext: getFinancialContext(),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Erreur de génération de réponse.');
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.result,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **Désolé**, une erreur est survenue : ${err.message || "Problème d'accès à l'API Gemini."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const promptSuggestions = [
    "Quel shop est le plus rentable ?",
    "Quelles sont les dépenses les plus élevées ?",
    "Fais-moi un résumé des créances impayées",
    "Conseils pour réduire le budget carburant",
    "Est-ce que le solde net est satisfaisant ?"
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                Intelligence Artificielle Gemini 3.6
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
                Actif & Connecté
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Bot className="w-7 h-7 text-indigo-400" />
              Assistant Financier & Conseiller IA
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Analyse automatisée, diagnostic des dépenses, contrôle des créances et recommandations stratégiques pour 
              <strong className="text-white ml-1 font-bold">
                {activeShopId === 'lingwala' ? 'Imprimerie LINGWALA' : activeShopId === 'limete' ? 'Imprimerie LIMETE' : 'Imprimeries LINGWALA & LIMETE'}
              </strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleGenerateAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Générer l'Analyse IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metric Quick Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-indigo-900/60 text-xs">
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-slate-400 font-semibold mb-0.5">Recettes Cumulées</div>
            <div className="font-bold text-sm text-emerald-400">
              {formatUSD(totalRecettesUSD)} <span className="text-slate-300 text-[10px]">({formatFC(totalRecettesFC)})</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-slate-400 font-semibold mb-0.5">Dépenses Cumulées</div>
            <div className="font-bold text-sm text-rose-400">
              {formatUSD(totalDepensesUSD)} <span className="text-slate-300 text-[10px]">({formatFC(totalDepensesFC)})</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-slate-400 font-semibold mb-0.5">Solde Net Théorique</div>
            <div className={`font-bold text-sm ${soldeNetUSD >= 0 ? 'text-indigo-300' : 'text-rose-400'}`}>
              {formatUSD(soldeNetUSD)}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="text-slate-400 font-semibold mb-0.5">Créances Impayées</div>
            <div className="font-bold text-sm text-amber-300">
              {formatUSD(pendingReceivablesUSD)}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('analysis')}
          className={`py-3 px-5 font-bold text-sm border-b-2 transition-all flex items-center space-x-2 ${
            activeSubTab === 'analysis'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Synthèse & Diagnostic Financier</span>
        </button>
        
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`py-3 px-5 font-bold text-sm border-b-2 transition-all flex items-center space-x-2 ${
            activeSubTab === 'chat'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat & Questions en Direct</span>
          {messages.length > 1 && (
            <span className="ml-1.5 px-2 py-0.5 text-[10px] bg-indigo-100 text-indigo-700 font-bold rounded-full">
              {messages.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: SYNTHESIS & ANALYSIS */}
      {activeSubTab === 'analysis' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Rapport Diagnostique de l'IA</h3>
            </div>
            
            {analysisResult && (
              <button
                onClick={handleCopyAnalysis}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center space-x-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copier l'Analyse</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Loading State */}
          {isAnalyzing && (
            <div className="py-16 text-center space-y-4">
              <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-2">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">Génération de l'analyse en cours...</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                L'IA examine vos chiffres de recettes, le détail des dépenses par rubrique, le solde net et les créances pour vous préparer une synthèse complète.
              </p>
            </div>
          )}

          {/* Error State */}
          {analysisError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Erreur lors de l'analyse</h4>
                <p className="text-xs mt-0.5 text-rose-700">{analysisError}</p>
                <button
                  onClick={handleGenerateAnalysis}
                  className="mt-2 text-xs font-bold text-rose-900 underline hover:text-rose-950"
                >
                  Réessayer la génération
                </button>
              </div>
            </div>
          )}

          {/* Main Analysis Markdown Output */}
          {!isAnalyzing && !analysisError && analysisResult && (
            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 space-y-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                <Markdown>{analysisResult}</Markdown>
              </div>
            </div>
          )}

          {/* Placeholder / Ungenerated State */}
          {!isAnalyzing && !analysisError && !analysisResult && (
            <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="font-bold text-slate-800 text-base">Aucune analyse générée pour l'instant</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Cliquez sur le bouton ci-dessous pour lancer une analyse financière intelligente de votre rapport journalier actualisé.
                </p>
              </div>
              <button
                onClick={handleGenerateAnalysis}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Lancer l'Analyse IA</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CHAT INTERFACING */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px] overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Chat avec l'Expert Financier IA</h3>
                <p className="text-[11px] text-slate-400">Posez vos questions précises sur le rapport financier</p>
              </div>
            </div>

            <div className="text-xs px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700 font-mono">
              Mode: {activeShopId === 'all' ? 'Consolidé' : activeShopId.toUpperCase()}
            </div>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] shrink-0 flex items-center">
              <HelpCircle className="w-3 h-3 mr-1 text-indigo-600" /> Suggestions:
            </span>
            {promptSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChatMessage(suggestion)}
                disabled={isSendingChat}
                className="px-3 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-full font-medium transition-all shrink-0 cursor-pointer text-xs"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-indigo-400'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <span className="text-xs font-bold">Vous</span>
                  ) : (
                    <Bot className="w-4.5 h-4.5" />
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm shadow-sm max-w-2xl ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 border-b border-black/10 pb-1 text-[10px] opacity-75">
                    <span className="font-bold uppercase tracking-wider">
                      {msg.sender === 'user' ? 'Vous' : 'Assistant IA MBC Print'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="prose prose-slate prose-xs max-w-none space-y-2">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSendingChat && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs italic p-2 bg-white rounded-xl border border-slate-200 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>L'IA analyse les rapports et prépare votre réponse...</span>
              </div>
            )}
          </div>

          {/* Chat Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChatMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Posez une question sur vos recettes, dépenses ou créances..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              disabled={isSendingChat}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!userQuery.trim() || isSendingChat}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
