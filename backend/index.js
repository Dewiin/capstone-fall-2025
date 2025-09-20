import express from "express";
import passport from "passport";
import cors from "cors"
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { indexRouter } from "./routes/indexRouter.js";
    
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5173"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", indexRouter);
// app.use("/api/account", accountRouter);
// app.use("/api/generate", generateRouter);
app.use((req, res) => {
	res.status(404).json({ error: "Not Found" });
});

// Run
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on Port ${PORT}!`));