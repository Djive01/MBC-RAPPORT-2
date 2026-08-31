import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function aiApiPlugin(): Plugin {
  return {
    name: 'ai-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/ai/analyze' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { reportContext, userQuery, mode } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: "La clé API GEMINI_API_KEY n'est pas définie dans l'environnement." }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const systemInstruction = `Tu es l'Expert-Comptable et Directeur Financier virtuel de l'Imprimerie MBC Print (Kinshasa, RDC).
L'entreprise opère sur 2 sites principaux : Imprimerie Lingwala et Imprimerie Limete.
Les devises utilisées sont le Franc Congolais (FC) et le Dollar Américain ($ USD).

Règles de ton analyse :
1. Analyse avec clarté, exactitude et professionnalisme les données financières transmises (Recettes, Dépenses par poste, Créances clients, Écarts de caisse).
2. Fournis un diagnostic clair et structuré en Français avec un ton courtois, constructif et très pratique pour les gérants et administrateurs.
3. Analyse les ratios importants : solde net, postes de dépenses dominants (ex: carburant pour groupes électrogènes, cartouches de toner, papier, maintenance), créances impayées à recouvrer.
4. Propose des conseils concrets d'optimisation financière et d'économie de coûts adaptées au secteur de l'imprimerie à Kinshasa.
5. Utilise des mises en forme Markdown très lisibles (titres, puces, gras et émoticônes pertinents).`;

              let prompt = '';
              if (mode === 'chat' && userQuery) {
                prompt = `Voici les données financières actuelles de l'Imprimerie MBC Print :\n\n\`\`\`json\n${JSON.stringify(reportContext, null, 2)}\n\`\`\`\n\nQuestion posée par le gérant/administrateur : "${userQuery}"\n\nDonne une réponse précise, détaillée et directement exploitable basée sur ces données.`;
              } else {
                prompt = `Génère un rapport d'analyse financière complet et une synthèse stratégique basée sur les données réelles suivantes :\n\n\`\`\`json\n${JSON.stringify(reportContext, null, 2)}\n\`\`\`\n\nStructure ta synthèse comme suit :
1. 📊 **Synthèse Globale & Performance Financière** (Recettes, dépenses et bénéfice/solde net)
2. 🏪 **Analyse par Shop** (Lingwala vs Limete si données disponibles)
3. ⚠️ **Points d'Attention & Dépenses Prioritaires** (Postes les plus coûteux et anomalies)
4. 💳 **Gestion des Créances Clients & Risques d'Impayés**
5. 🚀 **Recommandations & Plan d'Action d'Optimisation**`;
              }

              const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest'];
              let lastError: any = null;
              let text = '';

              for (const modelName of modelsToTry) {
                try {
                  const response = await ai.models.generateContent({
                    model: modelName,
                    contents: prompt,
                    config: {
                      systemInstruction,
                      temperature: 0.4,
                    },
                  });
                  text = response.text || '';
                  if (text) break;
                } catch (err: any) {
                  lastError = err;
                }
              }

              if (!text) {
                res.statusCode = 503;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: lastError?.message || "Erreur de communication avec l'IA." }));
                return;
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ result: text }));
            } catch (error: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: error?.message || 'Erreur interne du serveur.' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    },
  };
});
