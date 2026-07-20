import express from 'express';
import { GoogleGenAI } from "@google/genai";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

let ai: GoogleGenAI | null = null;

function getAiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is not configured");
    }
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        timeout: 30000, // Increase timeout to 30 seconds
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

router.post("/generate-excerpt", protect, async (req, res) => {
  try {
    const { content, title } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const prompt = `Write a concise, compelling SEO meta description (maximum 160 characters) for a blog post titled "${title || 'Untitled'}". 
    The description should summarize the following content and encourage readers to click. 
    Content: ${content.substring(0, 5000)}`;

    const aiClient = getAiClient();
    const response = await aiClient.models.generateContent({ 
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert SEO specialist and copywriter. Your goal is to write high-converting meta descriptions that are under 160 characters.",
      },
    });

    const excerpt = response.text?.trim() || "";
    res.json({ excerpt });
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    res.status(500).json({ error: error.message || "Failed to generate excerpt" });
  }
});

export default router;
