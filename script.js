// API Configuration
const API_KEY = '9c4ec697'; // Your provided OMDB API key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const movieResults = document.getElementById('movieResults');
const movieModal = document.getElementById('movieModal');
const closeButton = document.querySelector('.close-button');
const starRating = document.getElementById('starRating');
const reviewText = document.getElementById('reviewText');
const submitReview = document.getElementById('submitReview');
const favoriteButton = document.getElementById('favoriteButton');
const watchlistButton = document.getElementById('watchlistButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const favoritesSection = document.getElementById('favoritesSection');
const favoritesContainer = document.getElementById('favoritesContainer');
const toastContainer = document.getElementById('toastContainer');

// Global Variables
let selectedMovieId = null;
let selectedRating = 0;
let currentMovie = null;

// Event Listeners
searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMovies();
    }
});

closeButton.addEventListener('click', () => {
    movieModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.classList.add('hidden');
    }
});

// Star rating event listeners
starRating.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        const rating = parseInt(e.target.getAttribute('data-rating'));
        setSelectedRating(rating);
    }
});

submitReview.addEventListener('click', submitUserReview);
favoriteButton.addEventListener('click', toggleFavorite);
watchlistButton.addEventListener('click', toggleWatchlist);

// Search Movies Function
async function searchMovies() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        showToast('Please enter a movie title to search', 'warning');
        return;
    }
    
    // Show loading indicator
    loadingIndicator.classList.remove('hidden');
    movieResults.innerHTML = '';
    
    try {
        const response = await fetch(`${API_URL}&s=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.Response === 'True') {
            displayMovieResults(data.Search);
        } else {
            movieResults.innerHTML = `
                <div class="placeholder">
                    <i class="fas fa-search fa-3x"></i>
                    <p>No movies found. Please try another search term.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        movieResults.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <p>Error fetching movies. Please try again later.</p>
            </div>
        `;
        showToast('Error fetching movies. Please try again later.', 'error');
    } finally {
        // Hide loading indicator
        loadingIndicator.classList.add('hidden');
    }
}

// Display Movie Results
function displayMovieResults(movies) {
    movieResults.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        // Handle missing poster
        const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';
        
        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year">${movie.Year}</p>
                <p class="movie-plot">${movie.Type}</p>
                <button class="details-button" data-imdbid="${movie.imdbID}">
                    <i class="fas fa-info-circle"></i> View Details
                </button>
            </div>
        `;
        
        movieResults.appendChild(movieCard);
    });
    
    // Add event listeners to detail buttons
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', () => {
            const imdbID = button.getAttribute('data-imdbid');
            showMovieDetails(imdbID);
        });
    });
}

