document.addEventListener("DOMContentLoaded", () => {
    initializeAdmin();
});

let allMovies = [];

const initializeAdmin = () => {
    setupNavigation();
    setupFormHandler();
    loadMovies();
};

const setupNavigation = () => {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            
            item.classList.add('active');
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
};

const setupFormHandler = () => {
    const form = document.getElementById('uploadMovieForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleUpload(form);
    });
};

// Handle movie upload
const handleUpload = async (form) => {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.btn');
    
    try {
        submitBtn.textContent = 'Uploading...';
        submitBtn.disabled = true;
        
        const response = await fetch('/api/admin/upload/movie', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Movie uploaded successfully!');
            form.reset();
            loadMovies(); 
        } else {
            alert('Upload failed: ' + (result.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
    } finally {
        submitBtn.textContent = 'Upload Movie';
        submitBtn.disabled = false;
    }
};

const loadMovies = async () => {
    try {
        const response = await fetch('/api/admin/upload/list', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials:"include"
        });
        
        const data = await response.json();
        
        if (data.success && data.movie) {
            allMovies = data.movie;
            console.log(allMovies);
            
            displayMovies(allMovies);
        } else {
            showTableMessage('Failed to load movies');
            window.location.href="authentication.html"
            
        }
    } catch (error) {
        console.error('Error loading movies:', error);
        showTableMessage('Failed to load movies');
    }
};

// Display movies in table
const displayMovies = (movies) => {
    const tbody = document.querySelector('#movieTable tbody');
    
    if (movies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading-message">No movies found</td></tr>';
        return;
    }
    
    tbody.innerHTML = movies.map(movie => `
        <tr>
            <td>${movie._id || 'Untitled'}</td>
            <td>${movie.title || 'N/A'}</td>
            <td>${movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td>${movie.genre || 'N/A'}</td>
            <td>
                <button class="delete-btn" onclick="deleteMovie('${movie._id}', '${movie.title}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
};

const searchMovies = () => {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        displayMovies(allMovies);
        return;
    }
    
    const filteredMovies = allMovies.filter(movie => 
        (movie.title && movie.title.toLowerCase().includes(query)) ||
        (movie.genre && movie.genre.toLowerCase().includes(query))
    );
    
    displayMovies(filteredMovies);
};

const deleteMovie = async (id, movieTitle) => {
    if (!confirm(`Are you sure you want to delete "${movieTitle}"?`)) {
        return;
    }
    try {
        const response = await fetch(`/api/movie/delete/movie/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
            alert('Movie deleted successfully!');
            loadMovies();
        }
    } catch (error) {
        alert('Delete failed');
    }
};

const showTableMessage = (message) => {
    const tbody = document.querySelector('#movieTable tbody');
    tbody.innerHTML = `<tr><td colspan="5" class="loading-message">${message}</td></tr>`;
};

document.getElementById('search-input')?.addEventListener('input', () => {
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(searchMovies, 300);
});