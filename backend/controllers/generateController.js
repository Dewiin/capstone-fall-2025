import { prisma } from "../config/prismaClient.js";

async function generateTextPost(req, res) {
    try {
        const data = req.textInput;

        console.log(`Text data: ${data}`);
    } catch (err) {
        console.error(`Error posting text data for generating: `, err);
    }
}

async function generateFilePost(req, res) {
    try {
        const data = req.fileInput;

        console.log(`File data: ${data}`);
    } catch (err) {
        console.error(`Error posting file data for generating: `, err);
    }
}

export const generateController = {
    generateTextPost,
    generateFilePost,
}