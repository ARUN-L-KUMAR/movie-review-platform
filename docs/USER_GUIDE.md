# User Guide - Movie Review Platform

## Getting Started

Welcome to the Movie Review Platform! This guide will help you navigate and use all the features of the application.

## Searching for Movies

1. Open `index.html` in your web browser
2. You'll see a search bar at the top of the page
3. Type in the name of a movie you want to search for
4. Click the "Search" button or press Enter

## Viewing Movie Details

1. After searching, you'll see a grid of movie cards
2. Each card displays:
   - Movie poster
   - Title
   - Release year
   - Type (movie, series, etc.)
3. Click the "View Details" button on any movie card to see more information

## Rating and Reviewing Movies

### Rating a Movie
1. In the movie details view, you'll see a row of 5 stars
2. Click on any star to rate the movie (1-5 stars)
3. The stars will highlight to show your selection

### Writing a Review
1. Below the star rating, you'll see a text area
2. Type your review in the text area
3. Click the "Submit Review" button to save your rating and review

## Viewing Reviews

1. All submitted reviews for a movie are displayed below the review form
2. Reviews are shown with:
   - Star rating
   - Review text
   - Date posted
3. Reviews are sorted with the newest ones appearing first

## Data Persistence

All ratings and reviews are saved in your browser's Local Storage:
- Your data persists even after closing the browser
- Reviews are specific to each movie
- Data is stored locally on your device

## Troubleshooting

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

## Browser Compatibility

This application works best on modern browsers:
- Chrome 50+
- Firefox 50+
- Safari 10+
- Edge 15+

## API Key Configuration

To use the movie search feature, you need an OMDB API key:
1. Visit [OMDB API](http://www.omdbapi.com/apikey.aspx)
2. Request a free API key
3. Add your API key to `script.js`:
   ```javascript
   const API_KEY = 'your-api-key-here';
   ```

## Technical Information

### File Structure
- `index.html` - Main application page
- `style.css` - All styling and responsive design
- `script.js` - Application logic and API integration
- Data is stored in browser Local Storage

### Local Storage Format
Reviews are stored with the key format: `reviews_{imdbID}`
Each review contains:
- id: Unique identifier
- rating: Star rating (1-5)
- text: Review content
- date: Submission date

## Support

For issues, questions, or feedback, please:
1. Check the troubleshooting section above
2. Review the README.md file
3. Submit an issue on GitHub if the problem persists