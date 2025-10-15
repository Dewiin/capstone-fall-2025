import { prisma } from "../config/prismaClient.js";

async function exploreGet(req, res) {
  try {
    const categoryCounts = await prisma.studySet.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      where: {
        public: true,
      }
    });

    const studySets = await prisma.studySet.findMany({
      // where: {
      //   public: true,
      // },
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
      },
      orderBy: {
        favoritedBy: {
          _count: "desc",
        }
      },
      take: 4,
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

async function resultGet(req, res) {
  try {

  } catch (err) {
    console.error(`Error retrieving results from database: `, err);
  }
}

export const exploreController = {
  exploreGet,
  resultGet
}