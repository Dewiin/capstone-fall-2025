import { prisma } from "../config/prismaClient.js";
import { gemini } from "../services/geminiModel.js";

async function generateTextPost(req, res) {
    try {
        const text = req.body.textInput;
        const user = req.user
        const { studySetName } = req.body;
       
        const deckResult = await gemini.textInputDeck(text);
        const quizResult = await gemini.textInputQuiz(text);
        console.log(quizResult);

        // console.log(result);

        if(deckResult.status == 1 && quizResult.status == 1) {
            // create study set
            const studySet = await prisma.studySet.create({
                data: {
                    name: studySetName,
                    userId: user.id,
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
        else {
            return res.json({
                status: 0,
            });
        }
    } catch (err) {
        console.error(`Error posting text data for generating: `, err);
    }
}

async function generateFilePost(req, res) {
    try {
        const buffer = req.file.buffer;

        return res.json({

        });
    } catch (err) {
        console.error(`Error posting file data for generating: `, err);
    }
}

export const generateController = {
    generateTextPost,
    generateFilePost,
}