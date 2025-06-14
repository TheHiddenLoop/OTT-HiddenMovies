const videoSource = document.getElementById("videoSource");

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('filename');
// videoSource.src = `/api/movie/watch/movie/${filename}`;


const watchMovie = async () => {
    try {
        const res = await fetch(`/api/movie/details/movie/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.success) {
            console.log(data);
            document.querySelector(".movie-name").innerHTML = `Movie Name: ${data.movies.movieId.title}`;
            document.getElementById("videoPlayer").src = `/api/movie/watch/movie/${data.movies.movieId.videoFilename}`;
            document.getElementById("download-btn").href = `/api/movie/watch/movie/${data.movies.movieId.videoFilename}`;
document.getElementById("download-btn").setAttribute("download", "");


        }
    } catch (error) {
        console.error("Error in watch movie", error);

    }
}

document.addEventListener("DOMContentLoaded", () => {
    watchMovie();
})