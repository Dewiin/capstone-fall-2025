import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from "./prismaClient.js";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

export const sessionConfig = expressSession({
	cookie: {
		maxAge: 7 * 24 * 60 * 60 * 1000, 
		sameSite: isProduction ? "none" : "lax",
		secure: isProduction,
	},
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	store: new PrismaSessionStore(prisma, {
		checkPeriod: 2 * 60 * 1000, 
		dbRecordIdIsSessionId: true,
		dbRecordIdFunction: undefined,
		createIfNotExists: true,
	}),
});