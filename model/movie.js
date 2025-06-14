import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    genre: String,
    imageFilename: String,
    videoFilename: String,
    createdAt: { type: Date, default: Date.now }
});


const detailsMovieSchema = new mongoose.Schema({
    movieId: {type: mongoose.Schema.Types.ObjectId,ref: 'Movie',required: true},
    release_date: { type: Date },
    country: String,
    summary: String,
    storyline: String,
    languages: [String],
    formats: {type: String, enum: ['HD', 'SD', '4K', 'Blu-ray', 'DVD'],default: 'HD'},
    subtitle: String,
    size: String, 
    quality: {type: String,enum: ['1080p', '720p', '480p', 'CAM', 'HDRip'],default: '1080p'
    },
    cast: [String],
    screenshots: [String], 
    createdAt: { type: Date, default: Date.now }
});

export const Movie = mongoose.model('Movie', movieSchema);
export const DetailsMovie = mongoose.model('DetailsMovie', detailsMovieSchema);
