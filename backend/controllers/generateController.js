import { prisma } from "../config/prismaClient.js";
import pdfParse from 'pdf-parse';

async function generateTextPost(req, res) {
    try {
        const data = req.body.textInput;

        console.log(`Text data: ${data}`);
        return res.json({

        });
    } catch (err) {
        console.error(`Error posting text data for generating: `, err);
    }
}

async function generateFilePost(req, res) {
    try {
        const buffer = req.file.buffer;
        pdfParse(buffer).then((data) => {
            console.log(data.text);
        });

        return res.json({

        });
    } catch (err) {
        console.error(`Error posting file data for generating: `, err);
    }
}

export const generateController = {
    generateTextPost,
    generateFilePost,
}