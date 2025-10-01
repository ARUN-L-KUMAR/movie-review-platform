# 🎬 User Guide - Movie Review Platform

## 🚀 Getting Started

Welcome to the Movie Review Platform! This guide will help you navigate and use all the features of the application.

## 🔍 Searching for Movies

1. Open `index.html` in your web browser
2. You'll see a search bar at the top of the page with a beautiful gradient header
3. Type in the name of a movie you want to search for
4. Click the "Search" button or press Enter
5. Watch the loading indicator with animation while results are fetched

## 📋 Viewing Movie Details

1. After searching, you'll see a grid of movie cards with elegant animations
2. Each card displays:
   - Movie poster with hover zoom effect
   - Title with modern typography
   - Release year with calendar icon
   - Type (movie, series, etc.) with tag icon
3. Click the "View Details" button on any movie card to see more information

## ⭐ Rating and Reviewing Movies

### Rating a Movie
1. In the movie details view, you'll see a row of 5 stars with elegant design
2. Click on any star to rate the movie (1-5 stars)
3. The stars will highlight with a beautiful gold color and subtle animation

### Writing a Review
1. Below the star rating, you'll see a text area with modern styling
2. Type your review in the text area
3. Click the "Submit Review" button to save your rating and review
4. You'll see a toast notification with animation confirming your submission

## ❤️ Managing Favorites and Watchlist

### Adding to Favorites
1. In the movie details view, click the "Add to Favorites" button
2. The button will change to "Remove from Favorites" and turn red with animation
3. Your favorite movies will appear in the "My Favorites" section at the top

### Adding to Watchlist
1. In the movie details view, click the "Add to Watchlist" button
2. The button will change to "Remove from Watchlist" and darken with animation
3. Manage your watchlist the same way as favorites

### Viewing Favorites
1. Click on any movie in your favorites section to view its details
2. Remove movies from favorites using the "Remove from Favorites" button

## 📝 Viewing Reviews

1. All submitted reviews for a movie are displayed below the review form
2. Reviews are shown with:
   - Star rating with gold stars
   - Review text with elegant typography
   - Date posted with clock icon
3. Reviews are sorted with the newest ones appearing first
4. Each review card has a subtle entrance animation

## 💾 Data Persistence

All ratings, reviews, favorites, and watchlist items are saved in your browser's Local Storage:
- Your data persists even after closing the browser
- Reviews are specific to each movie
- Favorites and watchlist are stored separately
- Data is stored locally on your device

## 🛠 Troubleshooting

### No Movies Found
- Check your spelling in the search query
- Try using a more general search term
- Make sure you have a valid OMDB API key configured

### Movie Posters Not Loading
- Some movies may not have poster images in the database
- Placeholder images will be shown in these cases

### Reviews Not Saving
- Make sure your browser supports Local Storage
- Check that you've selected a star rating before submitting
- Ensure you've entered text in the review field

### Favorites/Watchlist Not Working
- Verify that Local Storage is enabled in your browser
- Check the browser console for any error messages

## 📱 Browser Compatibility

This application works best on modern browsers:
- Chrome 50+
- Firefox 50+
- Safari 10+
- Edge 15+

## 🔑 API Key Configuration

To use the movie search feature, you need an OMDB API key:
1. Visit [OMDB API](http://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Add your API key to `script.js`:
   ```javascript
   const API_KEY = 'your-api-key-here';
   ```

## 🧠 Technical Information

### File Structure
- `index.html` - Main application page
- `style.css` - All styling and responsive design
- `script.js` - Application logic and API integration
- Data is stored in browser Local Storage

### Local Storage Format
- Reviews are stored with the key format: `reviews_{imdbID}`
- Favorites are stored with the key: `favorites`
- Watchlist is stored with the key: `watchlist`

Each review contains:
- id: Unique identifier
- rating: Star rating (1-5)
- text: Review content
- date: Submission date

Favorites and watchlist items contain:
- imdbID: Movie identifier
- Title: Movie title
- Year: Release year
- Poster: Poster URL

## 🎨 UI Features

### Visual Design
- Modern gradient backgrounds
- Elegant card layouts with subtle shadows
- Smooth hover animations and transitions
- Beautiful typography with Google Fonts
- Consistent color scheme throughout

### Animations
- Staggered entrance animations for movie cards
- Button press animations
- Modal open/close animations
- Toast notification animations
- Star rating interaction animations

## 🆘 Support

For issues, questions, or feedback, please:
1. Check the troubleshooting section above
2. Review the README.md file
3. Submit an issue on GitHub if the problem persists