import { prisma } from "../config/prismaClient.js"

async function accountGet(req, res) {
    try {
        const { userId } = req.params;

        const userStudySets = await prisma.studySet.findMany({
            where: {
                userId,
            }
        });

        return res.json({
            userStudySets,
        });

    } catch (err) {
        console.error(`Error getting account page: `, err);
    }
}

export const accountController = {
    accountGet,
}