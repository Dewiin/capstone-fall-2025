import { prisma } from "../config/prismaClient.js"

async function accountGet(req, res) {
    try {
        const { userId } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                studySets: {
                    include: {
                        deck: {
                            include: {
                                cards: true,
                            }
                        }
                    }
                },
                attempts: true,
            }
        })

        if(user) {
            const userStudySets = user.studySets;

            let flashcardCount = 0;
            userStudySets.forEach((studySet) => {
                flashcardCount += studySet.deck.cards.length;
            });

            const attemptCount = user.attempts.length;

            const createdAt = user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            return res.json({
                status: 1,
                userStudySets,
                flashcardCount,
                attemptCount,
                createdAt,
            });
        }
        return res.json({
            status: 0,
        });
    } catch (err) {
        console.error(`Error getting account page: `, err);
        return res.json({
            status: 0,
        })
    }
}

export const accountController = {
    accountGet,
}