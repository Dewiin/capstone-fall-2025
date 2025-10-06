import { GoogleGenAI, Type } from "@google/genai"
import "dotenv/config"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function textInputDeck(text) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an AI model designed to generate study flash cards from a text input. If the text
        has no meaning, or if no material can be generated from the text, set the 'status' to the integer 0. 
        Otherwise, set the 'status' to the integer 1. Here is the text:
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

async function textInputQuiz(deck) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an AI model designed to generate a quiz from an object. The object represents a deck of flash cards. Return one quiz with 
        quizQuestions and quizOptions (a, b, c, d). The answer to the quizQuestion should be a character (a, b, c, d). Try to generate as many questions 
        as the amount of flash cards in the deck object. If the object has a status of 0, or if no material can be generated from the object, 
        set the of your response 'status' to the integer 0. Otherwise, set the 'status' to the integer 1. Here is the object:
        ${deck}
        `,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    status: {
                        type: Type.INTEGER,
                    },
                    quiz: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                quizQuestion: {
                                    type: Type.STRING,
                                },                  
                                quizOptions: {
                                    type: Type.OBJECT,
                                    properties: {
                                        a: {
                                            type: Type.STRING,
                                        },
                                        b: {
                                            type: Type.STRING,
                                        },
                                        c: {
                                            type: Type.STRING,
                                        },
                                        d: {
                                            type: Type.STRING,
                                        },  
                                    },
                                    propertyOrdering: ["a", "b", "c", "d"],
                                },
                                answer: {
                                    type: Type.STRING,
                                },
                            },
                            propertyOrdering: ["quizQuestion", "quizOptions", "answer"],
                        }
                    }
                },
                propertyOrdering: ["status", "quiz"],
            }
        }
    });
    
    const result = JSON.parse(response.text);

    return result;
}

export const gemini = {
    textInputDeck,
    textInputQuiz
}