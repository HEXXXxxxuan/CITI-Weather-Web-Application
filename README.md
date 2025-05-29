# CITIWeather - Interactive Weather Application
A modern weather application built with vanilla JavaScript, CSS3, and Chart.js featuring real-time weather data and glassmorphism UI design.

## Screenshots
![屏幕截图 2025-05-06 215415](https://github.com/user-attachments/assets/a76075a3-4c88-4178-848e-f5efd0bb3720)
![屏幕截图 2025-05-06 215438](https://github.com/user-attachments/assets/2ece5d24-f45b-4aa4-a483-47c1fe87bd80)
![屏幕截图 2025-05-08 003646](https://github.com/user-attachments/assets/c01ea0ad-42f1-45aa-a1d9-9bce5d9e3f66)




## Features
- Real-time weather data from OpenMeteo API
- Interactive 7-day forecast with Chart.js visualizations
- Dynamic weather-responsive animated backgrounds
- City search with instant results from 30+ global cities
- Favorites management system
- Modern glassmorphism UI with smooth animations
- Innovative scroll-based city gallery navigation

## Tech Stack
- **Frontend**: HTML5, JavaScript (ES6+), CSS3
- **UI Framework**: Bootstrap 5.3.3, Bootstrap Icons
- **Data Visualization**: Chart.js
- **Weather API**: OpenMeteo (no key required)
- **Design**: Glassmorphism, CSS Grid, Flexbox

## Installation
1. Clone the repository
```bash
git clone https://github.com/HEXXXxxxuan/citiweather.git
cd citiweather
```

2. No build process required - pure vanilla JavaScript!

3. Start a local server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

4. Open http://localhost:8000
   - Start from the welcome page

## Core Features
- `Welcome Page` - Animated entry point with glassmorphism design
- `City Gallery` - Scroll through 30 major cities with smooth animations
- `Search Function` - Real-time city search with dropdown results
- `Weather Details` - Current conditions and 7-day forecast
- `Favorites System` - Save your favorite cities for quick access
- `Dynamic Backgrounds` - Weather-based animated GIF backgrounds

## Project Structure
```
citiweather/
├── index.html              # Welcome page
├── CITIWeather.html       # Main gallery
├── weather-detail.html    # Weather details
├── css/
│   ├── welcome.css        # Welcome styles
│   ├── CITIWeather.css    # Main app styles
│   └── weather-details.css # Details page styles
├── js/
│   ├── city.js            # City search logic
│   ├── weather.js         # Weather API integration
│   └── data.json          # City coordinates
└── assets/
    ├── img/               # City images & backgrounds
    └── css/js/            # Bootstrap files
```

Built with modern web technologies showcasing advanced CSS techniques and JavaScript skills.
