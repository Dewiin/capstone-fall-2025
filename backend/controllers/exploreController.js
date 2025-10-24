import { prisma } from "../config/prismaClient.js";

async function exploreGet(req, res) {
  try {
    const categories = [
      "SCIENCE", 
      "MATH", 
      "HISTORY", 
      "LANGUAGE", 
      "TECHNOLOGY", 
      "ART", 
      "BUSINESS", 
      "OTHER"
    ];

    const categoryCounts = {};

    for (const category of categories) {
      categoryCounts[category] = await prisma.studySet.count({
        where: {
          public: true,
          category: {
            has: category,
          }
        }
      });
    }

    const studySets = await prisma.studySet.findMany({
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
        user: true,
        favoritedBy: true,
      },
      orderBy: {
        favoritedBy: {
          _count: "desc",
        }
      },
      // take: 6,
    });

    if(studySets) {
      return res.json({
        status: 1,
        studySets, 
        categoryCounts,
      })
    }
    return res.json({
      status: 0
    });
  } catch (err) {
    console.error(`Error retrieving category information from database: `, err);
  }
}

async function filterCategory(req, res) {
  try {
    const { filter } = req.query;

    const studySets = await prisma.studySet.findMany({
      where: {
        public: true,
        category: {
          has: filter,
        }
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
      }, 
      orderBy: {
        favoritedBy: {
          _count: "desc",
        }
      },
    });

    return res.json({
      studySets,
    });
  } catch (err) {
    console.error(`Error retrieving results for category: `, err);
  }
}

async function resultGet(req, res) {
  try {
    const { search_query } = req.query;

    const studySets = await prisma.studySet.findMany({
      where: {
        public: true,
        OR: [
          {
            name: {
              contains: search_query,
              mode: "insensitive",
            },
          },
          {
            user: {
              displayName: {
                contains: search_query,
              }
            }
          }
        ]
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
      }, 
      orderBy: {
        favoritedBy: {
          _count: "desc",
        }
      },
    });

    return res.json({
      studySets,
    });
  } catch (err) {
    console.error(`Error retrieving results from database: `, err);
  }
}

export const exploreController = {
  exploreGet,
  filterCategory,
  resultGet
}