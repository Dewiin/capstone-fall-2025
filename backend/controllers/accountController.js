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
                        },
                        quiz: {
                            include: {
                                attempts: true,
                            }
                        },
                        favoritedBy: true,
                    }
                },
                attempts: true,
                favorites: {
                    include: {
                        _count: {
                            select: {
                                favoritedBy: true,
                            }
                        },
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

            const userFavorites = user.favorites;

            return res.json({
                status: 1,
                userStudySets,
                flashcardCount,
                attemptCount,
                createdAt,
                userFavorites,
            });
        }
        return res.json({
            status: 0,
        });
    } catch (err) {
        console.error(`Error getting account page: `, err);
        return res.json({
            status: 0,
        });
    }
}

async function favoritePost(req, res) {
    try {
        const user = req.user;
        const { userId, studySetId } = req.params;
        const { favorited } = req.query;

        if(user.id !== userId) {
            return res.json({
                status: 0,
            });
        }

        if (favorited === "true") {
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    favorites: {
                        disconnect: {
                            id: parseInt(studySetId),
                        }
                    }
                }
            });
        } else {
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    favorites: {
                        connect: {
                            id: parseInt(studySetId),
                        }
                    }
                }
            });
        }

        return res.json({
            status: 1,
        });
    } catch (err) {
        console.error(`Error adding favorite for user: `, err);
        return res.json({
            status: 0,
        });
    }
}

export const accountController = {
    accountGet,
    favoritePost
}