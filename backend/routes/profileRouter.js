import { Router } from "express";
import { profileController } from "../controllers/profileController.js";
export const profileRouter = Router();

profileRouter.get("/:userId", profileController.profileGet);