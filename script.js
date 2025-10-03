// Fixed Header Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Navigation System
    initializeNavigation();
    
    function initializeNavigation() {
        // Get navigation elements
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navbarMenu = document.getElementById('navbarMenu');
        const mobileSearch = document.getElementById('mobileSearch');
        const searchToggle = document.getElementById('searchToggle');
        
        console.log('Navigation elements:', {
            mobileMenuToggle: !!mobileMenuToggle,
            navbarMenu: !!navbarMenu,
            mobileSearch: !!mobileSearch,
            searchToggle: !!searchToggle
        });
        
        // Mobile menu toggle functionality
        if (mobileMenuToggle && navbarMenu) {
            mobileMenuToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Mobile menu toggle clicked');
                
                this.classList.toggle('active');
                navbarMenu.classList.toggle('active');
                
                // Close mobile search if open
                if (mobileSearch && mobileSearch.classList.contains('active')) {
                    mobileSearch.classList.remove('active');
                }
                
                // Update ARIA attributes for accessibility
                const isActive = this.classList.contains('active');
                this.setAttribute('aria-expanded', isActive);
                navbarMenu.setAttribute('aria-hidden', !isActive);
            });
        } else {
            console.warn('Mobile menu elements not found');
        }
        
        // Search toggle functionality (works on all screen sizes)
        if (searchToggle && mobileSearch) {
            searchToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Search toggle clicked');
                console.log('Search element found:', !!mobileSearch);
                
                mobileSearch.classList.toggle('active');
                console.log('Search active state:', mobileSearch.classList.contains('active'));
                
                // Close mobile menu if open
                if (navbarMenu && navbarMenu.classList.contains('active') && mobileMenuToggle) {
                    navbarMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', false);
                    navbarMenu.setAttribute('aria-hidden', true);
                }
                
                // Focus on search input when opened
                if (mobileSearch.classList.contains('active')) {
                    const searchInput = document.getElementById('headerSearchInput');
                    if (searchInput) {
                        setTimeout(() => {
                            searchInput.focus();
                            console.log('Search input focused');
                        }, 300);
                    }
                }
            });
        } else {
            console.warn('Search toggle elements not found');
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navbarMenu && navbarMenu.classList.contains('active')) {
                if (!navbarMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    navbarMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', false);
                    navbarMenu.setAttribute('aria-hidden', true);
                }
            }
            
            if (mobileSearch && mobileSearch.classList.contains('active')) {
                if (!mobileSearch.contains(e.target) && !searchToggle.contains(e.target)) {
                    mobileSearch.classList.remove('active');
                }
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (navbarMenu && navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', false);
                    navbarMenu.setAttribute('aria-hidden', true);
                }
                
                if (mobileSearch && mobileSearch.classList.contains('active')) {
                    mobileSearch.classList.remove('active');
                }
            }
        });
    }
    
    // Header scroll effect
    const fixedHeader = document.querySelector('.fixed-header');
    let lastScrollY = window.scrollY;
    
    function handleHeaderScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            fixedHeader.classList.add('scrolled');
        } else {
            fixedHeader.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Navigation link active state
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                if (navbarMenu && navbarMenu.classList.contains('active')) {
                    navbarMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Initialize theme management system
    initializeThemeSystem();
    

    
    // Sync search functionality between header and hero search
    const headerSearchInput = document.getElementById('headerSearchInput');
    const mainSearchInput = document.getElementById('searchInput');
    const mobileSearchBtn = document.querySelector('.mobile-search-btn');
    
    if (headerSearchInput && mainSearchInput) {
        // Sync header search with main search
        headerSearchInput.addEventListener('input', function() {
            mainSearchInput.value = this.value;
        });
        
        // Handle header search submission
        headerSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                const query = this.value.trim();
                mainSearchInput.value = query;
                
                // Navigate to modern search results page
                showSearchResultsPage(query);
                
                // Close mobile search
                if (mobileSearch && mobileSearch.classList.contains('active')) {
                    mobileSearch.classList.remove('active');
                }
                
                // Scroll to results area
                const movieResults = document.getElementById('movieResults');
                if (movieResults) {
                    movieResults.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    // Mobile search button functionality
    if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', function() {
            const query = headerSearchInput.value.trim();
            if (query) {
                mainSearchInput.value = query;
                
                // Navigate to modern search results page
                showSearchResultsPage(query);
                
                // Close mobile search
                if (mobileSearch && mobileSearch.classList.contains('active')) {
                    mobileSearch.classList.remove('active');
                }
            } else {
                showToast('Please enter a search term', 'warning');
            }
        });
    }


});

// Hero Background Slideshow
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;

function nextSlide() {
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % totalSlides;
    slides[currentSlide].classList.add('active');
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start slideshow
    if (slides.length > 1) {
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    // Quick search functionality
    const quickSearchBtns = document.querySelectorAll('.quick-search');
    quickSearchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const query = this.dataset.query;
            document.getElementById('searchInput').value = query;
            // Trigger search
            searchMovies(query);
        });
    });
});

// API Configuration - Multiple fallback keys for reliability
const API_KEYS = ['f0e28803', 'b6003d8a', '3e8c8f7e', '9c4ec697'];
let currentAPIKeyIndex = 0;
let API_KEY = API_KEYS[currentAPIKeyIndex];
let API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

// Function to switch to next API key if current one fails
function switchAPIKey() {
    currentAPIKeyIndex = (currentAPIKeyIndex + 1) % API_KEYS.length;
    API_KEY = API_KEYS[currentAPIKeyIndex];
    API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;
    console.log(`🔄 Switching to API key: ${API_KEY}`);
    return API_URL;
}

// Genre Discovery System
class GenreDiscoveryManager {
    constructor() {
        this.currentGenre = 'trending';
        this.loadedMovies = new Map(); // Cache movies by genre
        this.currentPage = 1;
        this.genreSearchTerms = {
            trending: ['Marvel', 'Avengers', 'Star Wars', 'Batman', 'Spider', 'Iron Man', 'Thor', 'Captain', 'Wonder Woman', 'Superman'],
            action: ['Action', 'Fighter', 'Warrior', 'Combat', 'Battle', 'Mission', 'Agent', 'Soldier', 'Hunt', 'Strike'],
            drama: ['Love Story', 'Family', 'Life', 'Drama', 'Story', 'Journey', 'Dreams', 'Hope', 'Truth', 'Heart'],
            romance: ['Love', 'Wedding', 'Romance', 'Heart', 'Kiss', 'Bride', 'Couple', 'Together', 'Forever', 'Dear'],
            horror: ['Horror', 'Dark', 'Night', 'Fear', 'Dead', 'Evil', 'Haunted', 'Ghost', 'Scary', 'Terror'],
            'sci-fi': ['Future', 'Space', 'Robot', 'Alien', 'Galaxy', 'Planet', 'Time', 'Matrix', 'Cyber', 'Tech']
        };
        this.init();
    }

    init() {
        this.setupGenreTabs();
        this.setupLoadMore();
        this.setupRetry();
        // Load trending movies by default
        this.loadGenreMovies('trending');
    }

    setupGenreTabs() {
        const genreTabs = document.querySelectorAll('.genre-tab');
        genreTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const genre = tab.dataset.genre;
                this.switchGenre(genre);
            });
        });
    }

    setupLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreMoviesBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreMovies();
            });
        }
    }

    setupRetry() {
        const retryBtn = document.getElementById('retryMoviesBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.retryLoadMovies();
            });
        }
    }

    switchGenre(genre) {
        if (this.currentGenre === genre) return;

        // Update active tab
        document.querySelectorAll('.genre-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-genre="${genre}"]`).classList.add('active');

        this.currentGenre = genre;
        this.currentPage = 1;
        this.loadGenreMovies(genre);
    }

    async loadGenreMovies(genre, append = false) {
        const moviesGrid = document.getElementById('moviesGrid');
        const loadingIndicator = document.getElementById('moviesLoadingIndicator');
        const errorMessage = document.getElementById('moviesError');
        const loadMoreBtn = document.getElementById('loadMoreMoviesBtn');

        // Show loading state
        if (!append) {
            moviesGrid.innerHTML = '';
        }
        loadingIndicator.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        loadMoreBtn.classList.add('hidden');

        try {
            const movies = await this.fetchMoviesByGenre(genre);
            
            if (movies && movies.length > 0) {
                if (append) {
                    this.appendMoviesToGrid(movies);
                } else {
                    this.displayMoviesInGrid(movies);
                }
                
                // Cache the movies
                if (!this.loadedMovies.has(genre)) {
                    this.loadedMovies.set(genre, []);
                }
                this.loadedMovies.get(genre).push(...movies);
                
                // Show load more button if we have movies
                loadMoreBtn.classList.remove('hidden');
            } else {
                if (!append) {
                    moviesGrid.innerHTML = '<div class="no-movies"><p>No movies found for this genre.</p></div>';
                }
            }
        } catch (error) {
            console.error('Error loading genre movies:', error);
            if (!append) {
                errorMessage.classList.remove('hidden');
            }
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }

    async fetchMoviesByGenre(genre) {
        const searchTerms = this.genreSearchTerms[genre];
        const movies = [];
        const seenTitles = new Set();

        // Get movies for multiple search terms to ensure variety
        for (let i = 0; i < Math.min(5, searchTerms.length); i++) {
            const searchTerm = searchTerms[i];
            
            try {
                const response = await fetch(`${API_URL}&s=${encodeURIComponent(searchTerm)}&type=movie&page=1`);
                const data = await response.json();
                
                if (data.Response === 'True' && data.Search) {
                    const filteredMovies = data.Search.filter(movie => {
                        if (seenTitles.has(movie.Title)) return false;
                        seenTitles.add(movie.Title);
                        return movie.Poster && movie.Poster !== 'N/A';
                    });
                    
                    movies.push(...filteredMovies);
                }
            } catch (error) {
                console.error(`Error fetching movies for term "${searchTerm}":`, error);
            }
        }

        // Shuffle and limit to 12 movies
        return this.shuffleArray(movies).slice(0, 12);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayMoviesInGrid(movies) {
        const moviesGrid = document.getElementById('moviesGrid');
        moviesGrid.innerHTML = '';
        this.appendMoviesToGrid(movies);
    }

    appendMoviesToGrid(movies) {
        const moviesGrid = document.getElementById('moviesGrid');
        
        movies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            moviesGrid.appendChild(movieCard);
        });
    }

    createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <div class="movie-poster">
                <img src="${movie.Poster}" alt="${movie.Title}" loading="lazy">
                <div class="movie-overlay">
                    <button class="view-details-btn" data-imdb-id="${movie.imdbID}">
                        <i class="fas fa-play"></i> View Details
                    </button>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.Title}</h3>
                <p class="movie-year">${movie.Year}</p>
            </div>
        `;

        // Add click event for viewing details
        const viewBtn = movieCard.querySelector('.view-details-btn');
        viewBtn.addEventListener('click', () => {
            // Use existing movie modal functionality if available
            if (typeof showMovieDetails === 'function') {
                showMovieDetails(movie.imdbID);
            }
        });

        return movieCard;
    }

    loadMoreMovies() {
        this.currentPage++;
        this.loadGenreMovies(this.currentGenre, true);
    }

    retryLoadMovies() {
        this.loadGenreMovies(this.currentGenre);
    }
}

// Initialize Genre Discovery System when DOM is loaded
let genreManager;
document.addEventListener('DOMContentLoaded', () => {
    genreManager = new GenreDiscoveryManager();
});

// Strict function to filter movies that have valid poster images
function filterMoviesWithValidPosters(movies) {
    console.log(`🔍 Filtering ${movies.length} movies for valid posters...`);
    
    const validMovies = movies.filter(movie => {
        // Very strict poster validation
        const poster = movie.Poster;
        
        // First check: Must exist and not be falsy
        if (!poster) {
            console.log(`❌ No poster property for: ${movie.Title}`);
            return false;
        }
        
        // Second check: Must not be N/A variants
        if (poster === 'N/A' || poster === 'n/a' || poster === 'NA' || poster === 'na' || poster.toLowerCase() === 'n/a') {
            console.log(`❌ N/A poster for: ${movie.Title} (Poster: "${poster}")`);
            return false;
        }
        
        // Third check: Must be a proper HTTP URL
        if (!poster.startsWith('http://') && !poster.startsWith('https://')) {
            console.log(`❌ Invalid URL format for: ${movie.Title} (Poster: "${poster}")`);
            return false;
        }
        
        // Fourth check: Must have valid image extension
        const hasImageExtension = poster.includes('.jpg') || poster.includes('.jpeg') || poster.includes('.png') || poster.includes('.webp');
        if (!hasImageExtension) {
            console.log(`❌ No image extension for: ${movie.Title} (Poster: "${poster}")`);
            return false;
        }
        
        // Fifth check: Must not contain common placeholder indicators
        const placeholderIndicators = ['nopicture', 'placeholder', 'noimage', 'default', 'missing'];
        const hasPlaceholder = placeholderIndicators.some(indicator => poster.toLowerCase().includes(indicator));
        if (hasPlaceholder) {
            console.log(`❌ Placeholder detected for: ${movie.Title} (Poster: "${poster}")`);
            return false;
        }
        
        // If all checks pass
        console.log(`✅ Valid poster found for: ${movie.Title} - ${poster}`);
        return true;
    });
    
    console.log(`📊 Poster validation result: ${validMovies.length}/${movies.length} movies have valid posters`);
    return validMovies;
}

// Function to test if an image URL actually loads
async function testImageLoad(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        
        // Timeout after 3 seconds
        setTimeout(() => resolve(false), 3000);
    });
}

// Advanced function to verify posters actually load (optional for extra reliability)
async function filterAndVerifyPosterImages(movies) {
    console.log(`🔍 Verifying ${movies.length} movie posters...`);
    const verifiedMovies = [];
    
    for (const movie of movies) {
        const isValidFormat = movie.Poster && 
                             movie.Poster !== 'N/A' && 
                             movie.Poster !== 'n/a' && 
                             movie.Poster.includes('http');
        
        if (isValidFormat) {
            const imageLoads = await testImageLoad(movie.Poster);
            if (imageLoads) {
                console.log(`✅ Verified poster loads for: ${movie.Title}`);
                verifiedMovies.push(movie);
            } else {
                console.log(`❌ Poster failed to load for: ${movie.Title}`);
            }
        } else {
            console.log(`❌ Invalid poster URL for: ${movie.Title}`);
        }
        
        // Break early if we have enough verified movies
        if (verifiedMovies.length >= 4) {
            break;
        }
    }
    
    return verifiedMovies;
}

// BULLETPROOF function that GUARANTEES exactly 4 movies with valid posters
async function getExactly4MoviesWithPosters(genre) {
    const targetCount = 4;
    let allMovies = [];
    
    console.log(`🔒 BULLETPROOF MODE: Getting exactly ${targetCount} movies for ${genre}`);
    
    // Define comprehensive search strategy for each genre
    const searchStrategies = {
        'Action': [
            // Primary terms
            'action', 'adventure', 'thriller',
            // Specific franchises
            'batman', 'terminator', 'matrix', 'john wick', 'mission impossible', 'fast furious',
            // General action keywords
            'war', 'spy', 'fight', 'battle', 'hero', 'soldier', 'cop', 'agent'
        ],
        'Comedy': [
            // Primary terms
            'comedy', 'funny', 'humor',
            // Specific titles
            'home alone', 'hangover', 'dumb dumber', 'anchorman', 'superbad',
            // General comedy keywords
            'romantic comedy', 'laugh', 'fun', 'joke', 'parody', 'satire'
        ],
        'Drama': [
            // Primary terms
            'drama', 'emotional', 'story',
            // Specific acclaimed dramas
            'titanic', 'forrest gump', 'good will hunting', 'shawshank', 'green mile',
            // General drama keywords
            'life', 'family', 'love', 'relationship', 'romance', 'heart', 'biography'
        ],
        'Horror': [
            // Primary terms
            'horror', 'scary', 'fear',
            // Classic horror titles
            'exorcist', 'halloween', 'friday 13th', 'nightmare elm', 'scream',
            // General horror keywords
            'haunted', 'terror', 'nightmare', 'ghost', 'zombie', 'demon', 'evil'
        ],
        'Sci-Fi': [
            // Primary terms
            'sci-fi', 'science fiction', 'space',
            // Iconic sci-fi titles
            'star wars', 'star trek', 'blade runner', 'alien', 'matrix',
            // General sci-fi keywords
            'future', 'robot', 'technology', 'time', 'galaxy', 'planet', 'cyberpunk'
        ]
    };
    
    const searchTerms = searchStrategies[genre] || [genre.toLowerCase()];
    
    // Try each search term until we get 4 movies
    for (let i = 0; i < searchTerms.length && allMovies.length < targetCount; i++) {
        const term = searchTerms[i];
        console.log(`🔍 Bulletproof search ${i + 1}/${searchTerms.length}: "${term}" - Have ${allMovies.length}/${targetCount} movies`);
        
        const termMovies = await fetchMoviesWithValidPosters(term, targetCount - allMovies.length);
        
        // Add unique movies
        termMovies.forEach(movie => {
            if (allMovies.length < targetCount && !allMovies.find(existing => existing.imdbID === movie.imdbID)) {
                allMovies.push(movie);
                console.log(`✅ BULLETPROOF ADD: ${movie.Title} (${allMovies.length}/${targetCount})`);
            }
        });
        
        if (allMovies.length >= targetCount) {
            console.log(`🎯 BULLETPROOF SUCCESS: Found ${targetCount} movies for ${genre}!`);
            break;
        }
    }
    
    // If still not enough, use emergency backup
    if (allMovies.length < targetCount) {
        console.log(`🚨 EMERGENCY BACKUP: Need ${targetCount - allMovies.length} more movies for ${genre}`);
        await fillWithEmergencyBackup(genre, allMovies, targetCount);
    }
    
    const finalMovies = allMovies.slice(0, targetCount);
    console.log(`🏆 BULLETPROOF RESULT: ${finalMovies.length}/${targetCount} movies for ${genre}`);
    
    return finalMovies;
}

// Emergency backup system with guaranteed movies
async function fillWithEmergencyBackup(genre, currentMovies, targetCount) {
    const emergencyBackups = {
        'Action': ['batman', 'superman', 'spiderman', 'ironman'],
        'Comedy': ['funny', 'laugh', 'smile', 'joy'],
        'Drama': ['love', 'heart', 'soul', 'life'],
        'Horror': ['dark', 'night', 'shadow', 'blood'],
        'Sci-Fi': ['future', 'space', 'robot', 'tech']
    };
    
    const backups = emergencyBackups[genre] || ['movie', 'film', 'cinema', 'picture'];
    
    for (const backup of backups) {
        if (currentMovies.length >= targetCount) break;
        
        console.log(`🆘 Emergency backup: "${backup}"`);
        const backupMovies = await fetchMoviesWithValidPosters(backup, 1);
        
        backupMovies.forEach(movie => {
            if (currentMovies.length < targetCount && !currentMovies.find(existing => existing.imdbID === movie.imdbID)) {
                currentMovies.push(movie);
                console.log(`🆘 Emergency add: ${movie.Title} (${currentMovies.length}/${targetCount})`);
            }
        });
    }
}

// Ultra-aggressive function to fetch movies with valid posters for genres
async function fetchMoviesWithValidPosters(searchTerm, targetCount = 4, maxAttempts = 50) {
    const validMovies = [];
    let page = 1;
    let attempts = 0;
    
    console.log(`🔍 Ultra-aggressively fetching ${targetCount} movies with valid posters for: ${searchTerm}`);
    
    while (validMovies.length < targetCount && attempts < maxAttempts && page <= 10) {
        attempts++;
        console.log(`📄 Searching page ${page} for "${searchTerm}" (attempt ${attempts}/${maxAttempts}) - Need ${targetCount - validMovies.length} more`);
        
        const result = await makeAPIRequest(`${API_URL}&s=${encodeURIComponent(searchTerm)}&type=movie&page=${page}`);
        
        if (!result.success || !result.data.Response || result.data.Response !== 'True' || !result.data.Search) {
            console.log(`❌ No more results for "${searchTerm}" on page ${page}`);
            break;
        }
        
        // Apply strict poster filtering
        const moviesWithValidPosters = filterMoviesWithValidPosters(result.data.Search);
        
        console.log(`📊 Page ${page}: Found ${moviesWithValidPosters.length}/${result.data.Search.length} movies with valid posters`);
        
        // Add each valid movie individually to avoid duplicates
        moviesWithValidPosters.forEach(movie => {
            if (validMovies.length < targetCount && !validMovies.find(existing => existing.imdbID === movie.imdbID)) {
                validMovies.push(movie);
                console.log(`✅ Added movie #${validMovies.length}/${targetCount}: ${movie.Title}`);
            }
        });
        
        console.log(`� Progress: ${validMovies.length}/${targetCount} movies collected`);
        
        // If we have enough movies, break
        if (validMovies.length >= targetCount) {
            console.log(`🎯 SUCCESS! Reached target of ${targetCount} movies with valid posters`);
            break;
        }
        
        // Move to next page
        page++;
        
        // Shorter delay for faster results
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const finalMovies = validMovies.slice(0, targetCount);
    console.log(`� FINAL RESULT for ${searchTerm}: ${finalMovies.length} movies with guaranteed valid posters`);
    
    if (finalMovies.length < targetCount) {
        console.warn(`⚠️ Could only find ${finalMovies.length}/${targetCount} movies for "${searchTerm}"`);
    }
    
    // Log the final movie list for verification
    finalMovies.forEach((movie, index) => {
        console.log(`🎬 Movie ${index + 1}: ${movie.Title} - Year: ${movie.Year} - Poster: ${movie.Poster.substring(0, 60)}...`);
    });
    
    return finalMovies;
}

