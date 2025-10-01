import { Router } from "express";
import { generateController } from "../controllers/generateController.js";
export const generateRouter = Router();

generateRouter.post("/text", generateController.generateTextPost);
generateRouter.post("/pdf", generateController.generateFilePost);