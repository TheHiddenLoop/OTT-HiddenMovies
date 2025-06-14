import { DetailsMovie, Movie } from "../model/movie.js";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

export const movieList = async (req, res) => {
  try {
    const movie = await Movie.find({});
    if (movie == undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Movie not found." });
    }
    res.json({ success: true, message: "Movie list fetched", movie: movie });
  } catch (error) {
    console.error("Movie fetching Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const watchMovie = async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    const files = await mongoose.connection.db
      .collection("uploads.files")
      .findOne({ filename: req.params.filename });
    if (!files) {
      return res.status(404).json({ success: false, error: "Video not found" });
    }

    res.set({
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${req.params.filename}"`,
      "Accept-Ranges": "bytes",
    });
    
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
    res.set({ "Content-Type": "video/mp4", "Accept-Ranges": "bytes" });
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ success: false, error: "Video streaming failed" });
  }
};

export const movieDetails = async (req, res) => {
  try {
const id = req.params.id;

const movie = await DetailsMovie.findOne({ movieId: id }).populate('movieId');
    if (!movie) {
      return res
        .status(400)
        .json({ success: false, message: "Movie not found." });
    }
    res.json({ success: true, message: "Movie details", movies: movie });
  } catch (error) {
    console.error("Error movie:", error);
    res.status(500).json({ success: false, error: "Movie details failed" });
  }
};


export const getImages=async (req, res) => {
    try {
        const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
        const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
        res.set('Content-Type', 'image/jpeg');
        downloadStream.pipe(res);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(404).json({ success: false, error: 'Image not found' });
    }
}


export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const details = await DetailsMovie.findOne({ movieId: id });
    const movie = await Movie.findById(id);

    if (!movie || !details) {
      return res.status(404).json({ success: false, message: "Movie not found." });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });

    const deleteFileByName = async (filename) => {
      const file = await mongoose.connection.db.collection("uploads.files").findOne({ filename });
      if (file) {
        await bucket.delete(file._id); 
      }
    };

    await deleteFileByName(movie.imageFilename);
    await deleteFileByName(movie.videoFilename);
    for (const screenshot of details.screenshots) {
      await deleteFileByName(screenshot);
    }

    await Movie.findByIdAndDelete(id);
    await DetailsMovie.deleteOne({ movieId: id });

    return res.status(200).json({ success: true, message: "Movie deleted successfully." });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return res.status(500).json({ success: false, message: "Movie deletion failed." });
  }
};
