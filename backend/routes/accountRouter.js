import { Router } from "express";
import { accountController } from "../controllers/accountController.js";
export const accountRouter = Router();

accountRouter.get("/:userId", accountController.accountGet);
accountRouter.post("/:userId/favorite/:studySetId", accountController.favoritePost);
accountRouter.post("/:userId/edit/:studySetId", accountController.editPost);
accountRouter.post("/:userId/search/followers", accountController.followersSearch);
accountRouter.post("/:userId/search/following", accountController.followingSearch);
accountRouter.put("/settings/displayName", accountController.editDisplayName);
accountRouter.put("/settings/password", accountController.editPassword);
accountRouter.post("/settings/resetAccount", accountController.resetAccount);
accountRouter.post("/settings/deleteAccount", accountController.deleteAccount);