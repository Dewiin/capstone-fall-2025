import { prisma } from "../config/prismaClient.js";

async function studySetGet(req, res) {
    try {
        const { studySetId } = req.params;
        const user = req.user;

        // get study set
        const studySet = await prisma.studySet.findUnique({
            where: {
                id: parseInt(studySetId),
            },
            include: {
                deck: {
                    include: {
                        cards: true,
                    }
                },
                quiz: {
                    include: {
                        questions: true,
                        attempts: {
                            where: {
                                userId: user.id,
                            }
                        }
                    }
                }
            }
        });

        // // get study set's deck
        // const deck = await prisma.deck.findUnique({
        //     where: {
        //         studySetId: parseInt(studySetId),
        //     },
        //     include: {
        //         cards: true,
        //     }
        // });

        // // get study set's quiz
        // const quiz = await prisma.quiz.findUnique({
        //     where: {
        //         studySetId: parseInt(studySetId),
        //     },
        //     include: {
        //         questions: true,
        //         attempts: {
        //             where: {
        //                 userId: user.id,
        //             }
        //         }
        //     }
        // })

        const allQuizAttempts = await prisma.quizAttempt.findMany({
            where: {
                quizId: studySet.quiz.id
            }
        });

        if (studySet) {
            // global quiz progress stats
            const globalAttempts = allQuizAttempts.length;
            
            let globalCumulativeScore = 0;
            allQuizAttempts.forEach((attempt) => {
                globalCumulativeScore += attempt.score;
            });
            const globalAverageScore = (globalCumulativeScore / globalAttempts).toFixed(2);

            // user quiz progress stats
            const userAttempts = studySet.quiz.attempts.length;

            let userCumulativeScore = 0;
            studySet.quiz.attempts.forEach((attempt) => {
                userCumulativeScore += attempt.score;
            });

            const userAverageScore = (userCumulativeScore / userAttempts).toFixed(2);

            return res.json({
                status: 1,
                studySet,
                globalAttempts,
                globalAverageScore,
                userAverageScore
            });
        }
        return res.json({
            status: 0,
        });
    } catch (err) {
        console.error(`Error getting study set from database: `, err);
        return res.json({
            status: 0,
        });
    }
}

async function studySetUpdate(req, res) {
    try {
        const { studySetId } = req.params;
        const { score } = req.body;
        const user = req.user;
        
        let quiz = await prisma.quiz.findUnique({
            where: {
                studySetId: parseInt(studySetId),
            },
        });


        if(!quiz) {
            return res.json({
                status: 0,
            })
        } 

        if(score > quiz.highScore) {
            await prisma.quiz.update({
                where: {
                    studySetId: parseInt(studySetId),
                },
                data: {
                    highScore: score,
                }
            });
        }

        await prisma.quizAttempt.create({
            data: {
                score,  
                userId: user.id,
                quizId: quiz.id,
            }
        });

        quiz = await prisma.quiz.findUnique({
            where: {
                studySetId: parseInt(studySetId),
            },
            include: {
                questions: true,
                attempts: {
                    where: {
                        userId: user.id,
                    }
                }
            }
        });

        return res.json({
            status: 1,
            quiz,
        });
        
    } catch (err) {
        console.error(`Error updating quiz score: `, err);
        return res.json({
            status: 0,
        })
    }
}

async function studySetDelete(req, res) {
    try {
    const { studySetId } = req.params;

    const studySet = await prisma.studySet.delete({
        where: {
            id: parseInt(studySetId),
        }
    });

    if(studySet) {
        return res.json({
            status: 1,
        });
    }
    return res.json({
        status: 0,
    });

    } catch (err) { 
        console.error(`Error deleting study set: `, err);
        return res.json({
            status: 0,
        });
    }
}

export const studySetController = {
    studySetGet,
    studySetUpdate,
    studySetDelete
}