/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client to prevent runtime crash on missing key
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API Client successfully initialized.");
    } else {
      console.warn("GEMINI_API_KEY environment variable is not defined or is default. Server will run in simulation mode for AI features.");
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes

  // Check health and if API key is loaded
  app.get("/api/health", (req: Request, res: Response) => {
    const isKeyConfigured = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
    res.json({
      status: "ok",
      aiMode: isKeyConfigured ? "real" : "simulated",
      message: isKeyConfigured 
        ? "SouLSynC Core AI online and fully functional." 
        : "SouLSynC operating in high-fidelity simulation mode. Attach a GEMINI_API_KEY in Settings > Secrets for real intelligence."
    });
  });

  // 1. Compatibility Calculation API
  app.post("/api/gemini/compatibility", async (req: Request, res: Response) => {
    const { userA, userB, answers, gameRecord } = req.body;

    const fallbackResponse = {
      overallPercentage: Math.min(100, Math.max(45, Math.floor(65 + Math.random() * 32))),
      emotionalScore: Math.floor(70 + Math.random() * 26),
      communicationScore: Math.floor(65 + Math.random() * 31),
      lifestyleScore: Math.floor(60 + Math.random() * 36),
      loveLanguageMatch: "Quality Time & Words of Affirmation",
      relationshipDynamics: "A deeply supportive partnership characterized by shared intellectual curiosity and a strong mutual respect for spaces of personal growth.",
      greenFlags: [
        "Highly aligned relationship expectations and visions for the future.",
        "Complementary communication patterns with constructive problem solving.",
        "Empathetic emotional intelligence shown in difficult hypothetical situations."
      ],
      redFlags: [
        "Slight mismatch in daily pacing (Introvert/Extrovert alignment needs calibration).",
        "Different preferred approaches to conflict resolution (withholding thoughts vs direct confrontation)."
      ],
      growthAreas: [
        "Carve out committed tech-free hours weekly for quality bonding time.",
        "Incorporate playfulness and interactive tasks like games in standard dates to ease light-hearted sharing."
      ],
      compatibilityAdvice: "You two show incredible promise! Your intellectual and communication preferences form an extremely sturdy bridge. To nourish this affinity, focus on translating digital compatibility into cozy offline sharing while embracing each other's distinct battery levels for social groups.",
      suggestedActivities: [
        "Create a cozy blanket picnic at home with a record player spinning mutual recommendations.",
        "Attend an interactive cooking workshop to learn a high-effort recipe together.",
        "Set up an offline games night (with stone-paper-scissors tie breakers) to stay lighthearted."
      ]
    };

    try {
      const client = getGeminiClient();
      if (!client) {
        return res.json({ response: fallbackResponse, simulated: true });
      }

      const prompt = `
        Analyze compatibility between two individuals based on their profiles and mutual question answers:
        
        User A Profile:
        - Name: ${userA.name}
        - Age: ${userA.age}
        - Personality Type: ${userA.personalityType}
        - Love Language: ${userA.loveLanguage}
        - Interests: ${userA.interests.join(", ")}
        - Goals: ${userA.relationshipGoals}
        
        User B Profile:
        - Name: ${userB.name}
        - Age: ${userB.age}
        - Personality Type: ${userB.personalityType}
        - Love Language: ${userB.loveLanguage}
        - Interests: ${userB.interests.join(", ")}
        - Goals: ${userB.relationshipGoals}

        Compatibility Game Context:
        They played a Choice / Rock Paper Scissors match-sync. Record: ${JSON.stringify(gameRecord)}
        
        Answer Comparison:
        ${JSON.stringify(answers, null, 2)}
        
        Please generate a comprehensive, highly sensitive, romantic yet deeply intellectual Compatibility Report. Use realistic, human, cozy, and poetic language. Keep feedback valuable, authentic and balanced. Include green flags (things they align on wonderfully), red/amber flags (gentle friction points), growth instructions and suggested activities.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite relationship therapist and empathetic couples coach specialized in scientific compatibility and romantic psychology. Be supportive, deeply insightful, cozy, and articulate.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallPercentage: { type: Type.INTEGER },
              emotionalScore: { type: Type.INTEGER },
              communicationScore: { type: Type.INTEGER },
              lifestyleScore: { type: Type.INTEGER },
              loveLanguageMatch: { type: Type.STRING },
              relationshipDynamics: { type: Type.STRING },
              greenFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
              growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              compatibilityAdvice: { type: Type.STRING },
              suggestedActivities: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: [
              "overallPercentage",
              "emotionalScore",
              "communicationScore",
              "lifestyleScore",
              "loveLanguageMatch",
              "relationshipDynamics",
              "greenFlags",
              "redFlags",
              "growthAreas",
              "compatibilityAdvice",
              "suggestedActivities"
            ]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json({ response: { ...fallbackResponse, ...parsedData }, simulated: false });
    } catch (err: any) {
      console.error("Gemini Compatibility error:", err);
      res.json({ response: fallbackResponse, simulated: true, error: err.message });
    }
  });

  // 2. Chat Icebreaker API
  app.post("/api/gemini/icebreakers", async (req: Request, res: Response) => {
    const { userA, userB } = req.body;

    const fallbackIcebreakers = [
      `Since you both absolutely love the movie side, if you on average had to choose: custom popcorn creation or aesthetic review writing?`,
      `With music being a huge bonding highlight for both of you, what is one song that immediately shifts your emotional mood on a rainy day?`,
      `Would you rather attempt to cook a highly detailed meal together and fail beautifully, or order takeout and review it like high-end restaurant food?`
    ];

    try {
      const client = getGeminiClient();
      if (!client) {
        return res.json({ icebreakers: fallbackIcebreakers, simulated: true });
      }

      const prompt = `
        Create exactly 3 romantic, engaging, and personalized conversation starters/icebreakers for:
        Profile A: Name: ${userA.name}, Interests: ${userA.interests.join(", ")}, Personality: ${userA.personalityType}
        Profile B: Name: ${userB.name}, Interests: ${userB.interests.join(", ")}, Personality: ${userB.personalityType}
        
        Focus heavily on mutual hobbies/interests and keep them intriguing, playful, and soulful. Avoid generic dating prompts. Format the output as a clean JSON representation containing an array of strings.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the ultimate digital wingman, producing original, highly charming, custom conversation prompts that feel exceptionally natural and captivating.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              icebreakers: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["icebreakers"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json({ icebreakers: parsedData.icebreakers || fallbackIcebreakers, simulated: false });
    } catch (err: any) {
      console.error("Gemini Icebreaker error:", err);
      res.json({ icebreakers: fallbackIcebreakers, simulated: true });
    }
  });

  // 3. AI Love Advice Assistant (Chatbot)
  app.post("/api/gemini/love-advice", async (req: Request, res: Response) => {
    const { prompt, chatHistory } = req.body;

    try {
      const client = getGeminiClient();
      if (!client) {
        // Fallback simulated advice response
        const fallbackReplies = [
          "Healthy communication is like a shared playlist — it requires active synchronization, listening to the subtle beats, and being ready to skip a chord if it grates on the mood.",
          "Remember that love in a digital world still thrives on organic pauses. Finding the joy of gentle moments, long walks, and simple validation builds the ultimate security.",
          "Friction isn't a red flag automatically; it is simply a boundary asking to be polished. Treat emotional differences as a beautiful map wait to be fully explored together."
        ];
        const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
        return res.json({ advice: `💖 *SouLSynC Advisor response (Simulation Mode):*\n\nYour question touches something very sweet. ${randomReply}\n\n*Why not try our Couple's Quizzes or the Stone-Paper-Scissors interactive challenge to reveal your alignment today?*`, simulated: true });
      }

      // Reconstruct simple chat history for context
      const historyContext = chatHistory && chatHistory.length > 0
        ? chatHistory.map((h: any) => `${h.role === "user" ? "User" : "SouLSynC Assistant"}: ${h.text}`).join("\n")
        : "";

      const queryPrompt = `
        Chat History:
        ${historyContext}
        
        New query: ${prompt}
        
        Generate a thoughtful, empathetic, cozy, and highly professional relationship advice response. Talk directly to the user as a warm, supportive presence.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: queryPrompt,
        config: {
          systemInstruction: "You are 'Aiden', the designated SouLSynC AI Love Advisor, specializing in sweet, clear, modern emotional counseling. Use gentle emojis, construct cozy metaphors, and inspire constructive relationship milestones."
        }
      });

      res.json({ advice: response.text || "I am listening closely. How can I assist your heart today?", simulated: false });
    } catch (err: any) {
      console.error("Gemini Love Advice error:", err);
      res.json({ advice: `💖 (Simulation mode fallback) I am here to help you sync. Connecting emotionally begins with holding an open, authentic conversation with your partner about expectation levels. Ask them what their comfort boundary looks like.`, simulated: true });
    }
  });

  // 4. Shared AI Playlist Generator API
  app.post("/api/gemini/playlist", async (req: Request, res: Response) => {
    const { userA, userB } = req.body;

    const fallbackPlaylist = {
      tracks: [
        { title: "Sweet Adeline", artist: "Elliott Smith", genre: "Indie Folk", vibes: ["Cozy", "Nostalgic"] },
        { title: "Pluto Projector", artist: "Rex Orange County", genre: "Bedroom Pop", vibes: ["Dreamy", "Ethereal"] },
        { title: "First Day of My Life", artist: "Bright Eyes", genre: "Acoustic Romantic", vibes: ["Warm", "Intimate"] },
        { title: "Mystery of Love", artist: "Sufjan Stevens", genre: "Indie Pop", vibes: ["Vulnerable", "Sunset Glow"] },
        { title: "Lover", artist: "Taylor Swift", genre: "Pop Acoustic", vibes: ["Cozy Love", "Festive"] }
      ]
    };

    try {
      const client = getGeminiClient();
      if (!client) {
        return res.json({ response: fallbackPlaylist, simulated: true });
      }

      const prompt = `
        Create a 5-song mutual romantic playlist tailored to:
        User A music tastes/interests: ${(userA.favoriteMusic || []).join(", ")}, ${(userA.interests || []).join(", ")}
        User B music tastes/interests: ${(userB.favoriteMusic || []).join(", ")}, ${(userB.interests || []).join(", ")}

        Synthesize their tastes to create a beautiful digital tape. Output exactly 5 real songs with active title, artist, genre, and dynamic emotional vibes (as a short array).
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the ultimate sweet audio DJ, tailoring romantic playlist recommendations merging different acoustic genres elegantly.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tracks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    artist: { type: Type.STRING },
                    genre: { type: Type.STRING },
                    vibes: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "artist", "genre", "vibes"]
                }
              }
            },
            required: ["tracks"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || "{}");
      res.json({ response: parsedData.tracks ? parsedData : fallbackPlaylist, simulated: false });
    } catch (err: any) {
      console.error("Gemini Playlist error:", err);
      res.json({ response: fallbackPlaylist, simulated: true });
    }
  });

  // Serve static UI assets and route requests
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SouLSynC full-stack development server running on http://0.0.0.0:${PORT}`);
    // Warm up Gemini client
    getGeminiClient();
  });
}

startServer();
