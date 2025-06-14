import Admin from "../model/admin.js";
import {adminToken} from "../utils/generateToken.js";
import {DetailsMovie, Movie} from "../model/movie.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }
        const admin = await Admin.findOne({ username });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid username or password." });
        }

        adminToken(admin._id, res); 

        return res.status(200).json({ success: true, message: "Admin logged in successfully" });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const uploadMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      release_date,
      country,
      summary,
      storyline,
      formats,
      subtitle,
      size,
      quality,
    } = req.body;

    const languages = req.body.languages ? req.body.languages.split(",") : [];
    const cast = req.body.cast ? req.body.cast.split(",") : [];
    const imageFile = req.files["image"][0];
    const videoFile = req.files["video"][0];
    const screenshotFiles = req.files["screenshots"] || [];

    const movie = new Movie({
      title,
      description,
      genre,
      imageFilename: imageFile.filename,
      videoFilename: videoFile.filename,
    });
    await movie.save();

    const detailsMovie = new DetailsMovie({
      movieId: movie._id, 
      release_date,
      country,
      summary,
      storyline,
      languages,
      formats,
      subtitle,
      size,
      quality,
      cast,
      screenshots: screenshotFiles.map((file) => file.filename),
    });

    await detailsMovie.save();

    return res.status(201).json({
      success: true,
      message: "Movie uploaded successfully",
      movieId: movie._id,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
};