import { Router } from "express";
import { profileController } from "../controllers/profileController.js";
export const profileRouter = Router();

profileRouter.get("/:userId", profileController.profileGet);
profileRouter.post("/follow/:followId", profileController.followPost);
profileRouter.post("/:userId/search/followers", profileController.followersSearch);
profileRouter.post("/:userId/search/following", profileController.followingSearch);