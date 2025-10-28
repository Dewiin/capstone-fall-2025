import { prisma } from "../config/prismaClient.js";
import { gemini } from "../services/geminiModel.js";

async function generateTextPost(req, res) {
    try {
        const text = req.body.textInput;
        const user = req.user
        const { studySetName } = req.body;
        const { difficulty } = req.body;
        const { visibility } = req.body;
       
        const deckResult = await gemini.textInputDeck(text);
        const quizResult = await gemini.generateQuiz(JSON.stringify(deckResult), difficulty);

        if(deckResult.status == 1 && quizResult.status == 1) {
            const categories = deckResult.categories;

            // create study set
            const studySet = await prisma.studySet.create({
                data: {
                    name: studySetName,
                    userId: user.id,
                    category: categories,
                    difficulty: difficulty.toUpperCase(),
                    public: (visibility === "public"),
                }
            });

            // create deck belonging to -> study set
            const deck = await prisma.deck.create({
                data: {
                    studySetId: studySet.id,
                }
            });

            // create each flash card belonging to -> deck
            deckResult.flashCards.forEach( async (flashCard) => {
                await prisma.flashcard.create({
                    data: {
                        question: flashCard.cardFront,
                        answer: flashCard.cardBack,
                        deckId: deck.id,
                    }
                });
            });

            // create quiz belonging to -> user
            const quiz = await prisma.quiz.create({
                data: {
                    studySetId: studySet.id,
                    highScore: 0,
                }
            });

            // create quizQuestions belonging to -> quiz
            quizResult.quiz.forEach(async (question) => {
                await prisma.quizQuestion.create({
                    data: {
                        question: question.quizQuestion,
                        choices: question.quizOptions,
                        correctAnswer: question.answer,
                        quizId: quiz.id,
                    } 
                });
            });

            return res.json({
                status: 1,
                studySetId: studySet.id,
            });
        }
        return res.json({
            status: 0,
        });
    } catch (err) {
        console.error(`Error posting text data for generating: `, err);
        return res.json({
            status: 0,
        });
    }
}

async function generateFilePost(req, res) {
    try {
        const pdfData = req.file;
        const user = req.user
        const { studySetName } = req.body;
        const { difficulty } = req.body;
        const { visibility } = req.body;

        const deckResult = await gemini.pdfInputDeck(pdfData);
        const quizResult = await gemini.generateQuiz(JSON.stringify(deckResult), difficulty);

        if(deckResult.status == 1 && quizResult.status == 1) {
            const categories = deckResult.categories;

            // create study set
            const studySet = await prisma.studySet.create({
                data: {
                    name: studySetName,
                    userId: user.id,
                    category: categories,
                    difficulty: difficulty.toUpperCase(),
                    public: (visibility === "public"),
                }
            });

            // create deck belonging to -> study set
            const deck = await prisma.deck.create({
                data: {
                    studySetId: studySet.id,
                }
            });

            // create each flash card belonging to -> deck
            deckResult.flashCards.forEach( async (flashCard) => {
                await prisma.flashcard.create({
                    data: {
                        question: flashCard.cardFront,
                        answer: flashCard.cardBack,
                        deckId: deck.id,
                    }
                });
            });

            // create quiz belonging to -> user
            const quiz = await prisma.quiz.create({
                data: {
                    studySetId: studySet.id,
                    highScore: 0,
                }
            });

            // create quizQuestions belonging to -> quiz
            quizResult.quiz.forEach(async (question) => {
                await prisma.quizQuestion.create({
                    data: {
                        question: question.quizQuestion,
                        choices: question.quizOptions,
                        correctAnswer: question.answer,
                        quizId: quiz.id,
                    } 
                });
            });

            return res.json({
                status: 1,
                studySetId: studySet.id,
            });
        }
        return res.json({
            status: 0,
        });
    } catch (err) {
        console.error(`Error posting file data for generating: `, err);
        return res.json({
            status: 0,
        });
    }
}

export const generateController = {
    generateTextPost,
    generateFilePost,
}