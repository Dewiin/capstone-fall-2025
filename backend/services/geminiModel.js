import { createPartFromUri, GoogleGenAI, Type } from "@google/genai"
import "dotenv/config"

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const deckConfig = {
    responseMimeType: "application/json",
    responseSchema: {
        type: Type.OBJECT,
        properties: {
            status: {
                type: Type.INTEGER,
            },
            categories: {
                type: Type.ARRAY,
                description: "Array of categories relevant to the study set",
                items: {
                    type:Type.STRING,
                    enum: [ 
                        "SCIENCE", 
                        "MATH",
                        "HISTORY",
                        "LANGUAGE",
                        "TECHNOLOGY",
                        "ART",
                        "BUSINESS",
                        "OTHER"
                    ]
                },
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
        required: ["status", "categories", "flashCards"],
        propertyOrdering: ["status", "categories", "flashCards"],
    }
}

const quizConfig = {
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
        required: ["status"],
        propertyOrdering: ["status", "quiz"],
    }
}

async function textInputDeck(text) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        You are an AI model designed to generate study flash cards from a given text input.
        
        Guidelines:
        1. Read and understand the text, then generate flash cards that capture the key facts, definitions, or concepts.  
        2. Each flash card should be clear, concise, and educational.  
        3. Extract only relevant and factual content from the text — skip filler or uninformative content.  
        4. Add a list of relevant categories. Categories should represent broad topics covered in the text (e.g., “Biology”, “World History”, “Economics”).  
        5. If the text has no meaningful content or cannot produce valid flash cards, set "status": 0 and leave "categories" and "flashcards" empty.
        Here is the text:
        ${text}
        `,
        config: deckConfig,
    });
    
    const result = JSON.parse(response.text);
    return result;
}

async function generateQuiz(deck, difficulty) {
    const difficultyPercentages = {
        "beginner": 50,
        "intermediate": 75,
        "advanced": 100
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
        You are an AI model designed to generate a quiz from an object. 
        The object represents a deck of flash cards.

        Guidelines:
        1. Create questions for ${difficultyPercentages[difficulty]}% of the flash cards.  
        2. Each question should test the core idea or definition from a flash card.  
        3. For each question:
        - Provide 4 answer choices (a–d).  
        - Choices must be similar in descriptiveness and relevance, meaning:
            - Each option should sound equally detailed (avoid one being overly short or long).  
            - All options should belong to the same conceptual category (e.g., all are terms, definitions, or related facts).  
        - Do not reuse answers from other flash cards as choices.  
        4. If the flash card object has a "status": 0, set "status": 0 in your response; otherwise, set "status": 1.

        Here is the object:
        ${deck}
        `,
        config: quizConfig,
    });
    
    const result = JSON.parse(response.text);
    return result;
}

async function pdfInputDeck(pdfData) {
    const fileBlob = new Blob([pdfData.buffer], { type: pdfData.mimetype });
    const file = await ai.files.upload({
        file: fileBlob,
        config: {
            displayName: pdfData.originalname,
        },
    });

    // Wait for the file to be processed.
    let getFile = await ai.files.get({ name: file.name });
    while (getFile.state === 'PROCESSING') {
        getFile = await ai.files.get({ name: file.name });
        console.log(`current file status: ${getFile.state}`);
        console.log('File is still processing, retrying in 5 seconds');

        await new Promise((resolve) => {
            setTimeout(resolve, 5000);
        });
    }
    if (file.state === 'FAILED') {
        throw new Error('File processing failed.');
    }

    // Add the file to the contents.
    const content = [
        `
        You are an AI model designed to generate study flash cards from the contents of a PDF document.

        Guidelines:
        1. Read and interpret the document carefully.
        2. Identify key terms, definitions, and concepts that can be turned into flash cards.
        3. Each flash card should capture an essential concept, fact, or relationship from the PDF.
        4. Keep terms and definitions concise, factual, and relevant to the source material.
        5. Include categories that describe the main themes or academic areas of the PDF.
        6. If the PDF is empty, irrelevant, or unreadable, set "status": 0 and leave "categories" and "flashcards" empty.
        `
    ];

    if (file.uri && file.mimeType) {
        const fileContent = createPartFromUri(file.uri, file.mimeType);
        content.push(fileContent);
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: content,
        config: deckConfig,
    });

    const result = JSON.parse(response.text);
    return result;
}

export const gemini = {
    textInputDeck,
    generateQuiz,
    pdfInputDeck,
}