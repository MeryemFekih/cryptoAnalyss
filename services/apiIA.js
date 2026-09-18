import axios from "axios";
import { GEMINI_API_KEY } from "@env";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

// Construit le prompt à partir des données crypto + contexte macro
function buildPrompt(marketData, macroContext) {
  return `
Tu es un analyste financier. Voici les données d'une cryptomonnaie :
${JSON.stringify(marketData)}

Contexte macroéconomique actuel :
- Or : ${macroContext?.gold?.price ?? "N/A"} $/oz
- Pétrole (WTI) : ${macroContext?.oil?.price ?? "N/A"} $/baril

Estime l'évolution probable du prix de cette cryptomonnaie sur les prochaines 24h.
Réponds uniquement selon le schéma JSON demandé, en français.
  `.trim();
}

// Appelle Gemini et renvoie une estimation structurée
export async function estimatePrice(marketData, macroContext, retries = 2) {
  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(marketData, macroContext) }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              direction: { type: "STRING", enum: ["hausse", "baisse", "stable"] },
              confiance: { type: "STRING", enum: ["faible", "moyenne", "élevée"] },
              explication: { type: "STRING" },
            },
            required: ["direction", "confiance", "explication"],
          },
        },
      }
    );

    const raw = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(raw);
  } catch (e) {
    const status = e.response?.status;
    if ((status === 429 || status === 503) && retries > 0) {
      console.log(`Retry estimatePrice (${retries} restants)...`);
      await new Promise((r) => setTimeout(r, 2000)); // attend 2s
      return estimatePrice(marketData, macroContext, retries - 1);
    }
    console.log("erreur estimatePrice :", e.response?.data ?? e.message);
    return null;
  }
}