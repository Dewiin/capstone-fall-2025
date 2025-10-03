import { prisma } from "../config/prismaClient.js";

async function studySetGet(req, res) {
    try {
        const { studySetId } = req.params;

        // get study set
        const studySet = await prisma.studySet.findUnique({
            where: {
                id: parseInt(studySetId),
            }
        })

        // get study set's deck
        const deck = await prisma.deck.findUnique({
            where: {
                studySetId: parseInt(studySetId),
            },
            include: {
                cards: true,
            }
        });

        // get study set's quiz
        const quiz = await prisma.quiz.findUnique({
            where: {
                studySetId: parseInt(studySetId),
            },
            include: {
                questions: true,
            }
        })

        if (deck || quiz) {
            return res.json({
                status: 1,
                studySet,
                deck,
                quiz,
            });
        }
        return res.json({
            status: 0,
        })
    } catch (err) {
        console.error(`Error getting study set from database: `, err);
        return res.json({
            status: 0,
        })
    }
}


export const studySetController = {
    studySetGet,
}