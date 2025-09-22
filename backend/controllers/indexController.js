import passport from "passport";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prismaClient.js";

async function indexGet(req, res) {
    try {
        if(req.isAuthenticated()) {
            return res.json({ 
                loggedIn: true, 
                id: req.user.id, 
                username: req.user.username, 
                displayName: req.user.displayName 
            });
        } 
        return res.json({ loggedIn: false });
    } catch (err) {
        console.error("Error loading home page: ", err);
        res.status(500).json({ error: "Home page failed" });
    }
}

async function loginPost(req, res) {
    try {
        return res.json({
            loggedIn: true, 
            id: req.user.id, 
            username: req.user.username, 
            displayName: req.user.displayName 
        })
    } catch (err) {
        console.error( `Error logging in user: `, err);
        res.status(500).json({ error: "Login failed" });
    }
}

async function signupPost(req, res, next) {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                displayName: username,
                provider: "local"
            },
        });

        req.login(user, (err) => {
            if (err) {
                return next(err);
            } 

            return res.json({
                loggedIn: true,
                user: {
                    id: user.id,
                    username: user.username,
                    displayName: user.displayName,
                }
            });
        });
    } catch (err) {
        console.error(`Error signing up user: `, err);
        res.status(500).json({ error: "Signup failed" });
    }
}

async function validateSignup(req, res) {
    try {
        const { username } = req.body;

        const userExists = await prisma.user.findUnique({
            where: {
                username,
            }
        });

        return res.json({ exists: Boolean(userExists) });
    }
    catch (err) {
        console.error(`Error validating signup: `, err);
        res.status(500).json({ error: "Signup validation failed" });
    }
}

function logoutPost(req, res, next) {
    try {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
		    return res.json({
                loggedIn: false,
            });
	    });
    } catch (err) {
        console.error(`Error logging out: `, err);
        res.status(500).json({ error: "Error logging out" });
    }
}

export const indexController = {
    indexGet,
    loginPost: [
        passport.authenticate("local"),
        loginPost
    ],
    signupPost,
    validateSignup,
    logoutPost
}