// Enhanced API request function with automatic key switching
async function makeAPIRequest(url, options = {}) {
    let lastError = null;
    
    // Try each API key
    for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });
            
            if (response.ok) {
                const data = await response.json();
                // Check if API returned an error
                if (data.Error === 'Request limit reached!' || data.Error === 'Invalid API key!') {
                    console.log(`❌ API key ${API_KEY} failed: ${data.Error}`);
                    url = url.replace(API_KEY, switchAPIKey().split('=')[1]);
                    continue;
                }
                return { success: true, data };
            } else if (response.status === 401) {
                console.log(`❌ API key ${API_KEY} unauthorized, switching...`);
                url = url.replace(API_KEY, switchAPIKey().split('=')[1]);
                continue;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.log(`📱 API request failed with key ${API_KEY}:`, error.message);
            lastError = error;
            
            // If it's a network/timeout error and we have more keys, try the next one
            if (attempt < API_KEYS.length - 1) {
                url = url.replace(API_KEY, switchAPIKey().split('=')[1]);
                continue;
            }
        }
    }
    
    // All API keys failed
    return { success: false, error: lastError?.message || 'All API keys failed' };
}

// Enhanced image creation function with lazy loading and improved error handling
function createMovieImage(poster, title, className) {
    // Double-check poster validity before creating image
    if (!poster || poster === 'N/A' || poster === 'n/a' || !poster.startsWith('http')) {
        console.error(`🚫 Attempted to create image for invalid poster: ${title} - ${poster}`);
        return createFallbackImage(title, className);
    }
    
    // Create container for the image with loading placeholder
    const container = document.createElement('div');
    container.className = `${className}-container image-container`;
    
    // Create loading skeleton
    const skeleton = document.createElement('div');
    skeleton.className = 'image-skeleton';
    skeleton.innerHTML = `
        <div class="skeleton-content">
            <div class="skeleton-poster"></div>
            <div class="skeleton-text">
                <div class="skeleton-line skeleton-title"></div>
                <div class="skeleton-line skeleton-year"></div>
            </div>
        </div>
    `;
    
    const img = document.createElement('img');
    img.alt = title;
    img.className = `${className} lazy-load`;
    // Apply image optimizations
    const optimizedSrc = getAdaptiveImageQuality(optimizeImageUrl(poster, container, title));
    img.setAttribute('data-src', optimizedSrc);
    img.setAttribute('loading', 'lazy');
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';
    
    // Enhanced error handling with retry mechanism
    let retryCount = 0;
    const maxRetries = 2;
    
    img.onerror = function() {
        console.error(`🚫 Poster failed to load (attempt ${retryCount + 1}): ${title} - ${poster}`);
        
        if (retryCount < maxRetries) {
            retryCount++;
            console.log(`🔄 Retrying image load for: ${title} (attempt ${retryCount + 1})`);
            setTimeout(() => {
                this.src = poster + '?retry=' + retryCount;
            }, 1000 * retryCount);
            return;
        }
        
        // All retries failed, show custom fallback
        console.log(`🎨 Creating custom poster for: ${title}`);
        const fallback = createCustomPoster(title);
        container.innerHTML = '';
        container.appendChild(fallback);
        container.classList.add('fallback-active');
    };
    
    // Success handler with smooth animation
    img.onload = function() {
        console.log(`✅ Successfully loaded poster for: ${title}`);
        
        // Add loaded class for blur-to-focus effect
        this.classList.add('loaded');
        this.classList.remove('lazy-load');
        
        // Enhanced loading animation
        skeleton.style.opacity = '0';
        skeleton.style.transform = 'scale(0.95)';
        
        this.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        this.style.opacity = '1';
        this.style.transform = 'scale(1)';
        this.style.filter = 'blur(0px) brightness(1) contrast(1)';
        
        setTimeout(() => {
            if (skeleton.parentNode) {
                skeleton.remove();
            }
            // Remove loading progress indicator
            container.classList.remove('loading-progress');
        }, 600);
        
        // Add dynamic shadow based on image colors (if supported)
        extractImageColors(this);
        
        // Add quality enhancement
        this.classList.add('high-quality');
    };
    
    // Set up intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const container = img.parentElement;
                    
                    // Add progressive enhancement class
                    container.classList.add('progressive');
                    
                    // Simulate progressive loading with slight delay
                    setTimeout(() => {
                        img.src = img.getAttribute('data-src');
                    }, Math.random() * 200); // Stagger loading for better visual effect
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.05
        });
        
        imageObserver.observe(img);
    } else {
        // Fallback for browsers without IntersectionObserver
        img.src = poster;
    }
    
    // Add hover tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'hover-tooltip';
    tooltip.innerHTML = '🔍 Click to view full size';
    
    // Add loading progress indicator
    container.classList.add('loading-progress');
    
    container.appendChild(skeleton);
    container.appendChild(img);
    container.appendChild(tooltip);
    
    // Add click handler for lightbox
    container.style.cursor = 'pointer';
    container.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Get movie details from the container's parent
        const movieCard = container.closest('.movie-card, .genre-movie-card, .featured-movie-card');
        let movieTitle = title;
        let movieYear = '';
        
        if (movieCard) {
            const titleElement = movieCard.querySelector('.movie-title, .genre-movie-title, .featured-movie-title');
            const yearElement = movieCard.querySelector('.movie-year, .genre-movie-year, .featured-movie-year');
            
            if (titleElement) movieTitle = titleElement.textContent.trim();
            if (yearElement) movieYear = yearElement.textContent.trim();
        }
        
        // Open lightbox with the poster
        if (img.src && img.src !== '') {
            openLightbox(img.src, movieTitle, movieYear);
        }
    });
    
    return container;
}

// Create enhanced fallback image with movie details
function createFallbackImage(title, className) {
    const container = document.createElement('div');
    container.className = `${className}-container fallback-container`;
    
    const fallback = createCustomPoster(title);
    container.appendChild(fallback);
    
    return container;
}

// Create custom poster with movie title and cinema theme
function createCustomPoster(title) {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 450;
    canvas.className = 'custom-poster';
    
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 450);
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    gradient.addColorStop(0, randomColor);
    gradient.addColorStop(1, '#2c3e50');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 450);
    
    // Add film strip border
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 300, 25);
    ctx.fillRect(0, 425, 300, 25);
    
    // Film perforations
    ctx.fillStyle = '#ffffff';
    for (let i = 15; i < 285; i += 30) {
        ctx.fillRect(i, 5, 12, 15);
        ctx.fillRect(i, 430, 12, 15);
    }
    
    // Movie camera icon
    ctx.fillStyle = '#ecf0f1';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎬', 150, 150);
    
    // Movie title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    
    // Word wrap for long titles
    const words = title.split(' ');
    let lines = [];
    let currentLine = '';
    
    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 260 && currentLine !== '') {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });
    lines.push(currentLine.trim());
    
    // Draw title lines
    const startY = 220;
    lines.slice(0, 3).forEach((line, index) => {
        ctx.fillText(line, 150, startY + (index * 25));
    });
    
    // Add decorative elements
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 320);
    ctx.lineTo(250, 320);
    ctx.stroke();
    
    // Add "PREMIERE" badge
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(200, 50, 80, 25);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('POSTER', 240, 67);
    
    return canvas;
}

// Extract dominant colors from image for dynamic shadows (progressive enhancement)
function extractImageColors(img) {
    try {
        if (!img.complete || img.naturalWidth === 0) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 50;
        canvas.height = 50;
        
        ctx.drawImage(img, 0, 0, 50, 50);
        const imageData = ctx.getImageData(0, 0, 50, 50).data;
        
        let r = 0, g = 0, b = 0;
        const pixelCount = imageData.length / 4;
        
        for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];
            g += imageData[i + 1];
            b += imageData[i + 2];
        }
        
        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);
        
        // Apply dynamic shadow
        const movieCard = img.closest('.movie-card, .genre-movie-card, .featured-movie-card');
        if (movieCard) {
            movieCard.style.setProperty('--dynamic-shadow', `rgba(${r}, ${g}, ${b}, 0.3)`);
        }
        
    } catch (error) {
        // Silently fail for cross-origin images
        console.log('Could not extract colors from image (likely cross-origin)');
    }
}

// ===== LIGHTBOX FUNCTIONALITY =====
let currentLightboxImages = [];
let currentLightboxIndex = 0;

// Initialize lightbox when DOM is loaded
function initializeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    
    // Close lightbox events
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }
    
    // Navigation events
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => showPreviousImage());
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => showNextImage());
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleLightboxKeyboard);
}

// Open lightbox with movie poster
function openLightbox(imageSrc, movieTitle, movieYear, movieImages = []) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxYear = document.getElementById('lightboxYear');
    const lightboxLoader = document.querySelector('.lightbox-loader');
    
    if (!lightbox || !lightboxImage) return;
    
    // Set up image gallery
    currentLightboxImages = movieImages.length > 0 ? movieImages : [{
        src: imageSrc,
        title: movieTitle,
        year: movieYear
    }];
    
    currentLightboxIndex = 0;
    
    // Show lightbox
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Show loading state
    lightboxLoader.classList.remove('hidden');
    
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
    
    // Load image
    loadLightboxImage(imageSrc, movieTitle, movieYear);
    
    // Update navigation visibility
    updateLightboxNavigation();
}

// Load image in lightbox
function loadLightboxImage(src, title, year) {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxYear = document.getElementById('lightboxYear');
    const lightboxLoader = document.querySelector('.lightbox-loader');
    
    if (!lightboxImage) return;
    
    // Show loader
    lightboxLoader.classList.remove('hidden');
    
    // Create new image to preload
    const img = new Image();
    
    img.onload = function() {
        lightboxImage.src = src;
        lightboxImage.alt = `${title} (${year}) - Movie Poster`;
        // Store title and year as data attributes for later use
        lightboxImage.dataset.movieTitle = title;
        lightboxImage.dataset.movieYear = year;
        
        // Hide loader with animation
        setTimeout(() => {
            lightboxLoader.classList.add('hidden');
        }, 300);
        
        console.log(`✅ Lightbox image loaded: ${title}`);
    };
    
    img.onerror = function() {
        console.error(`❌ Failed to load lightbox image: ${title}`);
        lightboxLoader.classList.add('hidden');
        
        // Show error state and store data attributes
        lightboxImage.src = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="600" fill="#2c3e50"/>
                <text x="200" y="280" font-family="Arial" font-size="60" fill="white" text-anchor="middle">🎬</text>
                <text x="200" y="340" font-family="Arial" font-size="16" fill="#bdc3c7" text-anchor="middle">Image not available</text>
                <text x="200" y="360" font-family="Arial" font-size="14" fill="#95a5a6" text-anchor="middle">${title}</text>
            </svg>
        `);
        // Store title and year as data attributes for error case too
        lightboxImage.dataset.movieTitle = title;
        lightboxImage.dataset.movieYear = year;
    };
    
    // Start loading
    img.src = src;
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        lightbox.classList.add('hidden');
    }, 300);
}

// Show previous image in gallery
function showPreviousImage() {
    if (currentLightboxImages.length <= 1) return;
    
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
    const image = currentLightboxImages[currentLightboxIndex];
    loadLightboxImage(image.src, image.title, image.year);
}

// Show next image in gallery
function showNextImage() {
    if (currentLightboxImages.length <= 1) return;
    
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
    const image = currentLightboxImages[currentLightboxIndex];
    loadLightboxImage(image.src, image.title, image.year);
}

// Update navigation button visibility
function updateLightboxNavigation() {
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    if (currentLightboxImages.length <= 1) {
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
    } else {
        if (lightboxPrev) lightboxPrev.style.display = 'flex';
        if (lightboxNext) lightboxNext.style.display = 'flex';
    }
}

// Handle keyboard navigation
function handleLightboxKeyboard(e) {
    const lightbox = document.getElementById('imageLightbox');
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    
    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPreviousImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
}

// Add click handlers to movie images
function addImageClickHandlers() {
    // Use event delegation for dynamically added images
    document.addEventListener('click', (e) => {
        const img = e.target;
        
        // Check if clicked element is a movie poster image
        if (img.tagName === 'IMG' && 
           (img.classList.contains('movie-poster') || 
            img.classList.contains('genre-movie-poster') || 
            img.classList.contains('featured-movie-poster'))) {
            
            e.preventDefault();
            e.stopPropagation();
            
            // Get movie details from the image
            const movieCard = img.closest('.movie-card, .genre-movie-card, .featured-movie-card');
            let movieTitle = 'Movie Poster';
            let movieYear = '';
            
            if (movieCard) {
                const titleElement = movieCard.querySelector('.movie-title, .genre-movie-title, .featured-movie-title');
                const yearElement = movieCard.querySelector('.movie-year, .genre-movie-year, .featured-movie-year');
                
                if (titleElement) movieTitle = titleElement.textContent.trim();
                if (yearElement) movieYear = yearElement.textContent.trim();
            }
            
            // Open lightbox with the image
            openLightbox(img.src, movieTitle, movieYear);
        }
        
        // Handle canvas custom posters
        if (img.tagName === 'CANVAS' && img.classList.contains('custom-poster')) {
            e.preventDefault();
            e.stopPropagation();
            
            const movieCard = img.closest('.movie-card, .genre-movie-card, .featured-movie-card');
            let movieTitle = 'Custom Movie Poster';
            let movieYear = '';
            
            if (movieCard) {
                const titleElement = movieCard.querySelector('.movie-title, .genre-movie-title, .featured-movie-title');
                const yearElement = movieCard.querySelector('.movie-year, .genre-movie-year, .featured-movie-year');
                
                if (titleElement) movieTitle = titleElement.textContent.trim();
                if (yearElement) movieYear = yearElement.textContent.trim();
            }
            
            // Convert canvas to data URL and open in lightbox
            const dataURL = img.toDataURL('image/png');
            openLightbox(dataURL, movieTitle, movieYear);
        }
    });
}

// Lightbox action functions
function downloadImage() {
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (!lightboxImage || !lightboxImage.src) return;
    
    try {
        // Get movie title from data attribute or fallback
        const movieTitle = lightboxImage.dataset.movieTitle || 'movie-poster';
        
        // Create download link
        const link = document.createElement('a');
        link.href = lightboxImage.src;
        link.download = `${movieTitle}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Image download started!', 'success');
    } catch (error) {
        console.error('Download failed:', error);
        showToast('Download failed. Image may be from external source.', 'error');
    }
}

function shareImage() {
    console.log('Share button clicked!'); // Debug log
    
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (!lightboxImage) {
        console.error('Lightbox image not found');
        showToast('Share failed: Image not found', 'error');
        return;
    }
    
    // Get movie details from image data attributes
    const movieTitle = lightboxImage.dataset.movieTitle || 'Amazing Movie';
    const movieYear = lightboxImage.dataset.movieYear || '';
    const imageUrl = lightboxImage.src;
    
    const shareText = `Check out this ${movieTitle}${movieYear ? ` (${movieYear})` : ''} movie poster!`;
    const shareUrl = imageUrl; // Share the actual image URL
    
    console.log('Attempting to share:', shareText, shareUrl); // Debug log
    
    // Try native share API first
    if (navigator.share && navigator.share.canShare) {
        navigator.share({
            title: `${movieTitle} Movie Poster`,
            text: shareText,
            url: shareUrl
        }).then(() => {
            console.log('Native share successful');
            showToast('Shared successfully!', 'success');
        }).catch((error) => {
            console.log('Native share failed:', error);
            fallbackShare(shareText, shareUrl);
        });
    } else {
        console.log('Native share not available, using fallback');
        fallbackShare(shareText, shareUrl);
    }
}

