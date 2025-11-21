import { prisma } from "../config/prismaClient.js"

async function profileGet(req, res) {
    try {
        const { userId } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                studySets: {
                    where: {
                        public: true,
                    },
                    include: {
                        deck: {
                            include: {
                                cards: true,
                            }
                        },
                        quiz: {
                            include: {
                                attempts: true,
                            }
                        },
                        favoritedBy: true,
                    },
                },
                attempts: true,
                favorites: {
                    where: {
                        public: true,
                    },
                    include: {
                        favoritedBy: true,
                        deck: {
                            include: {
                                cards: true,
                            }
                        },
                        quiz: {
                            include: {
                                attempts: true,
                            }
                        },
                        user: true,
                    }
                },
                followers: true,
                following: true,
            }
        })

        if(user) {
            let flashcardCount = 0;
            user.studySets.forEach((studySet) => {
                flashcardCount += studySet.deck.cards.length;
            });
            const attemptCount = user.attempts.length;
            const createdAt = user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            return res.json({
                status: 1,
                user,
                createdAt,
                flashcardCount, 
                attemptCount,
            });
        }
        return res.json({
            status: 0,
        });
    } catch (err) {
        console.error(`Error getting profile page: `, err);
        return res.json({
            status: 0,
        });
    }
}

async function followPost(req, res) {
    try {
        const user = req.user;
        const { followId } = req.params;


    } catch (err) {
        console.error(`Error submitting follow request: `, err);
        return res.json({
            status: 0,
        });
    }
}

export const profileController = {
    profileGet,
    followPost
}