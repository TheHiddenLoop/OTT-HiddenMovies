import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import admin from "./routes/admin.js";
import movieRouter from "./routes/movie.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const PORT=process.env.PORT || 3000;
const app=express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/admin",admin);
app.use("/api/movie",movieRouter);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));



async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected");
  app.listen(3000, () => {
    console.log("http://localhost:3000");
  });
}

main();