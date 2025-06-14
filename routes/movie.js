import { Router } from "express";
import { movieList, watchMovie, movieDetails, getImages, deleteMovie } from "../controllers/movie.js";

const movieRouter = Router();

movieRouter.get("/movie/list", movieList);
movieRouter.get("/watch/movie/:filename", watchMovie);
movieRouter.get("/details/movie/:id", movieDetails);
movieRouter.get("/images/:filename", getImages);
movieRouter.delete("/delete/movie/:id", deleteMovie);

export default movieRouter;
