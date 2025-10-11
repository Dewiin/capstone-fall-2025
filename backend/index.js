import express from "express";
import passport from "passport";
import cors from "cors"
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// routers
import { indexRouter } from "./routes/indexRouter.js";
import { generateRouter } from "./routes/generateRouter.js";
import { accountRouter } from "./routes/accountRouter.js";
import { studySetRouter } from "./routes/studySetRouter.js";

// config
import { sessionConfig } from "./config/sessionConfig.js";
import "./config/passportConfig.js"
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({
    origin: (origin, ctx) => {
        const allowed = [
            "http://127.0.0.1:5173", 
            "http://localhost:5173", 
            "https://brainstorm-frontend-c89t.onrender.com",
            "https://app.brainstorm-app.com",
        ];
        if (!origin || allowed.includes(origin)) {
            ctx(null, true);
        } else {
            ctx(new Error("Not allowed by CORS: ", origin));
        }
    },
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionConfig);
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", indexRouter);
app.use("/api/account", accountRouter);
app.use("/api/generate", generateRouter);
app.use("/api/study-set", studySetRouter);
app.use((req, res) => {
	res.status(404).json({ error: "Not Found" });
});

// Run
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on Port ${PORT}!`));