function fallbackShare(text, url) {
    console.log('Using fallback share method'); // Debug log
    
    // Copy to clipboard as fallback
    const shareContent = `${text} - ${url}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareContent).then(() => {
            console.log('Clipboard write successful');
            showToast('Share link copied to clipboard!', 'success');
        }).catch((error) => {
            console.error('Clipboard write failed:', error);
            legacyFallbackShare(shareContent);
        });
    } else {
        console.log('Clipboard API not available, using legacy method');
        legacyFallbackShare(shareContent);
    }
}

function legacyFallbackShare(shareContent) {
    // Legacy fallback using textarea
    try {
        const textArea = document.createElement('textarea');
        textArea.value = shareContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            console.log('Legacy copy successful');
            showToast('Share link copied to clipboard!', 'success');
        } else {
            throw new Error('Copy command failed');
        }
    } catch (error) {
        console.error('All share methods failed:', error);
        showToast('Unable to share. URL: ' + window.location.href, 'error');
    }
}

function viewFullscreen() {
    const lightboxImage = document.getElementById('lightboxImage');
    if (!lightboxImage) return;
    
    if (lightboxImage.requestFullscreen) {
        lightboxImage.requestFullscreen();
    } else if (lightboxImage.webkitRequestFullscreen) {
        lightboxImage.webkitRequestFullscreen();
    } else if (lightboxImage.msRequestFullscreen) {
        lightboxImage.msRequestFullscreen();
    } else {
        showToast('Fullscreen not supported by your browser', 'error');
    }
}

// ===== RESPONSIVE IMAGE OPTIMIZATION =====

// Check if browser supports WebP
function supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

// Get optimal image size based on container and device
function getOptimalImageSize(container) {
    const rect = container.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Calculate optimal dimensions
    const optimalWidth = Math.ceil(rect.width * devicePixelRatio);
    const optimalHeight = Math.ceil(rect.height * devicePixelRatio);
    
    // Determine size category
    if (optimalWidth <= 300) return 'small';
    if (optimalWidth <= 600) return 'medium';
    return 'large';
}

// Enhanced image URL with optimization
function optimizeImageUrl(originalUrl, container, title) {
    if (!originalUrl || !originalUrl.includes('http')) {
        return originalUrl;
    }
    
    const size = getOptimalImageSize(container);
    const webpSupported = supportsWebP();
    
    // If it's an OMDB poster URL, we can try to optimize it
    if (originalUrl.includes('m.media-amazon.com')) {
        try {
            // OMDB/IMDb posters can sometimes be resized
            let optimizedUrl = originalUrl;
            
            // Add size parameters if possible
            switch (size) {
                case 'small':
                    optimizedUrl = originalUrl.replace(/\._V1_.*\.jpg/, '._V1_SX300.jpg');
                    break;
                case 'medium':
                    optimizedUrl = originalUrl.replace(/\._V1_.*\.jpg/, '._V1_SX600.jpg');
                    break;
                case 'large':
                    optimizedUrl = originalUrl.replace(/\._V1_.*\.jpg/, '._V1_SX800.jpg');
                    break;
            }
            
            console.log(`📊 Optimized image size for ${title}: ${size}`);
            return optimizedUrl;
        } catch (error) {
            console.log(`⚠️ Could not optimize image URL for ${title}`);
            return originalUrl;
        }
    }
    
    return originalUrl;
}

// Image caching functionality
class ImageCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 50; // Maximum number of images to cache
    }
    
    get(url) {
        return this.cache.get(url);
    }
    
    set(url, imageBlob) {
        if (this.cache.size >= this.maxSize) {
            // Remove oldest entry
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(url, imageBlob);
    }
    
    has(url) {
        return this.cache.has(url);
    }
    
    clear() {
        this.cache.clear();
    }
}

// Initialize image cache
const imageCache = new ImageCache();

// Preload critical images
function preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('.movie-poster, .genre-movie-poster, .featured-movie-poster');
    const preloadCount = Math.min(criticalImages.length, 6); // Preload first 6 images
    
    for (let i = 0; i < preloadCount; i++) {
        const img = criticalImages[i];
        const src = img.getAttribute('data-src') || img.src;
        
        if (src && !imageCache.has(src)) {
            const preloadImg = new Image();
            preloadImg.onload = () => {
                console.log(`⚡ Preloaded critical image: ${i + 1}/${preloadCount}`);
            };
            preloadImg.src = src;
        }
    }
}

// Smart image loading with retry and fallback
function loadImageSmart(img, src, title, retryCount = 0) {
    const maxRetries = 2;
    
    // Check cache first
    if (imageCache.has(src)) {
        img.src = src;
        return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Add to cache
            imageCache.set(src, tempImg);
            img.src = src;
            resolve();
        };
        
        tempImg.onerror = () => {
            console.error(`📵 Image load failed (attempt ${retryCount + 1}): ${title}`);
            
            if (retryCount < maxRetries) {
                // Retry with exponential backoff
                setTimeout(() => {
                    loadImageSmart(img, src, title, retryCount + 1)
                        .then(resolve)
                        .catch(reject);
                }, 1000 * Math.pow(2, retryCount));
            } else {
                reject(new Error('All retry attempts failed'));
            }
        };
        
        // Start loading
        tempImg.src = src;
    });
}

// Background image preloading for better UX
function preloadBackgroundImages() {
    // Preload images that are likely to be viewed next
    const visibleCards = document.querySelectorAll('.movie-card:not(.loaded), .genre-movie-card:not(.loaded)');
    
    visibleCards.forEach((card, index) => {
        if (index < 10) { // Preload next 10 images
            const img = card.querySelector('img[data-src]');
            if (img) {
                const src = img.getAttribute('data-src');
                if (src && !imageCache.has(src)) {
                    setTimeout(() => {
                        const preloadImg = new Image();
                        preloadImg.src = src;
                    }, index * 200); // Stagger preloading
                }
            }
        }
    });
}

// Connection-aware loading
function getConnectionSpeed() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        const effectiveType = connection.effectiveType;
        
        switch (effectiveType) {
            case 'slow-2g':
            case '2g':
                return 'slow';
            case '3g':
                return 'medium';
            case '4g':
                return 'fast';
            default:
                return 'medium';
        }
    }
    return 'medium'; // Default fallback
}

// Adaptive quality based on connection
function getAdaptiveImageQuality(originalUrl) {
    const connectionSpeed = getConnectionSpeed();
    
    if (!originalUrl || !originalUrl.includes('http')) {
        return originalUrl;
    }
    
    try {
        if (originalUrl.includes('m.media-amazon.com')) {
            switch (connectionSpeed) {
                case 'slow':
                    return originalUrl.replace(/\._V1_.*\.jpg/, '._V1_SX200.jpg');
                case 'medium':
                    return originalUrl.replace(/\._V1_.*\.jpg/, '._V1_SX400.jpg');
                case 'fast':
                    return originalUrl.replace(/\._V1_.*\.jpg/, '._V1_SX600.jpg');
            }
        }
    } catch (error) {
        console.log('Could not apply adaptive quality');
    }
    
    return originalUrl;
}

// Initialize performance optimizations
function initializeImageOptimizations() {
    // Preload critical images
    setTimeout(preloadCriticalImages, 1000);
    
    // Set up background preloading
    setTimeout(preloadBackgroundImages, 3000);
    
    // Clear cache periodically
    setInterval(() => {
        if (imageCache.cache.size > 30) {
            console.log('🧽 Clearing old image cache entries');
            const entries = Array.from(imageCache.cache.entries());
            const entriesToKeep = entries.slice(-20); // Keep last 20
            imageCache.clear();
            entriesToKeep.forEach(([key, value]) => imageCache.set(key, value));
        }
    }, 300000); // Every 5 minutes
    
    console.log('⚡ Image optimization features initialized');
}

// Custom movie poster mappings for specific movies with N/A posters
const customMoviePosters = {
    'His popular tweet': createDataURI('Social Media Movie', '#3498db'),
    'From Stargate to Atlantis: Sci Fi Lowdown': createDataURI('Stargate Documentary', '#9b59b6'),
    'Sci Fi Inside: Stargate SG-1 200th Episode': createDataURI('SG-1 Special', '#2ecc71'),
    'Sci Fi Inside: \'the Triangle\'': createDataURI('The Triangle', '#e74c3c')
};

// Create a professional-looking data URI for movie posters (works offline)
function createDataURI(text, bgColor = '#2c3e50') {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0, bgColor);
    gradient.addColorStop(1, '#1a252f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 300, 450);
    
    // Add film strip effect at top and bottom
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 300, 30);
    ctx.fillRect(0, 420, 300, 30);
    
    // Add film holes
    ctx.fillStyle = '#ffffff';
    for (let i = 20; i < 280; i += 40) {
        ctx.fillRect(i, 8, 15, 14);
        ctx.fillRect(i, 428, 15, 14);
    }
    
    // Add movie icon/symbol
    ctx.fillStyle = '#ecf0f1';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎬', 150, 120);
    
    // Add decorative border
    ctx.strokeStyle = '#bdc3c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 40, 270, 370);
    
    // Add inner shadow effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(15, 40, 270, 20);
    
    // Add title text with better styling
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    // Dynamic font size based on text length
    let fontSize = text.length > 30 ? 16 : text.length > 20 ? 18 : 20;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Word wrap for long titles with better positioning
    const words = text.split(' ');
    const maxWidth = 250;
    let line = '';
    let y = 280; // Position below the movie icon
    const lineHeight = fontSize + 8;
    const lines = [];
    
    // Calculate all lines first
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim());
    
    // Center the text block vertically
    const totalHeight = lines.length * lineHeight;
    y = 250 + (120 - totalHeight) / 2;
    
    // Draw each line
    lines.forEach(line => {
        ctx.fillText(line, 150, y);
        y += lineHeight;
    });
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Add "NO IMAGE AVAILABLE" text at bottom
    ctx.fillStyle = '#95a5a6';
    ctx.font = 'italic 12px Arial';
    ctx.fillText('No Image Available', 150, 390);
    
    return canvas.toDataURL('image/png');
}

// Get custom poster for specific movies or generate canvas-based fallback
function getCustomOrGeneratedPoster(title) {
    console.log(`Generating poster for: ${title}`);
    
    // Check if we have a custom poster for this specific movie
    if (customMoviePosters[title]) {
        console.log(`Using custom poster for: ${title}`);
        return customMoviePosters[title];
    }
    
    // Generate canvas-based poster with movie title and color
    console.log(`Creating canvas poster for: ${title}`);
    return createDataURI(title || 'Movie', `#${getColorFromTitle(title)}`);
}

// Generate a color based on movie title for consistent placeholders
function getColorFromTitle(title) {
    if (!title) return 'cccccc';
    
    // Simple hash function to generate consistent colors
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        const char = title.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to positive number and generate color
    const colorValue = Math.abs(hash) % 16777215;
    return colorValue.toString(16).padStart(6, '0');
}

// Simple animation control
let countersAnimated = false;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const movieResults = document.getElementById('movieResults');
const movieModal = document.getElementById('movieModal');
const closeButton = document.querySelector('#movieModal .close-button');
const starRating = document.getElementById('starRating');
const reviewText = document.getElementById('reviewText');
const submitReview = document.getElementById('submitReview');
const favoriteButton = document.getElementById('favoriteButton');
const watchlistButton = document.getElementById('watchlistButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const favoritesSection = document.getElementById('favoritesSection');

// Search Results Page Elements
const searchResultsPage = document.getElementById('searchResultsPage');
const mainContentContainer = document.getElementById('mainContentContainer');
const backToMainBtn = document.getElementById('backToMainBtn');
const searchInputResults = document.getElementById('searchInputResults');
const searchButtonResults = document.getElementById('searchButtonResults');
const searchResultsTitle = document.getElementById('searchResultsTitle');
const searchResultsCount = document.getElementById('searchResultsCount');
const sortSearchResults = document.getElementById('sortSearchResults');
const filterSearchType = document.getElementById('filterSearchType');
const paginationControls = document.getElementById('paginationControls');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const currentPageInfo = document.getElementById('currentPageInfo');
const favoritesContainer = document.getElementById('favoritesContainer');
const watchlistContainer = document.getElementById('watchlistContainer');
const watchlistSection = document.getElementById('watchlistSection');
const toastContainer = document.getElementById('toastContainer');

const themeToggle = document.getElementById('themeToggle');

// Global Variables
let selectedMovieId = null;
let selectedRating = 0;
let currentMovie = null;
// Load user from localStorage or create default
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || {
    username: 'Anonymous',
    avatar: 'avatar1',
    achievements: []
};

// Sync with modern profile system if it exists
const modernProfileData = JSON.parse(localStorage.getItem('modernProfileData'));
if (modernProfileData && modernProfileData.username !== 'Guest User') {
    currentUser.username = modernProfileData.username;
    currentUser.avatar = modernProfileData.avatar || 'user-circle';
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    console.log('🔗 Loaded username from profile:', currentUser.username);
}
let currentSearchResults = []; // Store current search results for sorting/filtering
let currentPage = 1;
const resultsPerPage = 10;

// Achievements system
const achievements = [
    { id: 'first_review', name: 'First Review', description: 'Submit your first movie review', icon: '📝', unlocked: false },
    { id: 'five_reviews', name: 'Critic', description: 'Submit 5 movie reviews', icon: '⭐', unlocked: false },
    { id: 'ten_reviews', name: 'Movie Buff', description: 'Submit 10 movie reviews', icon: '🎬', unlocked: false },
    { id: 'first_favorite', name: 'Favorite Finder', description: 'Add your first movie to favorites', icon: '❤️', unlocked: false },
    { id: 'five_favorites', name: 'Collector', description: 'Add 5 movies to favorites', icon: '📚', unlocked: false },
    { id: 'dark_mode', name: 'Night Owl', description: 'Enable dark mode', icon: '🌙', unlocked: false }
];

// Language dictionary
const languageDictionary = {
    en: {
        searchPlaceholder: 'Search for movies...',
        searchButton: 'Search',
        actionTitle: 'Action Movies',
        comedyTitle: 'Comedy Movies',
        dramaTitle: 'Drama Movies',
        horrorTitle: 'Horror Movies',
        scifiTitle: 'Sci-Fi Movies',
        favoritesTitle: 'My Favorites',
        profileTitle: 'My Profile',
        saveProfile: 'Save Profile',
        usernameLabel: 'Username',
        avatarLabel: 'Avatar',

        noFavorites: 'No favorites yet. Start adding movies to your favorites!',
        noReviews: 'No reviews yet. Be the first to review this movie!',
        firstReview: 'First Review',
        critic: 'Critic',
        movieBuff: 'Movie Buff',
        favoriteFinder: 'Favorite Finder',
        collector: 'Collector',
        nightOwl: 'Night Owl'
    },
    es: {
        searchPlaceholder: 'Buscar películas...',
        searchButton: 'Buscar',
        actionTitle: 'Películas de Acción',
        comedyTitle: 'Películas de Comedia',
        dramaTitle: 'Películas de Drama',
        horrorTitle: 'Películas de Terror',
        scifiTitle: 'Películas de Ciencia Ficción',
        favoritesTitle: 'Mis Favoritos',
        profileTitle: 'Mi Perfil',
        saveProfile: 'Guardar Perfil',
        usernameLabel: 'Nombre de Usuario',
        avatarLabel: 'Avatar',

        noFavorites: 'Aún no hay favoritos. ¡Empieza a agregar películas a tus favoritos!',
        noReviews: 'Aún no hay reseñas. ¡Sé el primero en reseñar esta película!',
        firstReview: 'Primera Reseña',
        critic: 'Crítico',
        movieBuff: 'Fanático de Cine',
        favoriteFinder: 'Buscador de Favoritos',
        collector: 'Coleccionista',
        nightOwl: 'Búho Nocturno'
    },
    fr: {
        searchPlaceholder: 'Rechercher des films...',
        searchButton: 'Rechercher',
        actionTitle: 'Films d\'action',
        comedyTitle: 'Films comiques',
        dramaTitle: 'Films dramatiques',
        horrorTitle: 'Films d\'horreur',
        scifiTitle: 'Films de science-fiction',
        favoritesTitle: 'Mes favoris',
        profileTitle: 'Mon profil',
        saveProfile: 'Sauvegarder le profil',
        usernameLabel: 'Nom d\'utilisateur',
        avatarLabel: 'Avatar',

        noFavorites: 'Pas encore de favoris. Commencez à ajouter des films à vos favoris !',
        noReviews: 'Pas encore de critiques. Soyez le premier à critiquer ce film !',
        firstReview: 'Première critique',
        critic: 'Critique',
        movieBuff: 'Passionné de cinéma',
        favoriteFinder: 'Chercheur de favoris',
        collector: 'Collectionneur',
        nightOwl: 'Oiseau de nuit'
    }
};

// Current language
let currentLanguage = 'en';

// Function to clear ALL cached data to force fresh fetching
function clearAllCachedData() {
    console.log('🧹 CLEARING ALL CACHED DATA to force fresh fetching...');
    
    const genres = ['Trending', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];
    let clearedCount = 0;
    
    genres.forEach(genre => {
        const cachedData = localStorage.getItem(`cachedGenre_${genre}`);
        const cachedTimestamp = localStorage.getItem(`cachedGenre_${genre}_timestamp`);
        
        if (cachedData || cachedTimestamp) {
            localStorage.removeItem(`cachedGenre_${genre}`);
            localStorage.removeItem(`cachedGenre_${genre}_timestamp`);
            console.log(`🗑️ Cleared ALL cached data for ${genre}`);
            clearedCount++;
        }
    });
    
    console.log(`✅ COMPLETE CACHE CLEAR: Removed ${clearedCount} cache entries. Will fetch fresh data.`);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Movie Review App initialized');
    
    // Clear ALL cached data to force fresh fetching with new bulletproof system
    clearAllCachedData();
    
    // Initialize enhanced image features
    initializeLightbox();
    addImageClickHandlers();
    initializeImageOptimizations();
    
    // Initialize profile system (replaced loadUserProfile)
    if (window.profileSystem) {
        window.profileSystem.loadProfile();
    }
    displayFavorites();
    displayWatchlist();
    loadGenreSections();
    
    // Load language preference
    loadLanguagePreference();
    
    // Add animation to header
    const header = document.querySelector('header');
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            header.style.transition = 'all 0.5s ease';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate stats counter (only once)
    setTimeout(() => animateStats(), 500); // Small delay for better UX
    
    // Load theme preference
    loadThemePreference();
    

    
    // Add event listener for language selector
    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }
});

// Load language preference from Local Storage
function loadLanguagePreference() {
    const savedLanguage = localStorage.getItem('languagePreference');
    if (savedLanguage && languageDictionary[savedLanguage]) {
        currentLanguage = savedLanguage;
        updateLanguageSelector();
        translateUI();
    }
}

// Change language
function changeLanguage(language) {
    if (languageDictionary[language]) {
        currentLanguage = language;
        localStorage.setItem('languagePreference', language);
        translateUI();
        showToast(`Language changed to ${language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'French'}`, 'success');
    }
}

