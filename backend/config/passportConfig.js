import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from "./prismaClient.js";
import passport from "passport"
import bcrypt from "bcryptjs";
import "dotenv/config";

// LocalStrategy callback
async function localVerifyCallback(username, password, done) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username,
			},
		});
		if (!user) {
			return done(null, false, { message: "Username not found." });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return done(null, false, { message: "Incorrect username or password" });
		}

		return done(null, user);
	} catch (err) {
		return done(err);
	}
}

// GoogleStrategy callback
async function googleVerifyCallback(accessToken, refreshToken, profile, cb) {
    try {
        let user = await prisma.user.findUnique({
            where: { 
                username: profile.id,
            },
        });

        if (!user) {
            user = await prisma.user.create({
				data: {
					username: profile.id,
					displayName: profile.displayName,
					provider: "google",
				},
            });
        }

        cb(null, user);
    } catch (err) {
        cb(err);
    }
}


// Config
passport.use(new LocalStrategy(localVerifyCallback));
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ["profile"]
},
googleVerifyCallback
));

// Serialization
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } });

		done(null, user);
	} catch (err) {
		done(err);
	}
});