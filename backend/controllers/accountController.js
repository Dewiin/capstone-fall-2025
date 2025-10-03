import { prisma } from "../config/prismaClient.js"

async function accountGet(req, res) {
    try {
        const { userId } = req.params;

        const userStudySets = await prisma.studySet.findMany({
            where: {
                userId,
            }
        });

        if(userStudySets) {
            return res.json({
                status: 1,
                userStudySets,
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