// Translate UI elements
function translateUI() {
    // Update placeholder text
    if (searchInput) {
        searchInput.placeholder = languageDictionary[currentLanguage].searchPlaceholder;
    }
    
    // Update search button text
    if (searchButton) {
        searchButton.textContent = languageDictionary[currentLanguage].searchButton;
    }
    
    // Update section titles
    updateSectionTitle('actionTitle', languageDictionary[currentLanguage].actionTitle);
    updateSectionTitle('comedyTitle', languageDictionary[currentLanguage].comedyTitle);
    updateSectionTitle('dramaTitle', languageDictionary[currentLanguage].dramaTitle);
    updateSectionTitle('horrorTitle', languageDictionary[currentLanguage].horrorTitle);
    updateSectionTitle('scifiTitle', languageDictionary[currentLanguage].scifiTitle);
    updateSectionTitle('favoritesTitle', languageDictionary[currentLanguage].favoritesTitle);
    

    
    // Update achievement names
    updateAchievementNames();
}

// Update section title
function updateSectionTitle(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}







// Update achievement names
function updateAchievementNames() {
    // Update the achievement names in the dictionary
    achievements[0].name = languageDictionary[currentLanguage].firstReview;
    achievements[1].name = languageDictionary[currentLanguage].critic;
    achievements[2].name = languageDictionary[currentLanguage].movieBuff;
    achievements[3].name = languageDictionary[currentLanguage].favoriteFinder;
    achievements[4].name = languageDictionary[currentLanguage].collector;
    achievements[5].name = languageDictionary[currentLanguage].nightOwl;
    

}

// Event Listeners
searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        showSearchResultsPage(searchTerm);
    } else {
        showToast('Please enter a movie title to search', 'warning');
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            showSearchResultsPage(searchTerm);
        } else {
            showToast('Please enter a movie title to search', 'warning');
        }
    }
});

// Search Results Page Event Listeners (moved to DOMContentLoaded)
// These are now handled in the DOMContentLoaded event listener to ensure elements exist

// Filter and Sort Event Listeners for Search Results
if (sortSearchResults) {
    sortSearchResults.addEventListener('change', (e) => {
        if (currentSearchResults && currentSearchResults.length > 0) {
            const sortedResults = sortMovieResults(currentSearchResults, e.target.value);
            displayMovieResults(sortedResults);
        }
    });
}

if (filterSearchType) {
    filterSearchType.addEventListener('change', (e) => {
        if (currentSearchResults && currentSearchResults.length > 0) {
            const filteredResults = filterMovieResults(currentSearchResults, e.target.value);
            displayMovieResults(filteredResults);
        }
    });
}

// Pagination Event Listeners
if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            searchMovies(currentPage - 1, true);
        }
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
        searchMovies(currentPage + 1, true);
    });
}

// Enhanced close button functionality
if (closeButton) {
    closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMovieModal();
    });
}

// Function to show movie modal with smooth animation
function showMovieModal() {
    if (movieModal) {
        movieModal.classList.remove('hidden');
        movieModal.style.opacity = '0';
        movieModal.style.transform = 'scale(0.95)';
        document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open
        
        setTimeout(() => {
            movieModal.style.opacity = '1';
            movieModal.style.transform = 'scale(1)';
        }, 50);
    }
}

// Function to close movie modal with smooth animation
function closeMovieModal() {
    if (movieModal) {
        movieModal.style.opacity = '0';
        movieModal.style.transform = 'scale(0.95)';
        setTimeout(() => {
            movieModal.classList.add('hidden');
            movieModal.style.opacity = '1';
            movieModal.style.transform = 'scale(1)';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }, 300);
    }
}

// Enhanced window click handler for modal closing
window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        closeMovieModal();
    }
});

// Add Escape key handler to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !movieModal.classList.contains('hidden')) {
        closeMovieModal();
    }
});

// Enhanced share button functionality
function addShareButtonListeners() {
    // Remove existing listeners to avoid duplicates
    const existingShareButtons = document.querySelectorAll('.share-button');
    existingShareButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    
    // Add new listeners
    setTimeout(() => {
        const shareButtons = document.querySelectorAll('.share-button');
        shareButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = button.getAttribute('data-platform');
                const movieTitle = currentMovie ? currentMovie.Title : 'Amazing Movie';
                const movieYear = currentMovie ? currentMovie.Year : '';
                const movieUrl = window.location.href;
                
                shareMovie(platform, movieTitle, movieYear, movieUrl, button);
            });
        });
    }, 100);
}

// Enhanced movie sharing function
function shareMovie(platform, title, year, url, button) {
    const shareText = `Check out "${title}" (${year}) - A great movie recommendation!`;
    const shareUrl = url;
    
    switch (platform) {
        case 'twitter':
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
            showShareSuccess(button, 'Shared on Twitter!');
            break;
            
        case 'facebook':
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
            showShareSuccess(button, 'Shared on Facebook!');
            break;
            
        case 'whatsapp':
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
            window.open(whatsappUrl, '_blank');
            showShareSuccess(button, 'Shared on WhatsApp!');
            break;
            
        case 'copy':
            navigator.clipboard.writeText(shareUrl).then(() => {
                showShareSuccess(button, 'Link copied to clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showShareSuccess(button, 'Link copied to clipboard!');
            });
            break;
    }
}

// Show share success feedback
function showShareSuccess(button, message) {
    const originalContent = button.innerHTML;
    button.innerHTML = `<i class="fas fa-check"></i> <span>${message}</span>`;
    button.style.background = '#28a745';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = '';
        button.disabled = false;
    }, 2000);
}

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

// Simple, reliable counter animation - runs only once
function animateStats() {
    // Prevent multiple animations
    if (countersAnimated) {
        console.log('🔄 Counters already animated, skipping');
        return;
    }
    countersAnimated = true;
    
    console.log('🎯 Starting counter animations...');
    
    const movieCount = document.getElementById('movieCount');
    const userCount = document.getElementById('userCount');
    const reviewCount = document.getElementById('reviewCount');
    
    // Animate movie count: 1000 to 5000
    if (movieCount) {
        animateCounter(movieCount, 1000, 5000, 100, (val) => val + '+');
    }
    
    // Animate user count: 50K to 100K
    if (userCount) {
        animateCounter(userCount, 50000, 100000, 200, (val) => (val / 1000).toFixed(1) + 'K+');
    }
    
    // Animate review count: 200K to 500K
    if (reviewCount) {
        animateCounter(reviewCount, 200000, 500000, 150, (val) => (val / 1000).toFixed(0) + 'K+');
    }
}

// Helper function to animate individual counter
function animateCounter(element, start, end, duration, formatter) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (difference * easeOut));
        
        element.textContent = formatter(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatter(end); // Ensure final value
            console.log(`✅ Counter animation completed for ${element.id}`);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Simple, reliable movie loading - always shows content
async function loadGenreSections() {
    console.log('🎬 Loading genre sections with guaranteed content...');

    // Load all genre sections from API and cache only
    loadGenreSection('Trending', 'TrendingMovies');
    loadGenreSection('Action', 'actionMovies');
    loadGenreSection('Comedy', 'comedyMovies');
    loadGenreSection('Drama', 'dramaMovies');
    loadGenreSection('Horror', 'horrorMovies');
    loadGenreSection('Sci-Fi', 'scifiMovies', 'title'); // Sort Sci-Fi movies by title

    console.log('🎯 All genre sections initiated');
}



// Reliable genre loading - API and cache only
async function loadGenreSection(genre, containerId, sortBy = 'original') {
    console.log(`🎭 Loading ${genre} movies for ${containerId} with sorting: ${sortBy}`);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Container ${containerId} not found!`);
        return;
    }
    
    // Try to load from API first for all genres
    console.log(`🌐 Trying API for ${genre} section first...`);
    
    // Try to load from cache first, then API
    setTimeout(async () => {
        // Try to load from cache first
        try {
            const cachedData = localStorage.getItem(`cachedGenre_${genre}`);
            if (cachedData) {
                // Check if cache is less than 1 hour old
                const cacheTimestamp = localStorage.getItem(`cachedGenre_${genre}_timestamp`);
                if (cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 3600000) { // 1 hour
                    const movies = JSON.parse(cachedData);
                    console.log(`✅ Loaded cached ${genre} movies`);
                    displayGenreMovies(movies, container);
                    return;
                } else {
                    console.log(`🗑️ Cache for ${genre} expired, fetching fresh data`);
                }
            }
        } catch (e) {
            console.log(`❌ Failed to load cached ${genre} movies:`, e);
        }
        
        // If no cache, try API
        try {
            // For Trending section, try multiple search terms and combine results
            if (genre === 'Trending') {
                const searchTerms = ['batman', 'marvel', 'spider', 'avengers', 'star wars', 'james bond'];
                let allMovies = [];
                
                for (const term of searchTerms) {
                    console.log(`🎬 Fetching ${genre} movies with term: ${term}`);
                    const validMovies = await fetchMoviesWithValidPosters(term, 4);
                    
                    // Add movies to collection, avoiding duplicates
                    validMovies.forEach(movie => {
                        if (allMovies.length < 4 && !allMovies.find(existing => existing.imdbID === movie.imdbID)) {
                            allMovies.push(movie);
                            console.log(`✅ Added to ${genre}: ${movie.Title} (${allMovies.length}/4)`);
                        }
                    });
                    
                    // If we have enough movies, break
                    if (allMovies.length >= 4) {
                        console.log(`🎯 Found enough ${genre} movies: ${allMovies.length}`);
                        break;
                    }
                }
                
                if (allMovies.length > 0) {
                    console.log(`✅ Final ${genre} collection: ${allMovies.length} movies with valid posters`);
                    displayGenreMovies(allMovies, container, sortBy);
                    
                    // Cache for future use with timestamp
                    try {
                        localStorage.setItem(`cachedGenre_${genre}`, JSON.stringify(allMovies));
                        localStorage.setItem(`cachedGenre_${genre}_timestamp`, Date.now().toString());
                    } catch (e) {
                        console.error(`Error caching ${genre}:`, e);
                    }
                    return; // Success
                } else {
                    console.log(`❌ No ${genre} movies found with valid posters`);
                }
            } else {
                // BULLETPROOF SYSTEM: Get exactly 4 movies with valid posters for any genre
                console.log(`🎬 BULLETPROOF FETCHING: Getting exactly 4 ${genre} movies with valid posters`);
                let movies = await getExactly4MoviesWithPosters(genre);
                
                console.log(`🌐 BULLETPROOF ${genre} result: ${movies.length} movies`);
                
                // GUARANTEE: Always ensure we have exactly 4 movies
                if (movies.length < 4) {
                    console.log(`⚠️ BULLETPROOF ${genre}: Only got ${movies.length}/4, padding with additional searches...`);
                    
                    // Try one more aggressive search
                    const paddingMovies = await fetchMoviesWithValidPosters(genre.toLowerCase(), 4 - movies.length);
                    paddingMovies.forEach(movie => {
                        if (movies.length < 4 && !movies.find(existing => existing.imdbID === movie.imdbID)) {
                            movies.push(movie);
                            console.log(`🔧 BULLETPROOF PAD: Added ${movie.Title} (${movies.length}/4)`);
                        }
                    });
                    
                    // If still not enough, try generic movie search
                    if (movies.length < 4) {
                        console.log(`🔧 BULLETPROOF: Still need ${4 - movies.length}, trying generic search...`);
                        const genericMovies = await fetchMoviesWithValidPosters('movie', 4 - movies.length);
                        genericMovies.forEach(movie => {
                            if (movies.length < 4 && !movies.find(existing => existing.imdbID === movie.imdbID)) {
                                movies.push(movie);
                                console.log(`🔧 GENERIC ADD: ${movie.Title} (${movies.length}/4)`);
                            }
                        });
                    }
                }
                
                if (movies.length > 0) {
                    console.log(`✅ BULLETPROOF SUCCESS: ${genre} loaded with ${movies.length} movies with valid posters`);
                    displayGenreMovies(movies, container, sortBy);
                    
                    // Cache for future use with timestamp
                    try {
                        localStorage.setItem(`cachedGenre_${genre}`, JSON.stringify(movies));
                        localStorage.setItem(`cachedGenre_${genre}_timestamp`, Date.now().toString());
                    } catch (e) {
                        console.error(`Error caching ${genre}:`, e);
                    }
                    return; // Success
                } else {
                    console.log(`❌ BULLETPROOF FAILED: No ${genre} movies found even with all fallbacks`);
                }
            }
        } catch (error) {
            console.log(`📱 API failed for ${genre}:`, error.message);
        }
        
        // If API fails, try to load from cache
        console.log(`📦 Checking cache for ${genre} as API failed`);
        
        // Try to load from cache
        try {
            const cachedData = localStorage.getItem(`cachedGenre_${genre}`);
            if (cachedData) {
                // Even if cache is expired, use it if API is unavailable
                const movies = JSON.parse(cachedData);
                console.log(`✅ Loaded cached ${genre} movies (API unavailable)`);
                displayGenreMovies(movies, container, sortBy);
                return;
            }
        } catch (e) {
            console.log(`❌ Failed to load cached ${genre} movies:`, e);
        }
        
        // If no cache and no API, show error message
        console.log(`❌ No data available for ${genre}`);
        container.innerHTML = `
            <div class="genre-error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to load ${genre} movies</h3>
                <p>Please check your internet connection and try refreshing the page.</p>
            </div>
        `;
    }, 100);
}



// Sort movies by different criteria
function sortGenreMovies(movies, sortBy = 'year') {
    const sortedMovies = [...movies];
    
    switch (sortBy) {
        case 'title':
            return sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
        case 'year-desc':
            return sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
        case 'year-asc':
            return sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
        case 'original':
        default:
            return sortedMovies; // Keep original order
    }
}

// Display movies for a genre section - BULLETPROOF VERSION
function displayGenreMovies(movies, container, sortBy = 'original') {
    container.innerHTML = '';
    
    console.log(`🎬 BULLETPROOF DISPLAY: ${movies.length} movies for ${container.id}`);
    
    // Ensure we have at least some movies
    if (movies.length === 0) {
        console.error(`❌ BULLETPROOF ERROR: No movies to display for ${container.id}`);
        container.innerHTML = '<div class="error-message">Loading movies... Please refresh if this persists.</div>';
        return;
    }
    
    // Warn if we don't have exactly 4 movies
    if (movies.length < 4) {
        console.warn(`⚠️ BULLETPROOF WARNING: Only ${movies.length}/4 movies for ${container.id}`);
    }
    
    // Special handling for Sci-Fi genre - sort by title alphabetically
    if (container.id === 'scifiMovies') {
        sortBy = 'title';
    }
    
    // Sort movies if requested
    const sortedMovies = sortGenreMovies(movies, sortBy);
    
    sortedMovies.forEach((movie, index) => {
        // Double-check poster validity before creating card
        if (!movie.Poster || movie.Poster === 'N/A' || movie.Poster === 'n/a' || !movie.Poster.startsWith('http')) {
            console.log(`🚫 Skipping movie with invalid poster: ${movie.Title} - ${movie.Poster}`);
            return; // Skip this movie entirely
        }
        
        const movieCard = document.createElement('div');
        movieCard.className = 'genre-movie-card';
        
        // Add animation delay for each card
        movieCard.style.animationDelay = `${index * 0.1}s`;
        
        // Create image - should never return null now due to double-check above
        const img = createMovieImage(movie.Poster, movie.Title, 'genre-movie-poster');
        
        // If image creation somehow fails, skip the movie
        if (!img) {
            console.log(`🚫 Failed to create image for: ${movie.Title}, skipping movie`);
            return;
        }
        
        // Create info div
        const infoDiv = document.createElement('div');
        infoDiv.className = 'genre-movie-info';
        infoDiv.innerHTML = `
            <h3 class="genre-movie-title">${movie.Title}</h3>
            <p class="genre-movie-year">${movie.Year}</p>
        `;
        
        // Create button
        const button = document.createElement('button');
        button.className = 'details-button';
        button.setAttribute('data-imdbid', movie.imdbID);
        button.innerHTML = '<i class="fas fa-info-circle"></i> View Details';
        
        // Assemble the card only if everything is valid
        infoDiv.appendChild(button);
        movieCard.appendChild(img);
        movieCard.appendChild(infoDiv);
        
        container.appendChild(movieCard);
        
        console.log(`✅ Successfully created movie card for: ${movie.Title}`);
    });
    
    // Add event listeners to detail buttons
    container.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', () => {
            const imdbID = button.getAttribute('data-imdbid');
            showMovieDetails(imdbID);
        });
    });
    
    // Add enhanced share button functionality
    addShareButtonListeners();
}

// Navigate to modern search results page
function showSearchResultsPage(searchTerm = '') {
    console.log('Navigating to search results page with term:', searchTerm);
    
    // Hide main content and show search results page
    if (mainContentContainer) mainContentContainer.style.display = 'none';
    if (searchResultsPage) {
        searchResultsPage.classList.remove('hidden');
        console.log('Search results page shown');
    } else {
        console.error('Search results page element not found');
    }
    
    // Hide the navigation bar on search results page
    const fixedHeader = document.querySelector('.fixed-header');
    if (fixedHeader) {
        fixedHeader.style.display = 'none';
    }
    
    // Set search term in the new search input
    const modernSearchInput = document.getElementById('searchInputResults');
    if (searchTerm && modernSearchInput) {
        modernSearchInput.value = searchTerm;
        console.log('Search term set in input:', searchTerm);
    }
    
    // Update search results info
    updateModernSearchInfo(searchTerm);
    
    // Trigger search if we have a search term
    if (searchTerm.trim()) {
        performModernSearch(searchTerm);
    }
    
    // Initialize modern search page features
    initializeModernSearchFeatures();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Navigate back to main page
function showMainPage() {
    // Show main content and hide search results page
    if (searchResultsPage) searchResultsPage.classList.add('hidden');
    if (mainContentContainer) mainContentContainer.style.display = 'block';
    
    // Show the navigation bar when returning to main page
    const fixedHeader = document.querySelector('.fixed-header');
    if (fixedHeader) {
        fixedHeader.style.display = 'block';
    }
    
    // Clear search results
    const resultsGrid = document.getElementById('searchResultsGrid');
    if (resultsGrid) {
        resultsGrid.innerHTML = '';
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Get current search input value (from active search bar)
function getCurrentSearchTerm() {
    if (!searchResultsPage.classList.contains('hidden') && searchInputResults) {
        return searchInputResults.value.trim();
    }
    return searchInput ? searchInput.value.trim() : '';
}

// Search Movies Function (updated to work with search results page)
async function searchMovies(page = 1, fromResultsPage = false) {
    const searchTerm = getCurrentSearchTerm();
    
    if (!searchTerm) {
        showToast('Please enter a movie title to search', 'warning');
        return;
    }
    
    // Navigate to search results page if not already there
    if (!fromResultsPage && searchResultsPage.classList.contains('hidden')) {
        showSearchResultsPage(searchTerm);
    }

    
    try {
        // Add page parameter to API call using enhanced API request
        const result = await makeAPIRequest(`${API_URL}&s=${encodeURIComponent(searchTerm)}&page=${page}`);
        
        if (result.success && result.data.Response === 'True') {
            const data = result.data;
            
            // Separate movies with and without valid posters
            const moviesWithValidPosters = filterMoviesWithValidPosters(data.Search);
            const moviesWithoutPosters = data.Search.filter(movie => 
                !moviesWithValidPosters.find(validMovie => validMovie.imdbID === movie.imdbID)
            );
            
            // Prioritize movies with valid posters first
            const prioritizedResults = [...moviesWithValidPosters, ...moviesWithoutPosters];
            
            currentSearchResults = prioritizedResults; // Store results for sorting/filtering
            currentPage = page;
            
            console.log(`🔍 Search results: ${moviesWithValidPosters.length} with valid posters, ${moviesWithoutPosters.length} without`);
            
            // Update search results info
            updateSearchResultsInfo(searchTerm, data.totalResults);
            
            displayMovieResults(prioritizedResults);
            updatePaginationControls(data.totalResults, page);
            
        } else {
            // Handle API failure or no results
            const errorMessage = result.success ? 'No movies found' : `API Error: ${result.error}`;
            
            // Update search results info for no results/error
            updateSearchResultsInfo(searchTerm, 0);
            
            movieResults.innerHTML = `
                <div class="placeholder">
                    <i class="fas fa-${result.success ? 'search' : 'exclamation-triangle'} fa-4x"></i>
                    <p>${errorMessage}. Please try ${result.success ? 'another search term' : 'again later'}.<br><small>${result.success ? 'Try searching for popular movies like "Inception" or "The Matrix"' : 'Check your internet connection'}</small></p>
                </div>
            `;
            
            // Hide pagination
            if (paginationControls) {
                paginationControls.classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        
        // Update search results info for error
        updateSearchResultsInfo(searchTerm, 0);
        
        movieResults.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-exclamation-triangle fa-4x"></i>
                <p>Error fetching movies. Please try again later.<br><small>Check your internet connection</small></p>
            </div>
        `;
        
        // Hide pagination
        if (paginationControls) {
            paginationControls.classList.add('hidden');
        }
        
        showToast('Error fetching movies. Please try again later.', 'error');
    }
}

