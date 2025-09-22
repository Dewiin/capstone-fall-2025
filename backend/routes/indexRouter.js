import { Router } from "express";
import { indexController } from "../controllers/indexController.js";
export const indexRouter = Router();

indexRouter.get("/", indexController.indexGet);
indexRouter.post("/validate/signup", indexController.validateSignup);
indexRouter.post("/login", indexController.loginPost);
indexRouter.post("/signup", indexController.signupPost);
indexRouter.post("/logout", indexController.logoutPost);
