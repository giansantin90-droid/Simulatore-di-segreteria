import { GoogleGenAI, Type } from "@google/genai";
import { StudioType, DailyScenario, TaskType } from "../types";

// Helper to ensure we have an API key
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing. Please set process.env.API_KEY");
    // In a real app, we might throw or handle this gracefully in UI
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateScenario = async (month: number, studioType: StudioType): Promise<DailyScenario | null> => {
  const client = getClient();
  if (!client) return null;

  const prompt = `
    Sei un sceneggiatore esperto per simulatori di formazione aziendale.
    Crea uno scenario realistico per un corso di formazione per segretarie/assistenti di studio.
    
    Contesto:
    - Mese di lavoro: ${month} (1 = novizio, 12 = esperto)
    - Tipo di Studio: ${studioType}
    - Lingua: Italiano
    
    Genera un oggetto JSON contenente:
    1. Una lista di 3-5 email realistiche (alcune urgenti, spam, o clienti arrabbiati).
    2. Una lista di 2-3 eventi in calendario (che potrebbero creare conflitti).
    3. Un obiettivo principale della giornata.
    
    Le email devono sembrare vere, con mittenti verosimili.
    Se il mese è avanzato (es. 10-12), includi situazioni complesse (es. clienti che minacciano azioni legali, scadenze fiscali imminenti).
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            month: { type: Type.INTEGER },
            dayTitle: { type: Type.STRING },
            description: { type: Type.STRING },
            objective: { type: Type.STRING },
            difficulty: { type: Type.INTEGER },
            emails: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  from: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  body: { type: Type.STRING },
                  isRead: { type: Type.BOOLEAN },
                  date: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Normal", "Low"] }
                }
              }
            },
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  start: { type: Type.STRING, description: "HH:mm format for today" },
                  end: { type: Type.STRING, description: "HH:mm format for today" },
                  type: { type: Type.STRING, enum: ["meeting", "call", "personal"] },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return data as DailyScenario;

  } catch (error) {
    console.error("Error generating scenario:", error);
    // Fallback mock data could be returned here if API fails
    return null;
  }
};

export const evaluateResponse = async (
  taskType: TaskType,
  userContent: string,
  context: string,
  studioType: StudioType
): Promise<{ feedback: string; score: number; suggestions: string }> => {
  const client = getClient();
  if (!client) return { feedback: "Errore API", score: 0, suggestions: "" };

  const prompt = `
    Agisci come il Capo dello ${studioType}. Sei molto esigente ma giusto.
    Un tuo assistente ha appena completato un compito: ${taskType}.
    
    Contesto del compito: ${context}
    Risposta/Azione dell'assistente: "${userContent}"
    
    Valuta la risposta basandoti su:
    1. Tono professionale (formale ma cordiale).
    2. Correttezza grammaticale (Italiano).
    3. Efficacia nel risolvere il problema.
    4. Uso corretto delle soft skills.
    
    Restituisci un JSON.
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING, description: "Commento diretto all'assistente" },
            score: { type: Type.INTEGER, description: "Voto da 1 a 100" },
            suggestions: { type: Type.STRING, description: "Come migliorare la prossima volta" }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error evaluating response:", error);
    return { feedback: "Errore nella valutazione.", score: 0, suggestions: "Riprova più tardi." };
  }
};

export const getAIHelp = async (query: string, studioType: StudioType): Promise<string> => {
  const client = getClient();
  if (!client) return "Servizio non disponibile.";

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Sei un assistente AI integrato nel workspace di uno ${studioType}.
      L'utente ti chiede: "${query}".
      Rispondi in modo breve, pratico e utile per aiutare l'utente a completare il suo lavoro di segreteria.`,
    });
    return response.text || "Nessuna risposta generata.";
  } catch (e) {
    return "Si è verificato un errore.";
  }
};