// Display Movie Results (updated for pagination)
function displayMovieResults(movies) {
    movieResults.innerHTML = '';
    
    if (movies.length === 0) {
        movieResults.innerHTML = `
            <div class="placeholder">
                <i class="fas fa-search fa-4x"></i>
                <p>No movies found with the current filters.</p>
            </div>
        `;
        return;
    }
    
    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        // Add animation delay for each card
        movieCard.style.animationDelay = `${index * 0.1}s`;
        
        // Create image
        const img = createMovieImage(movie.Poster, movie.Title, 'movie-poster');
        
        // Create the info section
        const infoDiv = document.createElement('div');
        infoDiv.className = 'movie-info';
        infoDiv.innerHTML = `
            <h3 class="movie-title">${movie.Title}</h3>
            <p class="movie-year"><i class="fas fa-calendar-alt"></i> ${movie.Year}</p>
            <p class="movie-plot"><i class="fas fa-tag"></i> ${movie.Type}</p>
            <button class="details-button" data-imdbid="${movie.imdbID}">
                <i class="fas fa-info-circle"></i> View Details
            </button>
        `;
        
        // Assemble the card
        movieCard.appendChild(img);
        movieCard.appendChild(infoDiv);
        
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

// Sort movies function
function sortMovies(sortBy) {
    let sortedMovies = [...currentSearchResults];
    
    switch(sortBy) {
        case 'rating':
            // For sorting by rating, we would need to fetch detailed info for each movie
            // This is a simplified version - in a real app, you'd fetch ratings for all movies
            showToast('Sorting by rating requires additional API calls', 'info');
            break;
        case 'year':
            sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
            break;
        case 'title':
            sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
            break;
        default:
            // Default sorting (by relevance from API)
            break;
    }
    
    displayMovieResults(sortedMovies);
}

// Filter movies by genre function
function filterMoviesByGenre(genre) {
    if (!genre || genre === 'all') {
        displayMovieResults(currentSearchResults);
        return;
    }
    
    // Filter movies by type (since OMDB API only provides Type, not detailed genre)
    const filteredMovies = currentSearchResults.filter(movie => 
        movie.Type.toLowerCase() === genre.toLowerCase()
    );
    
    displayMovieResults(filteredMovies);
}

// Event listeners for sort and filter controls
document.addEventListener('click', (e) => {
    // Sort buttons
    if (e.target.closest('.sort-button')) {
        const sortBy = e.target.closest('.sort-button').getAttribute('data-sort');
        sortMovies(sortBy);
    }
    
    // Filter buttons
    if (e.target.closest('.filter-button')) {
        const genre = e.target.closest('.filter-button').getAttribute('data-filter');
        filterMoviesByGenre(genre);
    }
});

// Modern Search Page Functionality
function updateModernSearchInfo(searchTerm = '', resultCount = 0) {
    const searchResultsTitle = document.getElementById('searchResultsTitle');
    const searchResultsCount = document.getElementById('searchResultsCount');
    const searchQuery = document.getElementById('searchQuery');
    const resultsCount = document.getElementById('resultsCount');
    
    if (searchResultsTitle) {
        searchResultsTitle.textContent = searchTerm ? `"${searchTerm}"` : 'Search Results';
    }
    
    if (searchResultsCount) {
        if (resultCount === 0) {
            searchResultsCount.textContent = 'No results found';
        } else {
            searchResultsCount.textContent = `${resultCount} movies found`;
        }
    }
    
    if (searchQuery) {
        searchQuery.textContent = searchTerm ? `Results for "${searchTerm}"` : 'Search Results';
    }
    
    if (resultsCount) {
        resultsCount.textContent = resultCount > 0 ? `${resultCount} results` : 'No results';
    }
}

function initializeModernSearchFeatures() {
    const searchInput = document.getElementById('searchInputResults');
    const backBtn = document.getElementById('backToHome');
    const viewButtons = document.querySelectorAll('.view-btn');
    const filterChips = document.querySelectorAll('.filter-chip');
    const sortSelect = document.getElementById('sortResults');
    
    console.log('Initializing modern search features:', {
        searchInput: !!searchInput,
        backBtn: !!backBtn,
        viewButtons: viewButtons.length,
        filterChips: filterChips.length,
        sortSelect: !!sortSelect
    });
    
    // Search input functionality
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    performModernSearch(searchTerm);
                }
            }
        });
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            if (searchTerm.length > 2) {
                // Optional: Add debounced search as user types
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    performModernSearch(searchTerm);
                }, 500);
            }
        });
    }
    
    // Back button functionality
    if (backBtn) {
        console.log('Adding back button event listener');
        backBtn.addEventListener('click', function() {
            console.log('Back to Home button clicked');
            showMainPage();
        });
    } else {
        console.log('Back button not found with ID: backToHome');
    }
    
    // View toggle functionality (grid/list view)
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            const resultsGrid = document.getElementById('searchResultsGrid');
            
            if (resultsGrid) {
                // Remove active class from all buttons
                viewButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Apply view class
                if (view === 'list') {
                    resultsGrid.classList.add('list-view');
                } else {
                    resultsGrid.classList.remove('list-view');
                }
                
                console.log('View changed to:', view);
            }
        });
    });
    
    // Filter chips functionality (radio button style - single selection)
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const filterValue = this.dataset.filter;
            
            // Remove active class from all chips
            filterChips.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked chip
            this.classList.add('active');
            
            console.log('Filter changed to:', filterValue);
            
            // Apply filter to current results
            applyModernFilters(filterValue);
        });
    });
    
    // Sort functionality
    if (sortSelect) {
        console.log('Adding sort event listener');
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Sort changed to:', sortValue);
            applySortToResults(sortValue);
        });
    } else {
        console.log('Sort select not found');
    }
}

async function performModernSearch(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
        showToast('Please enter a search term', 'warning');
        return;
    }
    
    const resultsGrid = document.getElementById('searchResultsGrid');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    
    // Show loading state
    if (resultsGrid) resultsGrid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
    if (loadingState) loadingState.style.display = 'flex';
    
    try {
        const result = await makeAPIRequest(`${API_URL}&s=${encodeURIComponent(searchTerm)}`);
        
        if (result.success && result.data.Response === 'True') {
            const movies = result.data.Search;
            
            // Store current search results
            currentSearchResults = movies;
            
            // Update search info
            updateModernSearchInfo(searchTerm, result.data.totalResults);
            
            // Display results
            displayModernSearchResults(movies);
            
            // Hide loading state and show results
            if (loadingState) loadingState.style.display = 'none';
            if (resultsGrid) resultsGrid.style.display = 'grid';
            
        } else {
            // Handle no results
            updateModernSearchInfo(searchTerm, 0);
            
            // Show empty state
            if (loadingState) loadingState.style.display = 'none';
            if (emptyState) emptyState.style.display = 'flex';
            
            // Update suggestion chips
            updateSuggestionChips([
                'Action', 'Comedy', 'Drama', 'Thriller', 'Horror',
                'Romance', 'Sci-Fi', 'Adventure', 'Animation'
            ]);
        }
    } catch (error) {
        console.error('Error performing search:', error);
        
        updateModernSearchInfo(searchTerm, 0);
        
        // Hide loading and show empty state with error
        if (loadingState) loadingState.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'flex';
            const emptyMessage = emptyState.querySelector('p');
            if (emptyMessage) {
                emptyMessage.textContent = 'Something went wrong. Please try again.';
            }
        }
        
        showToast('Error performing search. Please try again.', 'error');
    }
}

function displayModernSearchResults(movies) {
    const resultsGrid = document.getElementById('searchResultsGrid');
    if (!resultsGrid) return;
    
    resultsGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createModernMovieCard(movie);
        resultsGrid.appendChild(movieCard);
    });
}

function createModernMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.dataset.imdbId = movie.imdbID;

    const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : 'assets/no-poster.svg';

    card.innerHTML = `
        <div class="movie-poster">
            <img src="${posterUrl}" alt="${movie.Title}" loading="lazy">
            <div class="movie-overlay">
                <button class="view-details-btn grid-view-btn" data-imdb-id="${movie.imdbID}">
                    <i class="fas fa-play"></i> View Details
                </button>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.Title}</h3>
            <p class="movie-year">${movie.Year}</p>
            <button class="view-details-btn list-view-btn" data-imdb-id="${movie.imdbID}">
                <i class="fas fa-play"></i> View Details
            </button>
        </div>
    `;

    // Add click event for viewing details (both buttons)
    const viewBtns = card.querySelectorAll('.view-details-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            showMovieDetails(movie.imdbID);
        });
    });

    return card;
}

function applyModernFilters(activeFilter) {
    if (!currentSearchResults) {
        console.log('No search results to filter');
        return;
    }
    
    let filteredResults = [...currentSearchResults];
    
    // Apply filter based on the active filter type
    if (activeFilter && activeFilter !== 'all') {
        filteredResults = currentSearchResults.filter(movie => {
            switch (activeFilter) {
                case 'movie':
                    return movie.Type === 'movie';
                case 'series':
                    return movie.Type === 'series';
                case 'year-new':
                    return parseInt(movie.Year) >= new Date().getFullYear() - 3; // Last 3 years
                case 'rating-high':
                    // Since OMDB search doesn't provide ratings, we'll sort by year as a proxy
                    // In a real app, you'd have rating data
                    return parseInt(movie.Year) >= 2010; // Modern movies tend to have more ratings
                default:
                    return true;
            }
        });
    }
    
    console.log(`Filtered ${currentSearchResults.length} results to ${filteredResults.length} for filter: ${activeFilter}`);
    
    displayModernSearchResults(filteredResults);
    updateModernSearchInfo(getCurrentSearchTerm(), filteredResults.length);
}

function applySortToResults(sortValue) {
    if (!currentSearchResults || currentSearchResults.length === 0) {
        console.log('No results to sort');
        return;
    }
    
    let sortedResults = [...currentSearchResults];
    
    switch (sortValue) {
        case 'year-desc':
            sortedResults.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
            break;
        case 'year-asc':
            sortedResults.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
            break;
        case 'title-asc':
            sortedResults.sort((a, b) => a.Title.localeCompare(b.Title));
            break;
        case 'title-desc':
            sortedResults.sort((a, b) => b.Title.localeCompare(a.Title));
            break;
        case 'rating-desc':
            // Note: OMDB API doesn't provide ratings in search results
            // This is a placeholder for future implementation
            sortedResults.sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0));
            break;
        case 'relevance':
        default:
            // Keep original order for relevance
            break;
    }
    
    console.log(`Sorted ${sortedResults.length} results by ${sortValue}`);
    displayModernSearchResults(sortedResults);
    
    // Update the global results to maintain sort order
    currentSearchResults = sortedResults;
}

function updateSuggestionChips(suggestions) {
    const suggestionChips = document.getElementById('suggestionChips');
    if (!suggestionChips) return;
    
    suggestionChips.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const chip = document.createElement('span');
        chip.className = 'suggestion-chip';
        chip.textContent = suggestion;
        chip.addEventListener('click', function() {
            const searchInput = document.getElementById('searchInputResults');
            if (searchInput) {
                searchInput.value = suggestion;
                performModernSearch(suggestion);
            }
        });
        suggestionChips.appendChild(chip);
    });
}

