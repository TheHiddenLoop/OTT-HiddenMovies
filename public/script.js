document.addEventListener("DOMContentLoaded", () => {
    initializePage();
});

let allMovies = [];
let currentPage = 1;
const moviesPerPage = 20;
let totalPages = 1;
let isLoading = false;
let isSearchMode = false;

const initializePage = () => {
    getMovies();
    setupEventListeners();
};

const setupEventListeners = () => {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const searchBtn = document.getElementById("search-btn");
    const queryInput = document.getElementById("query");

    prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
    nextBtn.addEventListener("click", () => goToPage(currentPage + 1));
    searchBtn.addEventListener("click", handleSearch);
    
    queryInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    });

    queryInput.addEventListener("blur", () => {
        setTimeout(() => {
            if (queryInput.value.trim() === "") {
                resetToNormalMode();
            }
        }, 100);
    });
};

const getMovies = async () => {
    if (isLoading) return;
    
    setLoading(true);
    const cards = document.getElementById("cards");
    
    try {
        const res = await fetch("/api/movie/movie/list", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        
        const data = await res.json();
        
        if (data.success && data.movie) {
            allMovies = data.movie;
            totalPages = Math.ceil(allMovies.length / moviesPerPage);
            currentPage = 1;
            isSearchMode = false;
            
            displayMovies();
            updatePaginationControls();
            
            console.log(`Loaded ${allMovies.length} movies, ${totalPages} pages`);
        } else {
            showError("No movies found or failed to load movies.");
        }
    } catch (error) {
        console.error("Error in movie fetching", error);
        showError("Failed to load movies. Please try again later.");
    } finally {
        setLoading(false);
    }
};

const displayMovies = () => {
    const cards = document.getElementById("cards");
    cards.innerHTML = "";
    
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToShow = allMovies.slice(startIndex, endIndex);
    
    if (moviesToShow.length === 0) {
        showError("No movies to display on this page.");
        return;
    }
    
    moviesToShow.forEach(movie => {
        const card = createMovieCard(movie);
        cards.appendChild(card);
    });
    
    cards.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const createMovieCard = (movie) => {
    const card = document.createElement("div");
    card.className = "card";
    
    const imageUrl = movie.imageFilename 
        ? `api/movie/images/${movie.imageFilename}` 
        : "/placeholder.svg?height=240&width=240";
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${movie.title || 'Movie'}" onerror="this.src='/placeholder.svg?height=240&width=240'">
        <p class="title" data-movie-id="${movie._id}">${movie.title || 'Untitled'}</p>
        <p class="description">${movie.description || 'No description available.'}</p>
    `;

    const titleElement = card.querySelector('.title');
    titleElement.addEventListener('click', (event) => {
        const movieId = event.target.getAttribute('data-movie-id');
        if (movieId) {
            window.location.href = `/movie-details.html?id=${movieId}`;
        }
    });

    return card;
};

const updatePaginationControls = () => {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");
    
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    
    if (isSearchMode) {
        pageInfo.textContent = `Search Results`;
    } else {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    if (currentPage > 1) {
        prevBtn.textContent = `← Page ${currentPage - 1}`;
    } else {
        prevBtn.textContent = "← Previous";
    }
    
    if (currentPage < totalPages) {
        nextBtn.textContent = `Page ${currentPage + 1} →`;
    } else {
        nextBtn.textContent = "Next →";
    }
};

const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages || pageNumber === currentPage) {
        return;
    }
    
    currentPage = pageNumber;
    displayMovies();
    updatePaginationControls();
};

const handleSearch = () => {
    const query = document.getElementById("query").value.trim().toLowerCase();
    
    if (!query) {
        resetToNormalMode();
        return;
    }
    
    const filteredMovies = allMovies.filter(movie => 
        (movie.title && movie.title.toLowerCase().includes(query)) ||
        (movie.description && movie.description.toLowerCase().includes(query))
    );
    
    displayFilteredMovies(filteredMovies, query);
};

const displayFilteredMovies = (filteredMovies, query) => {
    const cards = document.getElementById("cards");
    cards.innerHTML = "";
    
    if (filteredMovies.length === 0) {
        showError(`No movies found for "${query}". Try a different search term.`);
        return;
    }
    
    isSearchMode = true;
    
    filteredMovies.forEach(movie => {
        const card = createMovieCard(movie);
        cards.appendChild(card);
    });
    
    const pageInfo = document.getElementById("page-info");
    pageInfo.textContent = `Found ${filteredMovies.length} results for "${query}"`;
    
    document.getElementById("prev-btn").disabled = true;
    document.getElementById("next-btn").disabled = true;
    
    cards.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const resetToNormalMode = () => {
    document.getElementById("query").value = "";
    isSearchMode = false;
    currentPage = 1;
    displayMovies();
    updatePaginationControls();
};

const setLoading = (loading) => {
    isLoading = loading;
    const loadingElement = document.getElementById("loading");
    const cards = document.getElementById("cards");
    
    if (loading) {
        loadingElement.style.display = "flex";
        cards.style.opacity = "0.5";
    } else {
        loadingElement.style.display = "none";
        cards.style.opacity = "1";
    }
};

const showError = (message) => {
    const cards = document.getElementById("cards");
    cards.innerHTML = `
        <div style="
            width: 100%; 
            text-align: center; 
            padding: 40px; 
            color: var(--text-secondary);
            font-size: 1.1rem;
            grid-column: 1 / -1;
        ">
            <p>${message}</p>
            <button onclick="getMovies()" style="
                margin-top: 20px;
                padding: 10px 20px;
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: var(--radius-md);
                cursor: pointer;
                font-size: 0.9rem;
            ">
                Retry
            </button>
        </div>
    `;
};

const clearSearch = () => {
    resetToNormalMode();
};

window.clearSearch = clearSearch;