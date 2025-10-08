import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from "./prismaClient.js";
import "dotenv/config";

export const sessionConfig = expressSession({
	cookie: {
		maxAge: 7 * 24 * 60 * 60 * 1000, 
		secure: true,
		sameSite: "none",
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