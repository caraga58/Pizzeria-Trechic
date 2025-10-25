import { GoogleGenAI, Type } from "@google/genai";
import type { PizzaOfTheDayType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Defines the JSON schema for the "Pizza of the Day" to ensure structured output from the model.
const pizzaOfTheDaySchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: {
            type: Type.STRING,
            description: "Il nome creativo e accattivante della pizza, in italiano."
        },
        description: {
            type: Type.STRING,
            description: "Una breve descrizione in italiano che faccia venire l'acquolina in bocca, massimo 2 frasi."
        },
        ingredients: {
            type: Type.ARRAY,
            description: "Un elenco degli ingredienti principali della pizza, in italiano.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["recipeName", "description", "ingredients"],
};

/**
 * Generates a unique "Pizza of the Day" recipe using the Gemini API.
 * @returns A promise that resolves to a PizzaOfTheDayType object.
 * @throws An error if the AI service is not configured or if the API call fails.
 */
export const generatePizzaOfTheDay = async (): Promise<PizzaOfTheDayType> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Inventa una ricetta unica e deliziosa per la 'Pizza del Giorno' per una pizzeria italiana. Sii creativo e usa ingredienti di alta qualità. Fornisci un nome, una breve descrizione e un elenco di ingredienti. La risposta deve essere in italiano.",
            config: {
                responseMimeType: "application/json",
                responseSchema: pizzaOfTheDaySchema,
                temperature: 0.8, // Increase creativity
            },
        });

        const jsonText = response.text.trim();
        const generatedPizza: PizzaOfTheDayType = JSON.parse(jsonText);
        
        return generatedPizza;

    } catch (error) {
        console.error("Error generating Pizza of the Day with Gemini:", error);
        // Provide a user-friendly error message.
        throw new Error("Non è stato possibile generare la Pizza del Giorno. Riprova più tardi.");
    }
};
