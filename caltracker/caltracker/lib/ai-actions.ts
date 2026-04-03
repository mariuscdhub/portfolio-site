"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function generateFoodNutritionAI(foodName: string) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error("La clé API GOOGLE_GENERATIVE_AI_API_KEY est manquante dans .env.local");
    }

    try {
        const result = await generateObject({
            model: google("gemini-2.5-flash"),
            system: "Tu es un nutritionniste expert. On te donne un nom d'aliment. Tu dois retourner ses valeurs nutritionnelles (calories, protéines) pour 100g, à la fois pour la version crue et la version cuite. Si l'aliment cible ne change pas à la cuisson ou ne se mange que d'une façon (ex: huile, pomme), mets les mêmes valeurs pour cru et cuit.",
            prompt: `Analyse et donne-moi les macros pour 100g de : ${foodName}`,
            schema: z.object({
                raw: z.object({
                    calories: z.number().describe("Calories pour 100g (cru)"),
                    protein: z.number().describe("Protéines en g pour 100g (cru)")
                }),
                cooked: z.object({
                    calories: z.number().describe("Calories pour 100g (cuit)"),
                    protein: z.number().describe("Protéines en g pour 100g (cuit)")
                }),
                displayName: z.string().describe("Nom de l'aliment proprement formaté (ex: Poulet, Riz Basmati)")
            }),
        });

        return result.object;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Impossible d'analyser cet aliment avec l'IA.");
    }
}

export async function analyzeFoodImageAI(imageBase64: string) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        throw new Error("La clé API GOOGLE_GENERATIVE_AI_API_KEY est manquante dans .env.local");
    }

    try {
        // Remove data uri prefix if present (e.g., 'data:image/jpeg;base64,')
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        
        // Ensure image is parsed as a buffer
        const buffer = Buffer.from(base64Data, "base64");

        const result = await generateObject({
            model: google("gemini-2.5-flash"),
            system: "Tu es un nutritionniste expert doté d'une vision parfaite. On te donne la photo d'un repas ou d'un aliment. Tu dois identifier l'aliment principal, estimer son poids total en grammes, et les calories et protéines associées. Précise aussi si c'est cru ou cuit.",
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Analyse ce repas et donne-moi les estimations nutritionnelles (nom, poids estimé en grammes, calories totales, protéines totales) :' },
                        {
                            type: 'image',
                            image: buffer,
                        },
                    ],
                },
            ],
            schema: z.object({
                displayName: z.string().describe("Nom du plat ou de l'aliment (ex: Saumon et Brocolis)"),
                estimatedWeight: z.number().describe("Poids total estimé en grammes"),
                calories: z.number().describe("Calories totales estimées pour la portion entière"),
                protein: z.number().describe("Protéines totales estimées en grammes pour la portion entière"),
                type: z.enum(['cru', 'cuit']).describe("Etat de l'aliment (généralement cuit pour un repas)"),
            }),
        });

        return result.object;
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Impossible d'analyser cette image avec l'IA.");
    }
}

