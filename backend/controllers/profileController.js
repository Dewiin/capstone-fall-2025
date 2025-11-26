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
                followers: {
                    include: {
                        follower: {
                            include: {
                                studySets: {
                                    where: {
                                        public: true,
                                    }
                                },
                                attempts: true,
                                favorites: {
                                    where: {
                                        public: true,
                                    }
                                },
                            }
                        },
                    }
                },
                following: {
                    include: {
                        following: {
                            include: {
                                studySets: {
                                    where: {
                                        public: true,
                                    }
                                },
                                attempts: true,
                                favorites: {
                                    where: {
                                        public: true,
                                    }
                                },
                            }
                        },
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

        const existing = await prisma.userFollow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: user.id,
                    followingId: followId
                }
            }
        });

        if(existing) {
            await prisma.userFollow.delete({
                where: {
                    id: existing.id
                }
            });
            return res.json({
                status: 1,
                action: "unfollow"
            })
        }

        const userFollow = await prisma.userFollow.create({
            data: {
                followerId: user.id,
                followingId: followId,
            },
            include: {
                follower: {
                    include: {
                        studySets: {
                            where: {
                                public: true,
                            }
                        },
                        attempts: true,
                        favorites: {
                            where: {
                                public: true,
                            }
                        }
                    }
                },
                following: {
                    include: {
                        studySets: {
                            where: {
                                public: true,
                            }
                        },
                        attempts: true,
                        favorites: {
                            where: {
                                public: true,
                            }
                        }
                    }
                },
            }
        });

        if(userFollow) {
            return res.json({
                status: 1,
                action: "follow",
                userFollow
            });
        }
        return res.json({
            status: 0,
        });
    } catch (err) {
        console.error(`Error submitting follow request: `, err);
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
                follower: {
                    include: {
                        studySets: {
                            where: {
                                public: true,
                            },
                        },
                        attempts: true,
                        favorites: {
                            where: {
                                public: true,
                            }
                        }
                    }
                },
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
                following: {
                    include: {
                        studySets: {
                            where: {
                                public: true,
                            }
                        },
                        attempts: true,
                        favorites: {
                            where: {
                                public: true,
                            }
                        }
                    }
                },
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

export const profileController = {
    profileGet,
    followPost,
    followersSearch,
    followingSearch
}