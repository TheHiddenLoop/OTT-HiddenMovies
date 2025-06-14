const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const movieDetails = async () => {
    try {
        const res = await fetch(`/api/movie/details/movie/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.success) {
            const movie = data.movies;
            console.log(data);


            const safeJoin = (arr, sep = ", ") => Array.isArray(arr) ? arr.join(sep) : "N/A";
            const formatDate = (isoDate) => {
                if (!isoDate) return "N/A";
                const date = new Date(isoDate);
                return date.toDateString();
            };

            document.title = `${movie.title || "Movie"} Download | HiddenMovies`;

            document.getElementById("movie-title").textContent = `🎬 Download "${movie.title}" (Multi Audio)`;
            document.getElementById("movie-description").textContent =
                `Stream or download "${movie.title}" in stunning 480p, 720p, and 1080p quality — now available in multi-audio formats including ${safeJoin(movie.languages)}.`;

            document.getElementById("movie-poster").src = movie.movieId.imageFilename
                ? `/api/movie/images/${movie.movieId.imageFilename}`
                : "default.svg";
            document.getElementById("movie-poster").alt = `${movie.title} Poster`;

            document.getElementById("release-date").textContent = formatDate(movie.release_date);
            document.getElementById("summary").textContent = movie.summary || "Summary is currently unavailable.";
            document.getElementById("country").textContent = movie.country || "N/A";
            document.getElementById("languages").textContent = safeJoin(movie.languages);

            // Series Details Section
            document.getElementById("full-name").textContent = movie.movieId.title || "N/A";
            document.getElementById("multi-audio").textContent = safeJoin(movie.languages);
            document.getElementById("released-year").textContent = movie.release_date?.split("-")[0] || "N/A";
            document.getElementById("size").textContent = `${movie.size || "Unknown"} MB`;
            document.getElementById("quality").textContent = movie.quality || "N/A";
            document.getElementById("source").textContent = "HiddenMovies"; // static or dynamic
            document.getElementById("genres").textContent = movie.movieId.genre || "N/A";
            document.getElementById("cast").textContent = safeJoin(movie.cast);
            document.getElementById("format").textContent = movie.formats || "N/A";
            document.getElementById("subtitle").textContent = movie.subtitle || "N/A";

            // Storyline
            document.getElementById("storyline").textContent = movie.storyline || movie.description || "Storyline will be added soon.";

            // Screenshots (3)
            const screenshots = movie.screenshots || [];
            if (screenshots.length >= 3) {
                document.getElementById("screenshot1").src = `/api/movie/images/${screenshots[0]}`;
                document.getElementById("screenshot1").alt = `${movie.title} Screenshot 1`;

                document.getElementById("screenshot2").src = `/api/movie/images/${screenshots[1]}`;
                document.getElementById("screenshot2").alt = `${movie.title} Screenshot 2`;

                document.getElementById("screenshot3").src = `/api/movie/images/${screenshots[2]}`;
                document.getElementById("screenshot3").alt = `${movie.title} Screenshot 3`;
            } else {
                document.querySelector(".screenshots").innerHTML += `<p>No screenshots available for this movie.</p>`;
            }

            // Download Section
            const downloadSection = document.querySelector(".download-button");
            downloadSection.addEventListener("click",()=>{
                window.location.href = `/watchMovie.html?filename=${movie.movieId._id}`;
            })
        } else {
            document.querySelector(".container").innerHTML = `<h2>Movie not found. Please check the link or try again later.</h2>`;
        }

    } catch (error) {
        console.error("Error fetching movie details:", error);
        document.querySelector(".container").innerHTML = "<h2>Failed to load movie details. Try refreshing the page.</h2>";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    movieDetails();
});
