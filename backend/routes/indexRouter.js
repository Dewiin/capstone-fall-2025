import passport from "passport";
import { Router } from "express";
import { indexController } from "../controllers/indexController.js";
export const indexRouter = Router();

indexRouter.get("/", indexController.indexGet);

// error validation for new users
indexRouter.post("/validate/signup", indexController.validateSignup);

// local auth
indexRouter.post("/login", indexController.loginPost);
indexRouter.post("/signup", indexController.signupPost);
indexRouter.post("/logout", indexController.logoutPost);

// google auth
indexRouter.get('/auth/google',
    passport.authenticate('google', { 
        scope: ['profile'],
        prompt: 'select_account', 
    })
);
indexRouter.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: "http://localhost:5173/login" }),
    (req, res) => {
        res.redirect("http://localhost:5173");
    }
);