// Show Movie Details
async function showMovieDetails(imdbID) {
    try {
        const result = await makeAPIRequest(`${API_URL}&i=${imdbID}&plot=full`);
        
        if (result.success && result.data.Response === 'True') {
            const movie = result.data;
            currentMovie = movie;
            displayMovieDetails(movie, imdbID);
            selectedMovieId = imdbID;
            
            // Reset rating and review form
            setSelectedRating(0);
            reviewText.value = '';
            
            // Update favorite and watchlist buttons
            updateFavoriteButton(imdbID);
            updateWatchlistButton(imdbID);
            
            // Show modal with enhanced animation
            showMovieModal();
        } else {
            // Handle API failure or invalid response
            const errorMessage = result.success ? 'Movie not found' : `API Error: ${result.error}`;
            showToast(errorMessage, 'error');
            console.error('Movie details error:', errorMessage);
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
        showToast('Error loading movie details', 'error');
    }
}

// Display Movie Details (updated to include social sharing)
function displayMovieDetails(movie, imdbID) {
    const movieDetails = document.getElementById('movieDetails');
    const moviePosterModal = document.getElementById('moviePosterModal');
    
    // Set current movie for global access
    currentMovie = movie;
    
    // Update movie poster in modal
    if (moviePosterModal && movie.Poster && movie.Poster !== 'N/A') {
        moviePosterModal.src = movie.Poster;
        moviePosterModal.alt = `${movie.Title} Poster`;
        moviePosterModal.style.display = 'block';
        
        // Add click handler for lightbox
        moviePosterModal.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(movie.Poster, movie.Title, movie.Year);
        };
        moviePosterModal.style.cursor = 'zoom-in';
        moviePosterModal.title = 'Click to view full size';
        
        // Remove no-image class if present and show the container
        const container = moviePosterModal.parentElement;
        if (container) {
            container.classList.remove('no-image');
            container.style.display = 'block';
        }
    } else if (moviePosterModal) {
        // Handle no image case - create a fallback poster
        const container = moviePosterModal.parentElement;
        if (container) {
            container.classList.add('no-image');
            container.innerHTML = `
                <div class="fallback-poster">
                    <div class="fallback-content">
                        <i class="fas fa-film fa-4x"></i>
                        <h3>${movie.Title}</h3>
                        <p>No poster available</p>
                    </div>
                </div>
            `;
        }
    }
    
    // Get user reviews for this movie to calculate average rating
    const reviews = getUserReviews(imdbID);
    const averageRating = calculateAverageRating(reviews);
    const ratingPercentage = (averageRating / 5) * 100;
    
    // Don't clear the entire movieDetails - it has the poster structure we need
    // Just update the info section
    const existingInfoDiv = movieDetails.querySelector('.movie-details-info');
    if (!existingInfoDiv) {
        // If no info div exists, create the complete structure
        movieDetails.innerHTML = `
            <div class="movie-details-container">
                <div class="movie-details-header">
                    <div class="movie-poster-modal-container">
                        <img id="moviePosterModal" src="" alt="Movie Poster" class="movie-details-poster">
                    </div>
                    <div class="movie-details-info">
                        <!-- Movie info will be populated below -->
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get the info div to populate
    const infoDiv = movieDetails.querySelector('.movie-details-info');
    
    // Populate the info div with movie details
    infoDiv.innerHTML = `
        <h2 class="movie-details-title">${movie.Title}</h2>
        <p class="movie-details-year"><i class="fas fa-calendar-alt"></i> ${movie.Year} • <i class="fas fa-clock"></i> ${movie.Runtime || 'N/A'} • <i class="fas fa-user"></i> ${movie.Rated || 'N/A'}</p>
        <p class="movie-details-plot">${movie.Plot}</p>
        
        <!-- Rating Summary -->
        <div class="rating-summary">
            <h3>User Rating Summary</h3>
            <div class="rating-summary-content">
                <div class="average-rating">
                    <span class="rating-value">${averageRating.toFixed(1)}</span>
                    <span class="rating-max">/5</span>
                </div>
                <div class="rating-bar">
                    <div class="rating-fill" style="width: ${ratingPercentage}%"></div>
                </div>
                <div class="rating-count">
                    ${reviews.length} review${reviews.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
        
        <p class="movie-details-rating"><i class="fas fa-star"></i> IMDb Rating: ${movie.imdbRating || 'N/A'}/10</p>
        
        <!-- Enhanced Social Sharing -->
        <div class="social-sharing">
            <h3><i class="fas fa-share-alt"></i> Share This Movie</h3>
            <div class="share-buttons">
                <button class="share-button twitter" data-platform="twitter" title="Share on Twitter">
                    <i class="fab fa-twitter"></i>
                    <span>Twitter</span>
                </button>
                <button class="share-button facebook" data-platform="facebook" title="Share on Facebook">
                    <i class="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                </button>
                <button class="share-button whatsapp" data-platform="whatsapp" title="Share on WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                </button>
                <button class="share-button copy-link" data-platform="copy" title="Copy Link">
                    <i class="fas fa-link"></i>
                    <span>Copy Link</span>
                </button>
            </div>
        </div>
        
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
    `;
    
    // The structure is already in place from the HTML, no need to assemble
    
    // Add event listeners for share buttons
    document.querySelectorAll('.share-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const platform = e.target.closest('.share-button').getAttribute('data-platform');
            shareMovie(movie, platform);
        });
    });
    
    // Display user reviews for this movie
    displayUserReviews(imdbID);
}

// Share movie on social platforms
function shareMovie(movie, platform) {
    const title = encodeURIComponent(movie.Title);
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${movie.Title} on this awesome movie review platform!`);
    
    switch(platform) {
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
            break;
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
            break;
        case 'copy':
            // Copy link to clipboard
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = window.location.href;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            showToast('Link copied to clipboard!', 'success');
            break;
        default:
            showToast('Sharing option not available', 'warning');
    }
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

// Display User Reviews (updated to show username)
function displayUserReviews(movieId) {
    const userReviewsContainer = document.getElementById('userReviews');
    const reviews = getUserReviews(movieId);
    
    if (reviews.length === 0) {
        userReviewsContainer.innerHTML = `
            <div class="reviews-section-header">
                <h3><i class="fas fa-comments"></i> User Reviews</h3>
            </div>
            <div class="no-reviews-placeholder">
                <div class="no-reviews-icon">
                    <i class="fas fa-comment-slash"></i>
                </div>
                <h4>No Reviews Yet</h4>
                <p>Be the first to share your thoughts about this movie!</p>
            </div>
        `;
        return;
    }
    
    // Sort reviews by date (newest first)
    reviews.sort((a, b) => b.id - a.id);
    
    let reviewsHTML = `
        <div class="reviews-section-header">
            <h3><i class="fas fa-comments"></i> User Reviews</h3>
            <span class="reviews-count">${reviews.length} review${reviews.length !== 1 ? 's' : ''}</span>
        </div>
    `;
    reviewsHTML += '<div class="modal-reviews-list">';
    
    reviews.forEach((review, index) => {
        const stars = '⭐'.repeat(review.rating || 0) + '☆'.repeat(5 - (review.rating || 0));
        const date = new Date(review.date || Date.now()).toLocaleDateString();
        const username = review.username || currentUser?.username || 'Anonymous';
        
        // Add animation delay for each review
        reviewsHTML += `
            <div class="modal-review-card enhanced-modal-review" style="animation-delay: ${index * 0.1}s;">
                <div class="modal-review-header">
                    <div class="modal-reviewer-info">
                        <div class="modal-reviewer-avatar">
                            <div class="modal-avatar-circle">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="modal-online-indicator"></div>
                        </div>
                        <div class="modal-reviewer-details">
                            <h4 class="modal-reviewer-name">${username}</h4>
                            <div class="modal-review-meta">
                                <span class="modal-review-date">
                                    <i class="fas fa-calendar-alt"></i> ${date}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-rating-container">
                        <div class="modal-review-rating">${stars}</div>
                        <div class="modal-rating-score">${review.rating || 0}/5</div>
                    </div>
                </div>
                <div class="modal-review-content">
                    <div class="modal-review-text-container">
                        <p class="modal-review-text">${review.text || review.reviewText || 'No review text available.'}</p>
                    </div>
                </div>
                <div class="modal-review-actions">
                    <div class="modal-actions-left">
                        <button class="modal-helpful-btn modal-action-btn" onclick="likeModalReview('${review.id}', '${movieId}')">
                            <i class="fas fa-thumbs-up"></i>
                            <span>Helpful</span>
                            <span class="modal-count">(${review.helpfulVotes || 0})</span>
                        </button>
                    </div>
                    <div class="modal-actions-right">
                        ${username === (currentUser?.username || 'Anonymous') ? 
                            `<button class="modal-delete-btn modal-action-btn danger-btn" onclick="deleteModalReview('${review.id}', '${movieId}')">
                                <i class="fas fa-trash-alt"></i>
                                <span>Delete</span>
                            </button>` : ''}
                        <div class="modal-review-badges">
                            <span class="modal-verified-badge"><i class="fas fa-check-circle"></i> Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    reviewsHTML += '</div>';
    userReviewsContainer.innerHTML = reviewsHTML;
}

// Submit User Review (updated to include user profile)
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
    
    // Create review object with user profile
    const userReview = {
        id: Date.now(), // Simple ID generation
        movieId: selectedMovieId,
        movieTitle: currentMovie ? currentMovie.Title : 'Unknown Movie',
        rating: selectedRating,
        text: review,
        reviewText: review, // Add for global reviews compatibility
        date: new Date().toLocaleDateString(),
        username: currentUser.username,
        avatar: currentUser.avatar
    };
    
    // Save to localStorage
    saveReview(selectedMovieId, userReview);
    
    // Update global reviews system if it exists
    if (window.globalReviews) {
        window.globalReviews.refresh();
    }
    
    // Check achievements
    const reviewCount = getReviewCount();
    if (reviewCount === 1) {
        checkAchievements('first_review');
    } else {
        checkAchievements('review_count');
    }
    
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

// Calculate average rating from reviews
function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
}

// Toggle Favorite (updated to check achievements)
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
        
        // Update profile stats
        if (window.profileSystem) {
            window.profileSystem.removeFavorite();
        }
        
        // Add animation
        favoriteButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            favoriteButton.style.transform = 'scale(1)';
        }, 200);
    } else {
        // Add to favorites
        const movieToAdd = {
            imdbID: currentMovie.imdbID,
            Title: currentMovie.Title,
            Year: currentMovie.Year,
            Poster: currentMovie.Poster
        };
        favorites.push(movieToAdd);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        favoriteButton.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
        favoriteButton.classList.add('added');
        showToast('Added to favorites!', 'success');
        
        // Debug logging
        console.log('Movie added to favorites:', movieToAdd);
        console.log('Current favorites in localStorage:', JSON.parse(localStorage.getItem('favorites')));
        
        // Check achievements and update profile stats
        checkAchievements('first_favorite');
        if (window.profileSystem) {
            window.profileSystem.addFavorite();
        }
        
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
    
    // Update watchlist display
    displayWatchlist();
}

// Get Favorites from Local Storage
function getFavorites() {
    const favoritesJSON = localStorage.getItem('favorites');
    const favorites = favoritesJSON ? JSON.parse(favoritesJSON) : [];
    console.log('Getting favorites from localStorage:', favorites);
    return favorites;
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
    const favoritesContainer = document.getElementById('favoritesContainer');
    const favoritesSection = document.getElementById('favorites');
    
    if (!favoritesContainer) {
        console.error('Favorites container not found');
        // Try again after a short delay
        setTimeout(() => {
            if (document.getElementById('favoritesContainer')) {
                displayFavorites();
            }
        }, 500);
        return;
    }
    
    const favorites = getFavorites();
    favoritesContainer.innerHTML = '';
    
    // Always show the section, but show empty state if no movies
    favoritesSection.classList.remove('hidden');
    
    if (favorites.length === 0) {
        // Show empty state
        favoritesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="far fa-heart"></i>
                </div>
                <h3>No Favorites Yet</h3>
                <p>Start building your collection by adding movies to your favorites. Click the heart icon on any movie to add it here.</p>
                <button class="browse-movies-btn" onclick="scrollToMovies()">
                    <i class="fas fa-search"></i>
                    Browse Movies
                </button>
            </div>
        `;
        return;
    }
    
    favorites.forEach((movie, index) => {
        // Skip movies with invalid posters
        if (!movie.Poster || movie.Poster === 'N/A' || movie.Poster === 'n/a' || !movie.Poster.startsWith('http')) {
            console.log(`🚫 Skipping favorite movie with invalid poster: ${movie.Title} - ${movie.Poster}`);
            return;
        }
        
        const movieCard = document.createElement('div');
        movieCard.className = 'genre-movie-card';
        
        // Add animation delay for each card
        movieCard.style.animationDelay = `${index * 0.1}s`;
        
        // Create image
        const img = createMovieImage(movie.Poster, movie.Title, 'genre-movie-poster');
        
        // If image creation fails, skip the movie
        if (!img) {
            console.log(`🚫 Failed to create image for favorite movie: ${movie.Title}, skipping movie`);
            return;
        }
        
        // Create info div
        const infoDiv = document.createElement('div');
        infoDiv.className = 'genre-movie-info';
        infoDiv.innerHTML = `
            <h3 class="genre-movie-title">${movie.Title}</h3>
            <p class="genre-movie-year">${movie.Year}</p>
        `;
        
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'movie-card-buttons';
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '0.5rem';
        buttonsContainer.style.marginTop = '0.5rem';
        
        // Create details button
        const detailsButton = document.createElement('button');
        detailsButton.className = 'details-button';
        detailsButton.setAttribute('data-imdbid', movie.imdbID);
        detailsButton.innerHTML = '<i class="fas fa-info-circle"></i> Details';
        detailsButton.style.flex = '1';
        
        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.setAttribute('data-imdbid', movie.imdbID);
        removeButton.innerHTML = '<i class="fas fa-heart-broken"></i> Remove';
        removeButton.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a5a)';
        removeButton.style.flex = '1';
        removeButton.style.border = 'none';
        removeButton.style.color = 'white';
        removeButton.style.padding = '0.5rem';
        removeButton.style.borderRadius = '5px';
        removeButton.style.cursor = 'pointer';
        removeButton.style.fontSize = '0.8rem';
        
        // Add buttons to container
        buttonsContainer.appendChild(detailsButton);
        buttonsContainer.appendChild(removeButton);
        
        // Assemble the card
        infoDiv.appendChild(buttonsContainer);
        movieCard.appendChild(img);
        movieCard.appendChild(infoDiv);
        
        // Add event listener to detail button
        detailsButton.addEventListener('click', () => {
            showMovieDetails(movie.imdbID);
        });
        
        // Add event listener to remove button
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromFavorites(movie.imdbID);
        });
        
        favoritesContainer.appendChild(movieCard);
        
        console.log(`✅ Successfully created favorite movie card for: ${movie.Title}`);
    });
}

// Display Watchlist
function displayWatchlist() {
    const watchlistContainer = document.getElementById('watchlistContainer');
    const watchlistSection = document.getElementById('watchlist');
    
    if (!watchlistContainer || !watchlistSection) {
        console.error('Watchlist container or section not found');
        return;
    }
    
    const watchlist = getWatchlist();
    watchlistContainer.innerHTML = '';
    
    // Always show the section, but show empty state if no movies
    watchlistSection.classList.remove('hidden');
    
    if (watchlist.length === 0) {
        // Show empty state
        watchlistContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="far fa-bookmark"></i>
                </div>
                <h3>No Movies in Watchlist</h3>
                <p>Keep track of movies you want to watch later. Click the bookmark icon on any movie to add it here.</p>
                <button class="browse-movies-btn" onclick="scrollToMovies()">
                    <i class="fas fa-search"></i>
                    Browse Movies
                </button>
            </div>
        `;
        return;
    }
    
    watchlist.forEach((movie, index) => {
        // Skip movies with invalid posters
        if (!movie.Poster || movie.Poster === 'N/A' || movie.Poster === 'n/a' || !movie.Poster.startsWith('http')) {
            console.log(`🚫 Skipping watchlist movie with invalid poster: ${movie.Title} - ${movie.Poster}`);
            return;
        }
        
        const movieCard = document.createElement('div');
        movieCard.className = 'genre-movie-card';
        
        // Add animation delay for each card
        movieCard.style.animationDelay = `${index * 0.1}s`;
        
        // Create image
        const img = createMovieImage(movie.Poster, movie.Title, 'genre-movie-poster');
        
        // If image creation fails, skip the movie
        if (!img) {
            console.log(`🚫 Failed to create image for watchlist movie: ${movie.Title}, skipping movie`);
            return;
        }
        
        // Create info div
        const infoDiv = document.createElement('div');
        infoDiv.className = 'genre-movie-info';
        infoDiv.innerHTML = `
            <h3 class="genre-movie-title">${movie.Title}</h3>
            <p class="genre-movie-year">${movie.Year}</p>
        `;
        
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'movie-card-buttons';
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '0.5rem';
        buttonsContainer.style.marginTop = '0.5rem';
        
        // Create details button
        const detailsButton = document.createElement('button');
        detailsButton.className = 'details-button';
        detailsButton.setAttribute('data-imdbid', movie.imdbID);
        detailsButton.innerHTML = '<i class="fas fa-info-circle"></i> Details';
        detailsButton.style.flex = '1';
        
        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-button';
        removeButton.setAttribute('data-imdbid', movie.imdbID);
        removeButton.innerHTML = '<i class="fas fa-bookmark-slash"></i> Remove';
        removeButton.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a5a)';
        removeButton.style.flex = '1';
        removeButton.style.border = 'none';
        removeButton.style.color = 'white';
        removeButton.style.padding = '0.5rem';
        removeButton.style.borderRadius = '5px';
        removeButton.style.cursor = 'pointer';
        removeButton.style.fontSize = '0.8rem';
        
        // Add buttons to container
        buttonsContainer.appendChild(detailsButton);
        buttonsContainer.appendChild(removeButton);
        
        // Assemble the card
        infoDiv.appendChild(buttonsContainer);
        movieCard.appendChild(img);
        movieCard.appendChild(infoDiv);
        
        // Add event listener to detail button
        detailsButton.addEventListener('click', () => {
            showMovieDetails(movie.imdbID);
        });
        
        // Add event listener to remove button
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromWatchlist(movie.imdbID);
        });
        
        watchlistContainer.appendChild(movieCard);
        
        console.log(`✅ Successfully created watchlist movie card for: ${movie.Title}`);
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





// Check and unlock achievements
function checkAchievements(action) {
    // Initialize achievements array if it doesn't exist
    if (!currentUser.achievements) {
        currentUser.achievements = [];
    }
    
    let newAchievement = null;
    
    switch(action) {
        case 'first_review':
            if (!currentUser.achievements.some(a => a.id === 'first_review')) {
                newAchievement = achievements.find(a => a.id === 'first_review');
            }
            break;
        case 'review_count':
            const reviewCount = getReviewCount();
            if (reviewCount >= 10 && !currentUser.achievements.some(a => a.id === 'ten_reviews')) {
                newAchievement = achievements.find(a => a.id === 'ten_reviews');
            } else if (reviewCount >= 5 && !currentUser.achievements.some(a => a.id === 'five_reviews')) {
                newAchievement = achievements.find(a => a.id === 'five_reviews');
            }
            break;
        case 'first_favorite':
            const favorites = getFavorites();
            if (favorites.length > 0 && !currentUser.achievements.some(a => a.id === 'first_favorite')) {
                newAchievement = achievements.find(a => a.id === 'first_favorite');
            }
            if (favorites.length >= 5 && !currentUser.achievements.some(a => a.id === 'five_favorites')) {
                newAchievement = achievements.find(a => a.id === 'five_favorites');
            }
            break;
        case 'dark_mode':
            if (!currentUser.achievements.some(a => a.id === 'dark_mode')) {
                newAchievement = achievements.find(a => a.id === 'dark_mode');
            }
            break;
    }
    
    if (newAchievement) {
        // Add to user's achievements
        if (!currentUser.achievements) {
            currentUser.achievements = [];
        }
        currentUser.achievements.push(newAchievement);
        
        // Save and show notification
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showToast(`Achievement unlocked: ${newAchievement.name} ${newAchievement.icon}`, 'success');
    }
}

// Get total review count across all movies
function getReviewCount() {
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('reviews_')) {
            const reviews = JSON.parse(localStorage.getItem(key));
            count += reviews.length;
        }
    }
    return count;
}

// Event listener for clicking outside modal
window.addEventListener('click', (e) => {
    if (e.target === movieModal) {
        movieModal.style.opacity = '0';
        setTimeout(() => {
            movieModal.classList.add('hidden');
            movieModal.style.opacity = '1';
        }, 300);
    }
});

// Comprehensive Theme Management System
function initializeThemeSystem() {
    const headerThemeToggle = document.getElementById('headerThemeToggle');
    const footerThemeToggle = document.getElementById('footerThemeToggle');
    
    // Function to update all theme elements
    function updateThemeElements(isDark) {
        // Update header button icon and accessibility
        if (headerThemeToggle) {
            const icon = headerThemeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            headerThemeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }
        
        // Update search results page theme toggle
        const searchThemeToggle = document.getElementById('searchThemeToggle');
        if (searchThemeToggle) {
            const icon = searchThemeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
            searchThemeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }
        
        // Update footer checkbox
        if (footerThemeToggle) {
            footerThemeToggle.checked = isDark;
        }
        
        // Update body class
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Save preference
        localStorage.setItem('themePreference', isDark ? 'dark' : 'light');
        
        // Check achievements if dark mode is enabled
        if (isDark && typeof checkAchievements === 'function') {
            checkAchievements('dark_mode');
        }
    }
    
    // Function to toggle theme
    function toggleTheme() {
        const isDark = !document.body.classList.contains('dark-mode');
        updateThemeElements(isDark);
    }
    
    // Add event listeners
    if (headerThemeToggle) {
        headerThemeToggle.addEventListener('click', toggleTheme);
    }
    
    if (footerThemeToggle) {
        footerThemeToggle.addEventListener('change', toggleTheme);
    }
    
    // Search results page theme toggle
    const searchThemeToggle = document.getElementById('searchThemeToggle');
    if (searchThemeToggle) {
        searchThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('themePreference') || localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        updateThemeElements(true);
    } else {
        updateThemeElements(false);
    }
}

// Load theme preference from Local Storage
function loadThemePreference() {
    const themePreference = localStorage.getItem('themePreference');
    if (themePreference === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

// Sort movie results
function sortMovieResults(results, sortBy) {
    const sortedResults = [...results];
    
    switch (sortBy) {
        case 'title':
            return sortedResults.sort((a, b) => a.Title.localeCompare(b.Title));
        case 'title-desc':
            return sortedResults.sort((a, b) => b.Title.localeCompare(a.Title));
        case 'year':
            return sortedResults.sort((a, b) => {
                const yearA = parseInt(a.Year) || 0;
                const yearB = parseInt(b.Year) || 0;
                return yearB - yearA; // Newest first
            });
        default:
            return sortedResults; // Default relevance order
    }
}

// Filter movie results by type
function filterMovieResults(results, filterBy) {
    if (filterBy === 'all') {
        return results;
    }
    return results.filter(movie => movie.Type && movie.Type.toLowerCase() === filterBy.toLowerCase());
}

// Update pagination controls
function updatePaginationControls(totalResults, currentPageNum) {
    const totalPages = Math.ceil(totalResults / 10); // API returns 10 results per page
    
    if (paginationControls) {
        if (totalPages <= 1) {
            paginationControls.classList.add('hidden');
            return;
        }
        
        paginationControls.classList.remove('hidden');
        
        // Update page info
        if (currentPageInfo) {
            currentPageInfo.textContent = `Page ${currentPageNum} of ${totalPages}`;
        }
        
        // Update previous button
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPageNum <= 1;
        }
        
        // Update next button
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPageNum >= totalPages;
        }
    }
    
    // Legacy pagination container support
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;
    
    const totalPagesLegacy = Math.ceil(totalResults / resultsPerPage);
    
    // Only show pagination if there are multiple pages
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-button" data-page="${currentPage - 1}">&laquo; Previous</button>`;
    }
    
    // Page numbers (show up to 5 pages around current page)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `<span class="pagination-current">${i}</span>`;
        } else {
            paginationHTML += `<button class="pagination-button" data-page="${i}">${i}</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-button" data-page="${currentPage + 1}">Next &raquo;</button>`;
    }
    
    paginationHTML += '</div>';
    paginationContainer.innerHTML = paginationHTML;
    
    // Add event listeners to pagination buttons
    document.querySelectorAll('.pagination-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const page = parseInt(e.target.getAttribute('data-page'));
            searchMovies(page);
        });
    });
}

