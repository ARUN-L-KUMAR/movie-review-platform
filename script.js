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

// Global Variables
let selectedMovieId = null;
let selectedRating = 0;

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

// Search Movies Function
async function searchMovies() {
    const searchTerm = searchInput.value.trim();
    
    if (!searchTerm) {
        alert('Please enter a movie title to search');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}&s=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.Response === 'True') {
            displayMovieResults(data.Search);
        } else {
            movieResults.innerHTML = `
                <div class="placeholder">
                    <p>No movies found. Please try another search term.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        movieResults.innerHTML = `
            <div class="placeholder">
                <p>Error fetching movies. Please try again later.</p>
            </div>
        `;
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
                <button class="details-button" data-imdbid="${movie.imdbID}">View Details</button>
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
            displayMovieDetails(movie, imdbID);
            selectedMovieId = imdbID;
            
            // Reset rating and review form
            setSelectedRating(0);
            reviewText.value = '';
            
            // Show modal
            movieModal.classList.remove('hidden');
        } else {
            alert('Error loading movie details');
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Error loading movie details');
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
                    <p class="movie-details-year">${movie.Year}</p>
                    <p class="movie-details-plot">${movie.Plot}</p>
                    <p class="movie-details-rating">IMDb Rating: ${movie.imdbRating || 'N/A'}</p>
                    <p><strong>Genre:</strong> ${movie.Genre || 'N/A'}</p>
                    <p><strong>Director:</strong> ${movie.Director || 'N/A'}</p>
                    <p><strong>Actors:</strong> ${movie.Actors || 'N/A'}</p>
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
        alert('No movie selected');
        return;
    }
    
    if (selectedRating === 0) {
        alert('Please select a rating');
        return;
    }
    
    const review = reviewText.value.trim();
    if (!review) {
        alert('Please write a review');
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
    
    alert('Review submitted successfully!');
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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('Movie Review App initialized');
});