import multer from "multer";
import { Router } from "express";
import { generateController } from "../controllers/generateController.js";
export const generateRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

generateRouter.post("/text", generateController.generateTextPost);
generateRouter.post("/pdf", upload.single("file"), generateController.generateFilePost);
generateRouter.post("/prompt", generateController.promptTextPost);
generateRouter.post("/prompt/create", generateController.promptTextGenerate);