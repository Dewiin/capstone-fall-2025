import express from "express";
import passport from "passport";
import cors from "cors"
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// routers
import { indexRouter } from "./routes/indexRouter.js";
import { generateRouter } from "./routes/generateRouter.js";

// config
import { sessionConfig } from "./config/sessionConfig.js";
import "./config/passportConfig.js"
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({
    origin: [
        "http://127.0.0.1:5173", 
        "http://localhost:5173", 
        "http://127.0.0.1:5174", 
        "http://localhost:5174", 
    ],
    // origin: (origin, ctx) => {
    //     console.log(origin);
    // },
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionConfig);
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", indexRouter);
// app.use("/api/account", accountRouter);
app.use("/api/generate", generateRouter);
app.use((req, res) => {
	res.status(404).json({ error: "Not Found" });
});

// Run
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on Port ${PORT}!`));