import { GoogleGenAI, Type } from "@google/genai"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function textInput(text) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an AI model designed to generate study flash cards from a text input. If the text
        has no meaning, or if no material can be generated from the text, set status to be the integer 0. 
        Otherwise, set the status to the integer 1. Here is the text:
        ${text}
        `,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    status: {
                        type: Type.INTEGER,
                    },
                    flashCards: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                cardFront: {
                                    type: Type.STRING,
                                },                  
                                cardBack: {
                                    type: Type.STRING,
                                }
                            },
                            propertyOrdering: ["cardFront", "cardBack"],
                        }
                    }
                },
                propertyOrdering: ["status", "flashCards"],
            }
        }
    });
    
    const result = JSON.parse(response.text);

    return result;
}

export const gemini = {
    textInput,
}