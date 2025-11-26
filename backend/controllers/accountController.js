import { prisma } from "../config/prismaClient.js"
import bcrypt from "bcryptjs"

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
                    },
                    orderBy: {
                        createdAt: "desc",
                    }
                },
                attempts: true,
                favorites: {
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
                        user: true,
                        favoritedBy: true,
                    },
                },
                followers: {
                    include: {
                        follower: true,
                    }
                },
                following: {
                    include: {
                        following: true,
                    }
                },
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

async function editPost(req, res) {
    try {
        const user = req.user;
        const { userId, studySetId } = req.params;
        const { studySetName, studySetVisibility } = req.body;


        if(user.id !== userId) {
            return res.json({
                status: 0,
            });
        }

        const studySet = await prisma.studySet.update({
            where: {
                id: parseInt(studySetId),
            },
            data: {
                name: studySetName,
                public: studySetVisibility,
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
                user: true,
                favoritedBy: true,
            }
        })

        if(studySet) {
            return res.json({
                status: 1,
                studySet,
            });
        }
        
        return res.json({
            status: 0,
        });
    } catch (err) {
        console.error(`Error editing study set for user: `, err);
        return res.json({
            status: 0,
        });
    }
}

async function followersSearch(req, res) {
    try {
        const { userId } = req.params;
        const { search_query } = req.query;

        const userFollowers = await prisma.userFollow.findMany({
            where: {
                followingId: userId,
                follower: {
                    displayName: {
                        contains: search_query,
                        mode: "insensitive"
                    }
                }
            },
            include: {
                follower: true,
            }
        });

        if(userFollowers) {
            return res.json({
                status: 1,
                userFollowers,
            });
        }
        return res.json({
            status: 0,
        })
    } catch (err) {
        console.error(`Error handling search request for user's followers tab: `, err);
        return res.json({
            status: 0,
        });
    }
}   

async function followingSearch(req, res) {
    try {
        const { userId } = req.params;
        const { search_query } = req.query;

        const userFollowing = await prisma.userFollow.findMany({
            where: {
                followerId: userId,
                following: {
                    displayName: {
                        contains: search_query,
                        mode: "insensitive",
                    }
                }
            },
            include: {
                following: true,
            }
        });

        if(userFollowing) {
            return res.json({
                status: 1,
                userFollowing,
            });
        }

        return res.json({
            status: 0,
        })
    } catch (err) {
        console.error(`Error handling search request for user's following tab: `, err);
        return res.json({
            status: 0,
        });
    }
}

async function editDisplayName(req, res) {
    try {
        const user = req.user;
        const { displayName } = req.body;

        const newUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                displayName,
            }
        });

        if(newUser) {
            return res.json({
                status: 1,
                displayName: newUser.displayName,
            });
        }
        return res.json({
            status: 0,
        });
    } catch (err) {
        console.error(`Error updating user's display name: `, err);
        return res.json({
            status: 0,
        });
    }
}

async function editPassword(req, res) {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;

        const account = await prisma.user.findUnique({
            where: {
                id: user.id,
            }
        });
        const isValid = await bcrypt.compare(currentPassword, account.password);
        if (!isValid) {
            return res.json({
                status: 0,
                message: "Current password is incorrect.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            }
        });

        return res.json({
            status: 1,
            message: "Password updated successfully",
        });
    } catch (err) {
        console.error(`Error updating user's password: `, err);
        return res.json({
            status: 0,
            message: "Error updating password",
        });
    }
}

async function resetAccount(req, res) {
    try {
        const user = req.user;

        await prisma.$transaction([
            // delete study sets
            prisma.studySet.deleteMany({
                where: {
                    userId: user.id,
                }
            }),
            // delete quiz attempts
            prisma.quizAttempt.deleteMany({
                where: {
                    userId: user.id,
                }
            }),
            // delete favorites 
            prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    favorites: {
                        set: [],
                    }
                }
            })
        ]);

        return res.json({
            status: 1,
        });
    } catch (err) {
        console.error(`Error resetting user's account: `, err);
        return res.json({
            status: 0,
        });
    }
}

async function deleteAccount(req, res) {
    try {
        const user = req.user;

        await prisma.$transaction([
            // delete favorites
            prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    favorites: {
                        set: []
                    }
                }
            }),
            // delete followers / following
            prisma.userFollow.deleteMany({
                where: {
                    OR: [
                        { followerId: user.id },
                        { followingId: user.id },
                    ],
                },
            }),
            // delete account
            prisma.user.delete({
                where: {
                    id: user.id,
                }
            }),
        ]);

        req.session.destroy(err => {
            if (err) {
                console.error("Failed to destroy session:", err);
                return res.json({ 
                    status: 0, 
                });
            }

            res.clearCookie("connect.sid");
            return res.json({ 
                status: 1, 
            });
        });
    } catch (err) {
        console.error(`Error deleting user's account: `, err);
        return res.json({
            status: 0,
        });
    }
}

export const accountController = {
    accountGet,
    favoritePost,
    editPost,
    followersSearch,
    followingSearch,
    editDisplayName,
    editPassword,
    resetAccount,
    deleteAccount
}