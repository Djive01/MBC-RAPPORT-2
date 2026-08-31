import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to initialize Gemini client on server side
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("La clé API GEMINI_API_KEY n'est pas définie dans l'environnement.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint for AI Analysis & Financial Consulting
app.post("/api/ai/analyze", async (req, res) => {
  try {
    const { reportContext, userQuery, mode } = req.body;

    const ai = getAiClient();

    const systemInstruction = `Tu es l'Expert-Comptable et Directeur Financier virtuel de l'Imprimerie MBC Print (Kinshasa, RDC).
L'entreprise opère sur 2 sites principaux : Imprimerie Lingwala et Imprimerie Limete.
Les devises utilisées sont le Franc Congolais (FC) et le Dollar Américain ($ USD).

Règles de ton analyse :
1. Analyse avec clarté, exactitude et professionnalisme les données financières transmises (Recettes, Dépenses par poste, Créances clients, Écarts de caisse).
2. Fournis un diagnostic clair et structuré en Français avec un ton courtois, constructif et très pratique pour les gérants et administrateurs.
3. Analyse les ratios importants : solde net, postes de dépenses dominants (ex: carburant pour groupes électrogènes, cartouches de toner, papier, maintenance), créances impayées à recouvrer.
4. Propose des conseils conccrets d'optimisation financière et d'économie de coûts adaptées au secteur de l'imprimerie à Kinshasa.
5. Utilise des mises en forme Markdown très lisibles (titres, puces, gras et émoticônes pertinents).`;

    let prompt = "";
    if (mode === "chat" && userQuery) {
      prompt = `Voici les données financières actuelles de l'Imprimerie MBC Print :\n\n\`\`\`json\n${JSON.stringify(reportContext, null, 2)}\n\`\`\`\n\nQuestion posée par le gérant/administrateur : "${userQuery}"\n\nDonne une réponse précise, détaillée et directement exploitable basée sur ces données.`;
    } else {
      prompt = `Génère un rapport d'analyse financière complet et une synthèse stratégique basée sur les données réelles suivantes :\n\n\`\`\`json\n${JSON.stringify(reportContext, null, 2)}\n\`\`\`\n\nStructure ta synthèse comme suit :
1. 📊 **Synthèse Globale & Performance Financière** (Recettes, dépenses et bénéfice/solde net)
2. 🏪 **Analyse par Shop** (Lingwala vs Limete si données disponibles)
3. ⚠️ **Points d'Attention & Dépenses Prioritaires** (Postes les plus coûteux et anomalies)
4. 💳 **Gestion des Créances Clients & Risques d'Impayés**
5. 🚀 **Recommandations & Plan d'Action d'Optimisation**`;
    }

    const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-flash-latest"];
    let lastError: any = null;
    let text = "";

    for (const modelName of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 2;
      while (attempts < maxAttempts) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.4,
            },
          });
          text = response.text || "Aucune réponse n'a pu être générée.";
          if (text) break;
        } catch (err: any) {
          lastError = err;
          attempts++;
          const errStr = String(err?.message || err);
          if (errStr.includes("503") || errStr.includes("UNAVAILABLE") || errStr.includes("high demand") || errStr.includes("429")) {
            // Wait 1 second before retrying or switching model
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            // Non-transient error, break to try next model or fail
            break;
          }
        }
      }
      if (text) break;
    }

    if (!text) {
      const is503 = String(lastError?.message || "").includes("503") || String(lastError?.message || "").includes("UNAVAILABLE");
      const userFriendlyMsg = is503
        ? "Le service d'intelligence artificielle Gemini est temporairement surchargé. Veuillez réessayer dans quelques secondes."
        : (lastError?.message || "Une erreur est survenue lors de la communication avec l'IA.");
      return res.status(503).json({ error: userFriendlyMsg });
    }

    res.json({ result: text });
  } catch (error: any) {
    console.error("Erreur serveur Gemini AI:", error);
    res.status(500).json({ 
      error: error?.message || "Une erreur est survenue lors de la communication avec l'intelligence artificielle Gemini." 
    });
  }
});

async function startServer() {
  // Development Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
