import { Router } from "express";
import { login, uploadMovie } from "../controllers/admin.js";
import {movieList} from "../controllers/movie.js"
import upload from "../middleware/upload.js"; 
import {protectRoute} from "../middleware/adminAuth.js"

const adminRouter = Router();

adminRouter.post("/login/admin", login);

adminRouter.post("/upload/movie", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "screenshots", maxCount: 5 }
]), uploadMovie);
adminRouter.get("/upload/list",protectRoute, movieList);

export default adminRouter;
