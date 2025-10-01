# Movie Review & Rating Platform

A responsive web application that allows users to search for movies, view details, rate movies, and write reviews. All data is persisted using Local Storage.

## Features

- Search movies using the OMDB API
- View detailed movie information (title, year, poster, plot, rating, etc.)
- Rate movies with a 1-5 star system
- Write and submit short reviews
- Persistent storage using Local Storage
- Responsive design that works on desktop and mobile devices

## Technologies Used

- HTML5
- CSS3 (with modern flexbox and grid layouts)
- JavaScript (ES6+)
- OMDB API for movie data
- Local Storage for data persistence

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/movie-review-platform.git
   ```

2. Navigate to the project directory:
   ```bash
   cd movie-review-platform
   ```

3. Replace the API key in `script.js`:
   - Get your free API key from [OMDB API](http://www.omdbapi.com/apikey.aspx)
   - Replace `YOUR_OMDB_API_KEY` in script.js with your actual API key

4. Open `index.html` in your browser to use the application

## Project Structure

```
movie-review-platform/
├── index.html          # Main HTML file
├── style.css           # Stylesheet with responsive design
├── script.js           # JavaScript functionality
├── README.md           # This file
├── .gitignore          # Git ignore file
└── LICENSE             # License file
```

## Usage

1. Enter a movie title in the search bar and click "Search"
2. Browse through the search results
3. Click "View Details" on any movie to see more information
4. Rate the movie using the star rating system (1-5 stars)
5. Write a review in the text area
6. Click "Submit Review" to save your rating and review
7. All reviews are stored in your browser's Local Storage

## API Key Configuration

To use the OMDB API, you need to obtain a free API key:

1. Visit [OMDB API](http://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Once you receive your key, replace `YOUR_OMDB_API_KEY` in `script.js`:
   ```javascript
   const API_KEY = 'your-actual-api-key-here';
   ```

## Local Storage

All ratings and reviews are stored in the browser's Local Storage, keyed by movie ID. This means:

- Your reviews persist even after closing the browser
- Each movie maintains its own set of reviews
- Data is stored locally and is specific to your browser

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Movie data provided by [OMDB API](http://www.omdbapi.com/)
- Placeholder images from [via.placeholder.com](https://via.placeholder.com/)