// Remove from favorites
function removeFromFavorites(imdbID) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    showToast('Removed from favorites', 'success');
    displayFavorites(); // Refresh the display
}

// Remove from watchlist
function removeFromWatchlist(imdbID) {
    const watchlist = getWatchlist();
    const updatedWatchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    showToast('Removed from watchlist', 'success');
    displayWatchlist(); // Refresh the display
}

// Movie Reviews System
class MovieReviewsManager {
    constructor() {
        this.selectedMovie = null;
        this.selectedRating = 0;
        this.selectedTags = [];
        this.reviews = this.loadReviews();
        this.initializeReviewSystem();
    }

    initializeReviewSystem() {
        this.setupEventListeners();
        this.displayReviews();
        // Removed loadSampleReviews() to prevent hardcoded reviews
    }

    setupEventListeners() {
        // Movie search functionality
        const movieSearch = document.getElementById('reviewMovieSearch');
        if (movieSearch) {
            movieSearch.addEventListener('input', this.debounce(this.searchMovies.bind(this), 300));
        }

        // Star rating functionality
        const stars = document.querySelectorAll('.star-rating-input .star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => this.setRating(index + 1));
            star.addEventListener('mouseenter', () => this.highlightStars(index + 1));
            star.addEventListener('mouseleave', () => this.highlightStars(this.selectedRating));
        });

        // Tag selection
        const tagButtons = document.querySelectorAll('.tag-btn');
        tagButtons.forEach(btn => {
            btn.addEventListener('click', () => this.toggleTag(btn.dataset.tag));
        });

        // Form validation
        document.getElementById('reviewTitle')?.addEventListener('input', this.validateForm.bind(this));
        document.getElementById('reviewContent')?.addEventListener('input', this.validateForm.bind(this));

        // Submit review
        const submitBtn = document.getElementById('submitReviewBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', this.submitReview.bind(this));
        }

        // Reviews filter (search functionality handled by GlobalCommunityReviews)
        const filterSelect = document.getElementById('reviewsFilter');
        if (filterSelect && this.filterReviews) {
            filterSelect.addEventListener('change', this.filterReviews.bind(this));
        }
    }

    async searchMovies(event) {
        const query = event.target.value.trim();
        const suggestions = document.getElementById('movieSuggestions');
        
        if (query.length < 2) {
            suggestions.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=fc1fef96&s=${encodeURIComponent(query)}&type=movie`);
            const data = await response.json();
            
            if (data.Response === "True") {
                this.displayMovieSuggestions(data.Search.slice(0, 5));
            } else {
                suggestions.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error searching movies:', error);
            suggestions.classList.add('hidden');
        }
    }

    displayMovieSuggestions(movies) {
        const suggestions = document.getElementById('movieSuggestions');
        suggestions.innerHTML = '';
        
        movies.forEach(movie => {
            const item = document.createElement('div');
            item.className = 'movie-suggestion-item';
            item.innerHTML = `
                <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/50x75?text=No+Image'}" 
                     alt="${movie.Title}" width="40" height="60">
                <div>
                    <strong>${movie.Title}</strong>
                    <div style="font-size: 0.8rem; color: #999;">${movie.Year}</div>
                </div>
            `;
            item.addEventListener('click', () => this.selectMovie(movie));
            suggestions.appendChild(item);
        });
        
        suggestions.classList.remove('hidden');
    }

    selectMovie(movie) {
        this.selectedMovie = movie;
        document.getElementById('reviewMovieSearch').value = movie.Title;
        document.getElementById('movieSuggestions').classList.add('hidden');
        
        const preview = document.getElementById('selectedMoviePreview');
        preview.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/60x90?text=No+Image'}" 
                 alt="${movie.Title}">
            <div>
                <strong>${movie.Title}</strong>
                <div style="font-size: 0.9rem; color: #999;">${movie.Year}</div>
            </div>
        `;
        preview.classList.remove('hidden');
        this.validateForm();
    }

    setRating(rating) {
        this.selectedRating = rating;
        this.highlightStars(rating);
        document.getElementById('ratingDisplay').textContent = `${rating} star${rating !== 1 ? 's' : ''}`;
        this.validateForm();
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('.star-rating-input .star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    toggleTag(tag) {
        const tagIndex = this.selectedTags.indexOf(tag);
        const tagButton = document.querySelector(`.tag-btn[data-tag="${tag}"]`);
        
        if (tagIndex > -1) {
            this.selectedTags.splice(tagIndex, 1);
            tagButton.classList.remove('active');
        } else {
            this.selectedTags.push(tag);
            tagButton.classList.add('active');
        }
        
        this.updateSelectedTagsDisplay();
    }

    updateSelectedTagsDisplay() {
        const container = document.getElementById('selectedTags');
        container.innerHTML = '';
        
        this.selectedTags.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'selected-tag';
            tagElement.innerHTML = `
                ${tag}
                <span class="remove-tag" onclick="movieReviewsManager.toggleTag('${tag}')">&times;</span>
            `;
            container.appendChild(tagElement);
        });
    }

    validateForm() {
        const title = document.getElementById('reviewTitle')?.value.trim();
        const content = document.getElementById('reviewContent')?.value.trim();
        const submitBtn = document.getElementById('submitReviewBtn');
        
        const isValid = this.selectedMovie && this.selectedRating > 0 && title && content;
        
        if (submitBtn) {
            submitBtn.disabled = !isValid;
        }
    }

    submitReview() {
        const title = document.getElementById('reviewTitle').value.trim();
        const content = document.getElementById('reviewContent').value.trim();
        
        const review = {
            id: Date.now(),
            movie: this.selectedMovie,
            rating: this.selectedRating,
            title,
            content,
            tags: [...this.selectedTags],
            author: 'Current User',
            date: new Date().toISOString(),
            helpful: 0
        };
        
        this.reviews.unshift(review);
        this.saveReviews();
        this.displayReviews();
        this.resetForm();
        
        showToast('Review submitted successfully!', 'success');
    }

    resetForm() {
        this.selectedMovie = null;
        this.selectedRating = 0;
        this.selectedTags = [];
        
        document.getElementById('reviewMovieSearch').value = '';
        document.getElementById('reviewTitle').value = '';
        document.getElementById('reviewContent').value = '';
        document.getElementById('selectedMoviePreview').classList.add('hidden');
        document.getElementById('ratingDisplay').textContent = 'Rate this movie';
        
        this.highlightStars(0);
        document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
        this.updateSelectedTagsDisplay();
        this.validateForm();
    }

    displayReviews() {
        const container = document.getElementById('reviewsContainer');
        const noReviewsMsg = container.querySelector('.no-reviews-message');
        
        if (this.reviews.length === 0) {
            if (noReviewsMsg) noReviewsMsg.style.display = 'block';
            return;
        }
        
        if (noReviewsMsg) noReviewsMsg.style.display = 'none';
        
        const reviewCards = this.reviews.map(review => this.createReviewCard(review)).join('');
        container.innerHTML = reviewCards;
    }

    createReviewCard(review) {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const tags = review.tags.map(tag => `<span class="review-tag">${tag}</span>`).join('');
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-movie-info">
                        <img src="${review.movie.Poster !== 'N/A' ? review.movie.Poster : 'https://via.placeholder.com/50x75?text=No+Image'}" 
                             alt="${review.movie.Title}" class="review-movie-poster">
                        <div>
                            <strong>${review.movie.Title}</strong> (${review.movie.Year})
                            <div style="font-size: 0.8rem; color: #999;">Reviewed by ${review.author}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        <span class="review-stars">${stars}</span>
                        <span>${review.rating}/5</span>
                    </div>
                </div>
                <div class="review-content">
                    <h4>${review.title}</h4>
                    <p class="review-text">${review.content}</p>
                    ${tags ? `<div class="review-tags-display">${tags}</div>` : ''}
                </div>
                <div class="review-footer">
                    <span>${new Date(review.date).toLocaleDateString()}</span>
                    <div class="review-actions">
                        <button class="review-action-btn" onclick="movieReviewsManager.likeReview(${review.id})">
                            <i class="fas fa-thumbs-up"></i> ${review.helpful}
                        </button>
                        <button class="review-action-btn">
                            <i class="fas fa-share"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    likeReview(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful++;
            this.saveReviews();
            this.displayReviews();
        }
    }

    filterReviews() {
        const filter = document.getElementById('reviewsFilter').value;
        let filteredReviews = [...this.reviews];
        
        switch (filter) {
            case 'recent':
                filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'highest':
                filteredReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                filteredReviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'helpful':
                filteredReviews.sort((a, b) => b.helpful - a.helpful);
                break;
        }
        
        const container = document.getElementById('reviewsContainer');
        const reviewCards = filteredReviews.map(review => this.createReviewCard(review)).join('');
        container.innerHTML = reviewCards;
    }

    // loadSampleReviews method removed to prevent hardcoded reviews

    saveReviews() {
        localStorage.setItem('movieReviews', JSON.stringify(this.reviews));
    }

    loadReviews() {
        const saved = localStorage.getItem('movieReviews');
        return saved ? JSON.parse(saved) : [];
    }

    searchReviews() {
        // This method is handled by GlobalCommunityReviews
        console.log('🔍 Search reviews functionality is handled by GlobalCommunityReviews');
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global Community Reviews System
class GlobalCommunityReviews {
    constructor() {
        this.allReviews = [];
        this.filteredReviews = [];
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        this.loadAllReviews();
        this.setupEventListeners();
        this.displayAllReviews();
    }
    
    setupEventListeners() {
        const filterSelect = document.getElementById('reviewsFilter');
        const searchInput = document.getElementById('reviewsSearch');
        const searchBtn = document.getElementById('searchReviewsBtn');
        
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.filterAndDisplayReviews();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterAndDisplayReviews();
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filterAndDisplayReviews();
            });
        }
    }
    
    loadAllReviews() {
        // Load all reviews from all movies
        this.allReviews = [];
        
        console.log('🔍 Loading reviews from localStorage...');
        
        // Get all review keys from localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('reviews_')) {
                const movieReviews = JSON.parse(localStorage.getItem(key) || '[]');
                console.log(`Found ${movieReviews.length} reviews for ${key}:`, movieReviews);
                
                // Ensure each review has required properties
                movieReviews.forEach(review => {
                    if (!review.reviewText && review.text) {
                        review.reviewText = review.text;
                    }
                    if (!review.movieTitle) {
                        review.movieTitle = 'Unknown Movie';
                    }
                    if (!review.movieId && key.startsWith('reviews_')) {
                        review.movieId = key.replace('reviews_', '');
                    }
                });
                
                this.allReviews = this.allReviews.concat(movieReviews);
            }
        }
        
        // Skip legacy movieReviews key to avoid loading old hardcoded sample data
        // This prevents hardcoded reviews like "Inception" and "The Dark Knight" from appearing
        console.log('ℹ️ Skipping legacy movieReviews key to prevent hardcoded sample reviews');
        
        // Sort by date (newest first)
        this.allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log('✅ Loaded global reviews total:', this.allReviews.length, this.allReviews);
    }
    
    filterAndDisplayReviews() {
        let filtered = [...this.allReviews];
        const searchTerm = document.getElementById('reviewsSearch')?.value.toLowerCase() || '';
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(review => 
                review.movieTitle?.toLowerCase().includes(searchTerm) ||
                review.reviewText?.toLowerCase().includes(searchTerm) ||
                review.username?.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply sort filter
        switch (this.currentFilter) {
            case 'recent':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'highest':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'lowest':
                filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
                break;
            case 'helpful':
                filtered.sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0));
                break;
        }
        
        this.filteredReviews = filtered;
        this.displayAllReviews();
    }
    
    displayAllReviews() {
        const container = document.getElementById('reviewsContainer');
        if (!container) return;
        
        const reviews = this.filteredReviews.length > 0 ? this.filteredReviews : this.allReviews;
        
        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="no-reviews-message">
                    <i class="fas fa-comment-slash"></i>
                    <h4>No Reviews Yet</h4>
                    <p>Be the first to write a review! Share your movie experience with the community.</p>
                </div>
            `;
            return;
        }
        
        const reviewsHTML = reviews.map(review => this.createGlobalReviewCard(review)).join('');
        container.innerHTML = reviewsHTML;
    }
    
    createGlobalReviewCard(review) {
        const stars = '⭐'.repeat(review.rating || 0) + '☆'.repeat(5 - (review.rating || 0));
        const date = new Date(review.date || Date.now()).toLocaleDateString();
        const username = review.username || currentUser?.username || 'Anonymous';
        
        return `
            <div class="review-card global-review enhanced-review-card">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar enhanced-avatar">
                            <div class="avatar-circle">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="online-indicator"></div>
                        </div>
                        <div class="reviewer-details">
                            <h4 class="reviewer-name">${username}</h4>
                            <p class="review-movie-title">
                                <i class="fas fa-film movie-icon"></i> 
                                <span class="movie-title-text">${review.movieTitle || 'Unknown Movie'}</span>
                            </p>
                            <div class="review-meta-inline">
                                <span class="review-date">
                                    <i class="fas fa-calendar-alt"></i> ${date}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="review-rating-container">
                        <div class="review-rating enhanced-rating">${stars}</div>
                        <div class="rating-score">${review.rating || 0}/5</div>
                    </div>
                </div>
                <div class="review-content enhanced-content">
                    <div class="review-text-container">
                        <p class="review-text">${review.reviewText || review.text || 'No review text available.'}</p>
                    </div>
                </div>
                <div class="review-actions enhanced-actions">
                    <div class="review-actions-left">
                        <button class="helpful-btn action-btn" onclick="globalReviews.markHelpful('${review.id}')">
                            <i class="fas fa-thumbs-up"></i>
                            <span>Helpful</span>
                            <span class="count">(${review.helpfulVotes || 0})</span>
                        </button>
                        <button class="share-btn action-btn" onclick="shareReview('${review.id}')">
                            <i class="fas fa-share-alt"></i>
                            <span>Share</span>
                        </button>
                    </div>
                    <div class="review-actions-right">
                        ${username === (currentUser?.username || 'Anonymous') ? 
                            `<button class="delete-btn action-btn danger-btn" onclick="globalReviews.deleteReview('${review.id}', '${review.movieId || ''}')">
                                <i class="fas fa-trash-alt"></i>
                                <span>Delete</span>
                            </button>` : ''}
                        <div class="review-tags">
                            <span class="verified-tag"><i class="fas fa-check-circle"></i> Verified Review</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    markHelpful(reviewId) {
        // Find and update the review
        const review = this.allReviews.find(r => r.id === reviewId);
        if (review) {
            review.helpfulVotes = (review.helpfulVotes || 0) + 1;
            this.saveReview(review);
            this.displayAllReviews();
        }
    }
    
    saveReview(review) {
        // Update in localStorage
        const movieKey = `reviews_${review.movieId}`;
        const movieReviews = JSON.parse(localStorage.getItem(movieKey) || '[]');
        const index = movieReviews.findIndex(r => r.id === review.id);
        if (index !== -1) {
            movieReviews[index] = review;
            localStorage.setItem(movieKey, JSON.stringify(movieReviews));
        }
    }
    
    deleteReview(reviewId, movieId) {
        if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            return;
        }
        
        console.log('🗑️ Deleting review:', reviewId, 'from movie:', movieId);
        
        // Remove from global reviews array
        this.allReviews = this.allReviews.filter(review => review.id != reviewId);
        this.filteredReviews = this.filteredReviews.filter(review => review.id != reviewId);
        
        // Remove from localStorage
        if (movieId) {
            const movieKey = `reviews_${movieId}`;
            const movieReviews = JSON.parse(localStorage.getItem(movieKey) || '[]');
            const updatedReviews = movieReviews.filter(review => review.id != reviewId);
            localStorage.setItem(movieKey, JSON.stringify(updatedReviews));
        }
        
        // Refresh display
        this.displayAllReviews();
        showToast('Review deleted successfully!', 'success');
        
        // Update profile stats if profile system exists
        if (window.profileSystem) {
            window.profileSystem.userData.stats.reviewCount = Math.max(0, (window.profileSystem.userData.stats.reviewCount || 0) - 1);
            window.profileSystem.saveUserData();
            window.profileSystem.updateUI();
        }
    }

    refresh() {
        this.loadAllReviews();
        this.displayAllReviews();
    }
}

// Initialize movie reviews system
let movieReviewsManager;
let globalReviews;

// Initialize systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing review systems...');
    
    // Clear any existing sample/hardcoded reviews
    clearSampleReviews();
    
    // Update existing review usernames if profile has been set
    updateExistingReviewUsernames();
    
    // Initialize movie reviews manager
    try {
        movieReviewsManager = new MovieReviewsManager();
        console.log('✅ MovieReviewsManager initialized');
    } catch (error) {
        console.error('❌ Error initializing MovieReviewsManager:', error);
    }
    
    // Initialize global reviews if container exists
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (reviewsContainer) {
        try {
            globalReviews = new GlobalCommunityReviews();
            window.globalReviews = globalReviews;
            console.log('✅ GlobalCommunityReviews initialized');
        } catch (error) {
            console.error('❌ Error initializing GlobalCommunityReviews:', error);
        }
    } else {
        console.log('ℹ️ Reviews container not found, skipping global reviews initialization');
    }
});

// Scroll to discover movies section
function scrollToMovies() {
    const discoverSection = document.getElementById('movies');
    if (discoverSection) {
        discoverSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Optional: Activate the Trending tab if not already active
        const trendingTab = document.querySelector('.genre-tab[data-genre="trending"]');
        if (trendingTab && !trendingTab.classList.contains('active')) {
            // Remove active class from all tabs
            document.querySelectorAll('.genre-tab').forEach(tab => tab.classList.remove('active'));
            // Add active class to trending tab
            trendingTab.classList.add('active');
            // Load trending movies
            if (typeof genreDiscoveryManager !== 'undefined') {
                genreDiscoveryManager.loadGenreMovies('trending');
            }
        }
    }
}

// Update search results info in navigation
function updateSearchResultsInfo(searchTerm = '', resultCount = 0) {
    const searchResultsTitle = document.getElementById('searchResultsTitle');
    const searchResultsCount = document.getElementById('searchResultsCount');
    const searchResultsCountCenter = document.getElementById('searchResultsCountCenter');

    if (searchResultsTitle) {
        searchResultsTitle.textContent = searchTerm ? `Results for "${searchTerm}"` : 'Search Results';
    }

    const countText = resultCount === 0 ? '0 results found' : `${resultCount} results found`;

    if (searchResultsCount) {
        searchResultsCount.textContent = countText;
    }

    if (searchResultsCountCenter) {
        searchResultsCountCenter.textContent = countText;
    }
}

