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
    // Add animation when closing modal
    movieModal.style.opacity = '0';
    setTimeout(() => {
        movieModal.classList.add('hidden');
        movieModal.style.opacity = '1';
    }, 300);
});

window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.style.opacity = '0';
        setTimeout(() => {
            movieModal.classList.add('hidden');
            movieModal.style.opacity = '1';
        }, 300);
    }
});

// Star rating event listeners
starRating.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        const rating = parseInt(e.target.getAttribute('data-rating'));
        setSelectedRating(rating);
        
        // Add animation to stars
        const stars = starRating.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.transform = 'scale(1)';
        });
        
        setTimeout(() => {
            e.target.style.transform = 'scale(1.3)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 200);
        }, 50);
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
    
    // Add animation to results container
    movieResults.style.opacity = '0';
    setTimeout(() => {
        movieResults.style.opacity = '1';
    }, 300);
    
    try {
        const response = await fetch(`${API_URL}&s=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.Response === 'True') {
            displayMovieResults(data.Search);
        } else {
            movieResults.innerHTML = `
                <div class="placeholder">
                    <i class="fas fa-search fa-4x"></i>
                    <p>No movies found. Please try another search term.<br><small>Try searching for popular movies like "Inception" or "The Matrix"</small></p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        movieResults.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-exclamation-triangle fa-4x"></i>
                <p>Error fetching movies. Please try again later.<br><small>Check your internet connection</small></p>
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
    
    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        // Add animation delay for each card
        movieCard.style.animationDelay = `${index * 0.1}s`;
        
        // Handle missing poster
        const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/cccccc/ffffff?text=No+Image';
        
        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x450/cccccc/ffffff?text=No+Image'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year"><i class="fas fa-calendar-alt"></i> ${movie.Year}</p>
                <p class="movie-plot"><i class="fas fa-tag"></i> ${movie.Type}</p>
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
            
            // Show modal with animation
            movieModal.classList.remove('hidden');
            movieModal.style.opacity = '0';
            setTimeout(() => {
                movieModal.style.opacity = '1';
            }, 50);
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
    const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/250x370/cccccc/ffffff?text=No+Image';
    
    movieDetails.innerHTML = `
        <div class="movie-details-container">
            <div class="movie-details-header">
                <img src="${poster}" alt="${movie.Title}" class="movie-details-poster" onerror="this.src='https://via.placeholder.com/250x370/cccccc/ffffff?text=No+Image'">
                <div class="movie-details-info">
                    <h2 class="movie-details-title">${movie.Title}</h2>
                    <p class="movie-details-year"><i class="fas fa-calendar-alt"></i> ${movie.Year} • <i class="fas fa-clock"></i> ${movie.Runtime || 'N/A'} • <i class="fas fa-user"></i> ${movie.Rated || 'N/A'}</p>
                    <p class="movie-details-plot">${movie.Plot}</p>
                    <p class="movie-details-rating"><i class="fas fa-star"></i> IMDb Rating: ${movie.imdbRating || 'N/A'}/10</p>
                    <div class="movie-details-meta">
                        <p><strong><i class="fas fa-theater-masks"></i> Genre:</strong> ${movie.Genre || 'N/A'}</p>
                        <p><strong><i class="fas fa-video"></i> Director:</strong> ${movie.Director || 'N/A'}</p>
                        <p><strong><i class="fas fa-pen-fancy"></i> Writer:</strong> ${movie.Writer || 'N/A'}</p>
                        <p><strong><i class="fas fa-users"></i> Actors:</strong> ${movie.Actors || 'N/A'}</p>
                        <p><strong><i class="fas fa-language"></i> Language:</strong> ${movie.Language || 'N/A'}</p>
                        <p><strong><i class="fas fa-globe-americas"></i> Country:</strong> ${movie.Country || 'N/A'}</p>
                        <p><strong><i class="fas fa-award"></i> Awards:</strong> ${movie.Awards || 'N/A'}</p>
                        <p><strong><i class="fas fa-money-bill-wave"></i> Box Office:</strong> ${movie.BoxOffice || 'N/A'}</p>
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
    
    // Add animation to submit button
    submitReview.style.transform = 'scale(0.95)';
    setTimeout(() => {
        submitReview.style.transform = 'scale(1)';
    }, 200);
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
            <h3><i class="fas fa-comments"></i> User Reviews</h3>
            <p>No reviews yet. Be the first to review this movie!</p>
        `;
        return;
    }
    
    // Sort reviews by date (newest first)
    reviews.sort((a, b) => b.id - a.id);
    
    let reviewsHTML = '<h3><i class="fas fa-comments"></i> User Reviews</h3>';
    reviewsHTML += '<div class="user-reviews-list">';
    
    reviews.forEach((review, index) => {
        // Create star display for rating
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<span class="${i <= review.rating ? 'star selected' : 'star'}">&#9733;</span>`;
        }
        
        // Add animation delay for each review
        reviewsHTML += `
            <div class="review-card" style="animation-delay: ${index * 0.1}s;">
                <div class="review-rating">${starsHTML}</div>
                <p class="review-text">${review.text}</p>
                <p class="review-date"><i class="fas fa-clock"></i> Posted on ${review.date}</p>
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
        
        // Add animation
        favoriteButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            favoriteButton.style.transform = 'scale(1)';
        }, 200);
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
        
        // Add animation
        favoriteButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            favoriteButton.style.transform = 'scale(1)';
        }, 200);
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
        
        // Add animation
        watchlistButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            watchlistButton.style.transform = 'scale(1)';
        }, 200);
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
        
        // Add animation
        watchlistButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            watchlistButton.style.transform = 'scale(1)';
        }, 200);
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
    
    favorites.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        // Add animation delay for each card
        movieCard.style.animationDelay = `${index * 0.1}s`;
        
        // Handle missing poster
        const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150x200/cccccc/ffffff?text=No+Image';
        
        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/150x200/cccccc/ffffff?text=No+Image'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year"><i class="fas fa-calendar-alt"></i> ${movie.Year}</p>
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
    
    // Add entrance animation
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Movie Review App initialized');
    displayFavorites();
    
    // Add animation to header
    const header = document.querySelector('header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        header.style.transition = 'all 0.5s ease';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
});