import { Router } from "express";
import { accountController } from "../controllers/accountController.js";
export const accountRouter = Router();

accountRouter.get("/:userId", accountController.accountGet);