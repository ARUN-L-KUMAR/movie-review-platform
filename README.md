# 🎬 Movie Review & Rating Platform

A stunning, responsive web application that allows users to search for movies, view details, rate movies, and write reviews. All data is persisted using Local Storage.

## 🌟 Features

- 🔍 Search movies using the OMDB API
- 📋 View detailed movie information (title, year, poster, plot, rating, etc.)
- ⭐ Rate movies with a 1-5 star system
- ✍️ Write and submit short reviews
- ❤️ Add movies to favorites and watchlist
- 💾 Persistent storage using Local Storage
- 📱 Fully responsive design that works on desktop and mobile devices
- 📢 Toast notifications for user feedback
- ⏳ Loading indicators for better UX
- 🎨 Beautiful, modern UI with animations and gradients

## 🛠 Technologies Used

- HTML5
- CSS3 (with modern flexbox, grid layouts, and animations)
- JavaScript (ES6+)
- OMDB API for movie data
- Local Storage for data persistence
- Google Fonts for typography
- Font Awesome for icons

## 🚀 Setup Instructions

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

## 📁 Project Structure

```
movie-review-platform/
├── index.html          # Main HTML file
├── style.css           # Stylesheet with responsive design
├── script.js           # JavaScript functionality
├── README.md           # This file
├── .gitignore          # Git ignore file
└── LICENSE             # License file
```

## 🎯 Usage

1. Enter a movie title in the search bar and click "Search"
2. Browse through the search results with beautiful card animations
3. Click "View Details" on any movie to see more information
4. Rate the movie using the star rating system (1-5 stars)
5. Write a review in the text area
6. Click "Submit Review" to save your rating and review
7. Add movies to your favorites or watchlist using the buttons
8. All reviews and favorites are stored in your browser's Local Storage

## ✨ Enhanced Features

### Favorites System
- Click "Add to Favorites" to save a movie for quick access
- View your favorites in the "My Favorites" section at the top
- Click on any favorite movie to view its details

### Watchlist
- Click "Add to Watchlist" to save movies you want to watch later
- Manage your watchlist through the same interface

### Improved UI/UX
- Beautiful gradient backgrounds and modern card designs
- Smooth animations and transitions
- Loading indicators during API requests
- Toast notifications for user feedback
- Enhanced movie detail view with more information
- Better responsive design for mobile devices
- Icons for better visual cues

## 🎨 UI Enhancements

### Visual Design
- Modern gradient color scheme with purple/blue accents
- Beautiful card layouts with hover effects and animations
- Custom star rating system with scaling animations
- Elegant modal dialogs with backdrop blur
- Responsive typography with Google Fonts (Poppins)

### Animations & Effects
- Smooth entrance animations for movie cards
- Hover effects with elevation and scaling
- Button press animations
- Toast notification entrance/exit animations
- Modal open/close animations
- Loading spinner animations

## 🔑 API Key Configuration

To use the OMDB API, you need to obtain a free API key:

1. Visit [OMDB API](http://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Once you receive your key, replace `YOUR_OMDB_API_KEY` in `script.js`:
   ```javascript
   const API_KEY = 'your-actual-api-key-here';
   ```

## 💾 Local Storage

All ratings, reviews, favorites, and watchlist items are stored in the browser's Local Storage, keyed by movie ID. This means:

- Your reviews persist even after closing the browser
- Each movie maintains its own set of reviews
- Favorites and watchlist are saved locally
- Data is stored locally and is specific to your browser

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Movie data provided by [OMDB API](http://www.omdbapi.com/)
- Placeholder images from [via.placeholder.com](https://via.placeholder.com/)
- Icons from [Font Awesome](https://fontawesome.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)