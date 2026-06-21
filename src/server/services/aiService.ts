import { GoogleGenAI } from "@google/genai";
import { ServiceError } from "@/server/http/errors";
import type { AiRequest } from "@/server/validators/ai";

function getGenAI(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured on the server.");
    }
    return new GoogleGenAI({ apiKey });
}

/**
 * Proxy a generation request to Gemini. Returns `{ result }`; throws a
 * ServiceError carrying the original status/message contract on failure.
 */
export async function runAi({ action, prompt, schema }: AiRequest): Promise<{ result: unknown }> {
    try {
        const ai = getGenAI();

        if (action === "structured") {
            if (!schema) {
                throw new ServiceError(400, { error: "Schema is required for structured action" });
            }
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    responseSchema: schema as any,
                    temperature: 0.7,
                },
            });
            const text = response.text;
            if (!text) {
                throw new ServiceError(500, { error: "No text returned from Gemini" });
            }
            try {
                return { result: JSON.parse(text) };
            } catch {
                throw new ServiceError(500, { error: "Gemini returned malformed JSON" });
            }
        }

        if (action === "text") {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
            });
            return { result: response.text || "" };
        }

        if (action === "image") {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-preview-image-generation",
                contents: prompt,
                config: { responseModalities: ["TEXT", "IMAGE"] },
            });
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData && part.inlineData.data) {
                    return { result: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` };
                }
            }
            throw new ServiceError(500, { error: "No image generated from Gemini" });
        }

        throw new ServiceError(400, { error: "Invalid action" });
    } catch (err) {
        if (err instanceof ServiceError) throw err;
        console.error("API AI Route Error:", err);
        const msg = err instanceof Error ? err.message : "Internal Server Error";
        throw new ServiceError(500, { error: msg || "Internal Server Error" });
    }
}