// Show Movie Details
async function showMovieDetails(imdbID) {
    try {
        const response = await fetch(`${API_URL}&i=${imdbID}&plot=full`);
        const movie = await response.json();
        
        if (movie.Response === 'True') {
            currentMovie = movie;
            displayMovieDetails(movie, imdbID);
            selectedMovieId = imdbID;
            
            // Reset rating and review form
            setSelectedRating(0);
            reviewText.value = '';
            
            // Update favorite and watchlist buttons
            updateFavoriteButton(imdbID);
            updateWatchlistButton(imdbID);
            
            // Show modal
            movieModal.classList.remove('hidden');
        } else {
            showToast('Error loading movie details', 'error');
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        showToast('Error loading movie details', 'error');
    }
}

// Display Movie Details
function displayMovieDetails(movie, imdbID) {
    const movieDetails = document.getElementById('movieDetails');
    
    // Handle missing poster
    const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image';
    
    movieDetails.innerHTML = `
        <div class="movie-details-container">
            <div class="movie-details-header">
                <img src="${poster}" alt="${movie.Title}" class="movie-details-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
                <div class="movie-details-info">
                    <h2 class="movie-details-title">${movie.Title}</h2>
                    <p class="movie-details-year">${movie.Year} • ${movie.Runtime || 'N/A'} • ${movie.Rated || 'N/A'}</p>
                    <p class="movie-details-plot">${movie.Plot}</p>
                    <p class="movie-details-rating"><i class="fas fa-star"></i> IMDb Rating: ${movie.imdbRating || 'N/A'}/10</p>
                    <div class="movie-details-meta">
                        <p><strong>Genre:</strong> ${movie.Genre || 'N/A'}</p>
                        <p><strong>Director:</strong> ${movie.Director || 'N/A'}</p>
                        <p><strong>Writer:</strong> ${movie.Writer || 'N/A'}</p>
                        <p><strong>Actors:</strong> ${movie.Actors || 'N/A'}</p>
                        <p><strong>Language:</strong> ${movie.Language || 'N/A'}</p>
                        <p><strong>Country:</strong> ${movie.Country || 'N/A'}</p>
                        <p><strong>Awards:</strong> ${movie.Awards || 'N/A'}</p>
                        <p><strong>Box Office:</strong> ${movie.BoxOffice || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Display user reviews for this movie
    displayUserReviews(imdbID);
}

// Set Selected Rating
function setSelectedRating(rating) {
    selectedRating = rating;
    
    // Update star display
    const stars = starRating.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

// Submit User Review
function submitUserReview() {
    if (!selectedMovieId) {
        showToast('No movie selected', 'error');
        return;
    }
    
    if (selectedRating === 0) {
        showToast('Please select a rating', 'warning');
        return;
    }
    
    const review = reviewText.value.trim();
    if (!review) {
        showToast('Please write a review', 'warning');
        return;
    }
    
    // Create review object
    const userReview = {
        id: Date.now(), // Simple ID generation
        rating: selectedRating,
        text: review,
        date: new Date().toLocaleDateString()
    };
    
    // Save to localStorage
    saveReview(selectedMovieId, userReview);
    
    // Clear form
    setSelectedRating(0);
    reviewText.value = '';
    
    // Refresh reviews display
    displayUserReviews(selectedMovieId);
    
    showToast('Review submitted successfully!', 'success');
}

// Save Review to Local Storage
function saveReview(movieId, review) {
    // Get existing reviews for this movie
    const reviews = getUserReviews(movieId);
    
    // Add new review
    reviews.push(review);
    
    // Save back to localStorage
    localStorage.setItem(`reviews_${movieId}`, JSON.stringify(reviews));
}

// Get User Reviews from Local Storage
function getUserReviews(movieId) {
    const reviewsJSON = localStorage.getItem(`reviews_${movieId}`);
    return reviewsJSON ? JSON.parse(reviewsJSON) : [];
}

// Display User Reviews
function displayUserReviews(movieId) {
    const userReviewsContainer = document.getElementById('userReviews');
    const reviews = getUserReviews(movieId);
    
    if (reviews.length === 0) {
        userReviewsContainer.innerHTML = `
            <h3>User Reviews:</h3>
            <p>No reviews yet. Be the first to review this movie!</p>
        `;
        return;
    }
    
    // Sort reviews by date (newest first)
    reviews.sort((a, b) => b.id - a.id);
    
    let reviewsHTML = '<h3>User Reviews:</h3>';
    reviewsHTML += '<div class="user-reviews-list">';
    
    reviews.forEach(review => {
        // Create star display for rating
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<span class="${i <= review.rating ? 'star selected' : 'star'}">&#9733;</span>`;
        }
        
        reviewsHTML += `
            <div class="review-card">
                <div class="review-rating">${starsHTML}</div>
                <p class="review-text">${review.text}</p>
                <p class="review-date">Posted on ${review.date}</p>
            </div>
        `;
    });
    
    reviewsHTML += '</div>';
    userReviewsContainer.innerHTML = reviewsHTML;
}