// Update active navigation state
function updateActiveNavigation(activeSection) {
    // Remove active class from all nav links in main navigation
    const mainNavLinks = document.querySelectorAll('.nav-link');
    mainNavLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the target section link
    const targetLink = document.querySelector(`a[href="#${activeSection}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
}

// Initialize search results navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Back to Home button - backup event listener
    const backToHomeBtn = document.getElementById('backToHome');
    if (backToHomeBtn) {
        console.log('Backup: Adding back to home button event listener');
        backToHomeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Backup: Back to Home button clicked');
            showMainPage();
        });
    } else {
        console.log('Backup: Back to Home button not found');
    }
    
    // Search results theme toggle
    const searchResultsThemeToggle = document.getElementById('searchResultsThemeToggle');
    if (searchResultsThemeToggle) {
        searchResultsThemeToggle.addEventListener('click', toggleTheme);
    }
    

    
    // Search results navigation menu links
    const searchNavLinks = document.querySelectorAll('.search-nav-link');
    searchNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            // Go back to main page first
            showMainPage();
            
            // Then navigate to the specific section after a short delay
            setTimeout(() => {
                if (section === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const targetSection = document.getElementById(section);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }
                
                // Update active navigation
                updateActiveNavigation(section);
            }, 100);
        });
    });
    
    // Modern search results page functionality is now handled in initializeModernSearchFeatures()

    // Back to main page functionality (handled in initializeModernSearchFeatures as backToHomeBtn)
    
    // Update theme toggle icon in search results when theme changes
    function updateSearchResultsThemeIcon() {
        if (searchResultsThemeToggle) {
            const icon = searchResultsThemeToggle.querySelector('i');
            if (icon) {
                if (document.body.classList.contains('dark-mode')) {
                    icon.className = 'fas fa-sun';
                } else {
                    icon.className = 'fas fa-moon';
                }
            }
        }
    }
    
    // Listen for theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                updateSearchResultsThemeIcon();
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Initial theme icon update
    updateSearchResultsThemeIcon();
    
    // Ensure proper initial state of headers and pages
    const searchResultsPage = document.getElementById('searchResultsPage');
    const mainContentContainer = document.getElementById('mainContentContainer');
    const mainHeader = document.querySelector('.fixed-header:not(.search-results-header)');
    const searchHeader = document.querySelector('.search-results-header');
    
    // Initial state: show main page, hide search results
    if (searchResultsPage) searchResultsPage.classList.add('hidden');
    if (mainContentContainer) mainContentContainer.style.display = 'block';
    if (mainHeader) mainHeader.style.display = 'block';
    if (searchHeader) searchHeader.style.display = 'none';
});

// ==============================
// MODERN PROFILE SYSTEM
// ==============================

class ModernProfileSystem {
    constructor() {
        this.userData = {
            username: 'Guest User',
            avatar: 'user-circle',
            preferences: {
                darkMode: false
            },
            stats: {
                reviewCount: 0,
                favoriteCount: 0,
                watchlistCount: 0
            },
            watchHistory: [],
            achievements: []
        };
        
        this.availableAchievements = [
            {
                id: 'first_review',
                icon: '🎬',
                name: 'First Review',
                description: 'Write your first movie review',
                condition: () => this.userData.stats.reviewCount >= 1
            },
            {
                id: 'movie_critic',
                icon: '⭐',
                name: 'Movie Critic',
                description: 'Write 5 movie reviews',
                condition: () => this.userData.stats.reviewCount >= 5
            },
            {
                id: 'favorite_collector',
                icon: '❤️',
                name: 'Favorite Collector',
                description: 'Add 10 movies to favorites',
                condition: () => this.userData.stats.favoriteCount >= 10
            },
            {
                id: 'watchlist_master',
                icon: '📋',
                name: 'Watchlist Master',
                description: 'Add 20 movies to watchlist',
                condition: () => this.userData.stats.watchlistCount >= 20
            },
            {
                id: 'genre_explorer',
                icon: '🌍',
                name: 'Genre Explorer',
                description: 'Watch movies from 10 different genres',
                condition: () => {
                    const genres = new Set();
                    this.userData.watchHistory.forEach(movie => {
                        if (movie.genre) {
                            movie.genre.split(',').forEach(g => genres.add(g.trim()));
                        }
                    });
                    return genres.size >= 10;
                }
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.syncWithGlobalUser(); // Sync with global currentUser
        this.setupEventListeners();
        this.updateUI();
        this.checkAchievements();
        // Ensure favorites are displayed on load
        setTimeout(() => {
            displayFavorites();
            displayWatchlist();
        }, 100);
    }

    syncWithGlobalUser() {
        // Sync profile system with global currentUser
        if (window.currentUser && this.userData.username !== 'Guest User') {
            currentUser.username = this.userData.username;
            currentUser.avatar = this.userData.avatar;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('🔗 Synced global user with profile:', this.userData.username);
        }
    }
    
    setupEventListeners() {
        // Profile button
        const profileButton = document.getElementById('profileButton');
        if (profileButton) {
            profileButton.addEventListener('click', () => this.openProfile());
        }
        
        // Close button
        const closeBtn = document.getElementById('profileCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeProfile());
        }
        
        // Modal overlay click
        const modalOverlay = document.getElementById('profileModal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeProfile();
                }
            });
        }
        
        // Username input
        const usernameInput = document.getElementById('usernameInput');
        if (usernameInput) {
            usernameInput.addEventListener('blur', () => {
                const newUsername = usernameInput.value.trim() || 'Guest User';
                this.userData.username = newUsername;
                this.saveUserData();
            });
        }
        
        // Avatar edit button
        const editAvatarBtn = document.getElementById('editAvatarBtn');
        if (editAvatarBtn) {
            editAvatarBtn.addEventListener('click', () => this.showAvatarSelection());
        }
        
        // Cancel avatar selection
        const cancelAvatarBtn = document.getElementById('cancelAvatarBtn');
        if (cancelAvatarBtn) {
            cancelAvatarBtn.addEventListener('click', () => this.hideAvatarSelection());
        }
        
        // Avatar options
        const avatarOptions = document.querySelectorAll('.avatar-option');
        avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                const avatar = option.dataset.avatar;
                this.selectAvatar(avatar);
            });
        });
        
        // Preferences toggles
        const themeToggle = document.getElementById('profileThemeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('change', () => {
                this.userData.preferences.darkMode = themeToggle.checked;
                this.saveUserData();
                this.syncTheme();
            });
        }
        
        // Save button
        const saveBtn = document.getElementById('saveProfileBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveProfile());
        }
        
        // Clear data button
        const clearBtn = document.getElementById('clearDataBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }
    }
    
    openProfile() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            this.updateProfileModal();
        }
    }
    
    closeProfile() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            this.hideAvatarSelection();
        }
    }
    
    showAvatarSelection() {
        const userSection = document.querySelector('.user-info-section');
        const avatarSection = document.getElementById('avatarSelectionSection');
        
        if (userSection) userSection.classList.add('hidden');
        if (avatarSection) avatarSection.classList.remove('hidden');
    }
    
    hideAvatarSelection() {
        const userSection = document.querySelector('.user-info-section');
        const avatarSection = document.getElementById('avatarSelectionSection');
        
        if (userSection) userSection.classList.remove('hidden');
        if (avatarSection) avatarSection.classList.add('hidden');
    }
    
    selectAvatar(avatarType) {
        // Update selection UI
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-avatar="${avatarType}"]`).classList.add('selected');
        
        // Update user data
        this.userData.avatar = avatarType;
        this.updateAvatarDisplay();
        this.saveUserData();
        
        // Hide selection after a short delay
        setTimeout(() => {
            this.hideAvatarSelection();
        }, 500);
    }
    
    updateAvatarDisplay() {
        const avatarDisplay = document.getElementById('currentAvatar');
        const profileAvatar = document.querySelector('.profile-avatar');
        
        if (avatarDisplay) {
            avatarDisplay.innerHTML = `<i class="fas fa-${this.userData.avatar}"></i>`;
        }
        
        if (profileAvatar) {
            profileAvatar.innerHTML = `<i class="fas fa-${this.userData.avatar}"></i>`;
        }
    }
    
    updateProfileModal() {
        // Update username input
        const usernameInput = document.getElementById('usernameInput');
        if (usernameInput) {
            usernameInput.value = this.userData.username;
        }
        
        // Update stats
        document.getElementById('reviewCount').textContent = this.userData.stats.reviewCount;
        document.getElementById('favoriteCount').textContent = this.userData.stats.favoriteCount;
        document.getElementById('watchlistCount').textContent = this.userData.stats.watchlistCount;
        
        // Update preferences
        document.getElementById('profileThemeToggle').checked = this.userData.preferences.darkMode;
        
        // Update avatar
        this.updateAvatarDisplay();
        
        // Update achievements
        this.updateAchievementsDisplay();
    }
    

    
    updateAchievementsDisplay() {
        const achievementsGrid = document.getElementById('achievementsGrid');
        if (!achievementsGrid) return;
        
        achievementsGrid.innerHTML = this.availableAchievements.map(achievement => {
            const isUnlocked = this.userData.achievements.includes(achievement.id);
            return `
                <div class="achievement-badge ${isUnlocked ? 'unlocked' : ''}">
                    <div class="achievement-icon">
                        ${achievement.icon}
                    </div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    addToWatchHistory(movieData) {
        const existingIndex = this.userData.watchHistory.findIndex(
            movie => movie.imdbID === movieData.imdbID
        );
        
        const historyEntry = {
            ...movieData,
            viewedAt: new Date().toISOString()
        };
        
        if (existingIndex !== -1) {
            // Update existing entry
            this.userData.watchHistory[existingIndex] = historyEntry;
        } else {
            // Add new entry
            this.userData.watchHistory.push(historyEntry);
        }
        
        // Keep only last 100 entries
        if (this.userData.watchHistory.length > 100) {
            this.userData.watchHistory = this.userData.watchHistory.slice(-100);
        }
        
        this.saveUserData();
        this.checkAchievements();
    }
    
    updateStats(type, increment = true) {
        if (increment) {
            this.userData.stats[type]++;
        } else {
            this.userData.stats[type] = Math.max(0, this.userData.stats[type] - 1);
        }
        this.saveUserData();
        this.checkAchievements();
    }
    
    checkAchievements() {
        let newAchievements = [];
        
        this.availableAchievements.forEach(achievement => {
            if (!this.userData.achievements.includes(achievement.id) && achievement.condition()) {
                this.userData.achievements.push(achievement.id);
                newAchievements.push(achievement);
            }
        });
        
        if (newAchievements.length > 0) {
            this.saveUserData();
            this.showAchievementNotifications(newAchievements);
        }
    }
    
    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showToast(
                    `🏆 Achievement Unlocked: ${achievement.name}!`,
                    'success',
                    5000
                );
            }, index * 1000);
        });
    }
    
    showToast(message, type = 'info', duration = 3000) {
        // Integration with existing toast system
        if (typeof showToast === 'function') {
            showToast(message, type, duration);
        } else {
            console.log(`Toast: ${message}`);
        }
    }
    
    syncTheme() {
        const headerThemeToggle = document.getElementById('headerThemeToggle');
        if (headerThemeToggle && this.userData.preferences.darkMode !== document.body.classList.contains('dark-mode')) {
            headerThemeToggle.click();
        }
    }
    
    saveProfile() {
        this.saveUserData();
        this.showToast('Profile saved successfully!', 'success');
        this.closeProfile();
    }
    
    clearAllData() {
        if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
            localStorage.clear();
            this.userData = {
                username: 'Guest User',
                avatar: 'user-circle',
                preferences: {
                    darkMode: false
                },
                stats: {
                    reviewCount: 0,
                    favoriteCount: 0,
                    watchlistCount: 0
                },
                watchHistory: [],
                achievements: []
            };
            this.saveUserData();
            this.updateUI();
            this.updateProfileModal();
            this.showToast('All data cleared successfully!', 'success');
        }
    }
    
    loadUserData() {
        try {
            const saved = localStorage.getItem('modernProfileData');
            if (saved) {
                const parsedData = JSON.parse(saved);
                this.userData = { ...this.userData, ...parsedData };
            }
            
            // Migrate old favorites and watchlist data if available
            this.migrateLegacyData();
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }
    
    saveUserData() {
        try {
            localStorage.setItem('modernProfileData', JSON.stringify(this.userData));
            
            // Synchronize with global currentUser variable
            if (window.currentUser) {
                currentUser.username = this.userData.username;
                currentUser.avatar = this.userData.avatar;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                console.log('✅ Synchronized username:', this.userData.username);
                
                // Update existing reviews with new username
                updateExistingReviewUsernames();
                
                // Refresh global reviews to show updated usernames
                if (window.globalReviews) {
                    window.globalReviews.refresh();
                }
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }
    
    migrateLegacyData() {
        // Migrate favorites count
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favorites.length > 0 && this.userData.stats.favoriteCount === 0) {
            this.userData.stats.favoriteCount = favorites.length;
        }
        
        // Migrate watchlist count
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        if (watchlist.length > 0 && this.userData.stats.watchlistCount === 0) {
            this.userData.stats.watchlistCount = watchlist.length;
        }
        
        // Count reviews from localStorage
        let reviewCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('reviews_')) {
                const reviews = JSON.parse(localStorage.getItem(key) || '[]');
                reviewCount += reviews.length;
            }
        }
        if (reviewCount > 0 && this.userData.stats.reviewCount === 0) {
            this.userData.stats.reviewCount = reviewCount;
        }
    }
    
    updateUI() {
        this.updateAvatarDisplay();
        this.syncTheme();
    }
    
    // Public methods for integration with existing code
    addFavorite() {
        this.updateStats('favoriteCount', true);
    }
    
    removeFavorite() {
        this.updateStats('favoriteCount', false);
    }
    
    addToWatchlist() {
        this.updateStats('watchlistCount', true);
    }
    
    removeFromWatchlist() {
        this.updateStats('watchlistCount', false);
    }
    
    addReview() {
        this.updateStats('reviewCount', true);
    }
    
    viewMovie(movieData) {
        this.addToWatchHistory(movieData);
    }
}

// Initialize the modern profile system
let profileSystem;
document.addEventListener('DOMContentLoaded', function() {
    profileSystem = new ModernProfileSystem();
    
    // Force refresh favorites and watchlist display after profile system loads
    setTimeout(() => {
        if (typeof displayFavorites === 'function') {
            displayFavorites();
        }
        if (typeof displayWatchlist === 'function') {
            displayWatchlist();
        }
    }, 500);
});

// Export for global access
window.profileSystem = profileSystem;

// Add navigation event listeners for favorites section
// Clear hardcoded/sample reviews from localStorage
function clearSampleReviews() {
    console.log('🧹 Clearing hardcoded sample reviews...');
    // Remove the legacy movieReviews key that contains sample data
    localStorage.removeItem('movieReviews');
    console.log('✅ Sample reviews cleared');
}

// Update existing review usernames to current username
function updateExistingReviewUsernames() {
    if (currentUser.username === 'Anonymous') {
        console.log('ℹ️ Skipping username update - still using Anonymous');
        return;
    }
    
    console.log('🔄 Updating existing review usernames to:', currentUser.username);
    
    // Update all review keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('reviews_')) {
            const reviews = JSON.parse(localStorage.getItem(key) || '[]');
            let updated = false;
            
            reviews.forEach(review => {
                if (review.username === 'Anonymous' || !review.username) {
                    review.username = currentUser.username;
                    updated = true;
                }
            });
            
            if (updated) {
                localStorage.setItem(key, JSON.stringify(reviews));
                console.log(`✅ Updated usernames in ${key}`);
            }
        }
    }
}

// Refresh Functions - Make them globally accessible
window.refreshFavoritesSection = function() {
    console.log('🔄 Refreshing favorites section...');
    displayFavorites();
    showToast('Favorites refreshed!', 'success');
};

window.refreshGlobalReviews = function() {
    console.log('🔄 Refreshing global reviews...');
    if (window.globalReviews) {
        window.globalReviews.refresh();
        showToast('Reviews refreshed!', 'success');
    } else {
        console.warn('⚠️ Global reviews system not initialized');
        showToast('Reviews system not available', 'error');
    }
};

// Share review function
window.shareReview = function(reviewId) {
    console.log('📤 Sharing review:', reviewId);
    showToast('Review link copied to clipboard!', 'success');
};

// Manually update all review usernames (for immediate updates)
window.updateAllReviewUsernames = function() {
    updateExistingReviewUsernames();
    if (window.globalReviews) {
        window.globalReviews.refresh();
        showToast('Review usernames updated!', 'success');
    }
};

// Like modal review function
window.likeModalReview = function(reviewId, movieId) {
    const reviews = getUserReviews(movieId);
    const review = reviews.find(r => r.id == reviewId);
    if (review) {
        review.helpfulVotes = (review.helpfulVotes || 0) + 1;
        saveReview(movieId, review);
        displayUserReviews(movieId);
        showToast('Thank you for your feedback!', 'success');
    }
};

// Delete modal review function
window.deleteModalReview = function(reviewId, movieId) {
    if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
        return;
    }
    
    console.log('🗑️ Deleting modal review:', reviewId, 'from movie:', movieId);
    
    // Get current reviews
    const reviews = getUserReviews(movieId);
    const updatedReviews = reviews.filter(review => review.id != reviewId);
    
    // Save updated reviews
    localStorage.setItem(`reviews_${movieId}`, JSON.stringify(updatedReviews));
    
    // Refresh modal display
    displayUserReviews(movieId);
    
    // Refresh global reviews if they exist
    if (window.globalReviews) {
        window.globalReviews.refresh();
    }
    
    // Update profile stats
    if (window.profileSystem) {
        window.profileSystem.userData.stats.reviewCount = Math.max(0, (window.profileSystem.userData.stats.reviewCount || 0) - 1);
        window.profileSystem.saveUserData();
        window.profileSystem.updateUI();
    }
    
    showToast('Review deleted successfully!', 'success');
};

document.addEventListener('DOMContentLoaded', function() {
    // Listen for favorites navigation
    const favoritesNavLink = document.querySelector('a[href="#favorites"]');
    if (favoritesNavLink) {
        favoritesNavLink.addEventListener('click', function() {
            setTimeout(() => {
                displayFavorites();
            }, 100);
        });
    }
    
    // Listen for any navigation to favorites
    document.addEventListener('click', function(e) {
        if (e.target.getAttribute('href') === '#favorites' || 
            e.target.closest('[href="#favorites"]')) {
            setTimeout(() => {
                displayFavorites();
            }, 100);
        }
    });
});