// Toggle Favorite
function toggleFavorite() {
    if (!selectedMovieId || !currentMovie) {
        showToast('No movie selected', 'error');
        return;
    }
    
    const favorites = getFavorites();
    const isFavorite = favorites.some(movie => movie.imdbID === selectedMovieId);
    
    if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(movie => movie.imdbID !== selectedMovieId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        favoriteButton.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
        favoriteButton.classList.remove('added');
        showToast('Removed from favorites', 'success');
    } else {
        // Add to favorites
        favorites.push({
            imdbID: currentMovie.imdbID,
            Title: currentMovie.Title,
            Year: currentMovie.Year,
            Poster: currentMovie.Poster
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        favoriteButton.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
        favoriteButton.classList.add('added');
        showToast('Added to favorites!', 'success');
    }
    
    // Update favorites display
    displayFavorites();
}

// Toggle Watchlist
function toggleWatchlist() {
    if (!selectedMovieId || !currentMovie) {
        showToast('No movie selected', 'error');
        return;
    }
    
    const watchlist = getWatchlist();
    const isInWatchlist = watchlist.some(movie => movie.imdbID === selectedMovieId);
    
    if (isInWatchlist) {
        // Remove from watchlist
        const updatedWatchlist = watchlist.filter(movie => movie.imdbID !== selectedMovieId);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        watchlistButton.innerHTML = '<i class="far fa-bookmark"></i> Add to Watchlist';
        watchlistButton.classList.remove('added');
        showToast('Removed from watchlist', 'success');
    } else {
        // Add to watchlist
        watchlist.push({
            imdbID: currentMovie.imdbID,
            Title: currentMovie.Title,
            Year: currentMovie.Year,
            Poster: currentMovie.Poster
        });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        watchlistButton.innerHTML = '<i class="fas fa-bookmark"></i> Remove from Watchlist';
        watchlistButton.classList.add('added');
        showToast('Added to watchlist!', 'success');
    }
}

// Get Favorites from Local Storage
function getFavorites() {
    const favoritesJSON = localStorage.getItem('favorites');
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

// Get Watchlist from Local Storage
function getWatchlist() {
    const watchlistJSON = localStorage.getItem('watchlist');
    return watchlistJSON ? JSON.parse(watchlistJSON) : [];
}

// Update Favorite Button State
function updateFavoriteButton(movieId) {
    const favorites = getFavorites();
    const isFavorite = favorites.some(movie => movie.imdbID === movieId);
    
    if (isFavorite) {
        favoriteButton.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
        favoriteButton.classList.add('added');
    } else {
        favoriteButton.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
        favoriteButton.classList.remove('added');
    }
}

// Update Watchlist Button State
function updateWatchlistButton(movieId) {
    const watchlist = getWatchlist();
    const isInWatchlist = watchlist.some(movie => movie.imdbID === movieId);
    
    if (isInWatchlist) {
        watchlistButton.innerHTML = '<i class="fas fa-bookmark"></i> Remove from Watchlist';
        watchlistButton.classList.add('added');
    } else {
        watchlistButton.innerHTML = '<i class="far fa-bookmark"></i> Add to Watchlist';
        watchlistButton.classList.remove('added');
    }
}

// Display Favorites
function displayFavorites() {
    const favorites = getFavorites();
    favoritesContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesSection.classList.add('hidden');
        return;
    }
    
    favoritesSection.classList.remove('hidden');
    
    favorites.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        // Handle missing poster
        const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x200?text=No+Image';
        
        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/150x200?text=No+Image'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year">${movie.Year}</p>
            </div>
        `;
        
        // Add click event to show movie details
        movieCard.addEventListener('click', () => {
            showMovieDetails(movie.imdbID);
        });
        
        favoritesContainer.appendChild(movieCard);
    });
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fas fa-check-circle';
    if (type === 'error') {
        icon = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
        icon = 'fas fa-exclamation-triangle';
    }
    
    toast.innerHTML = `<i class="${icon}"></i> ${message}`;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('Movie Review App initialized');
    displayFavorites();
});