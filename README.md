# NZ Beach Weather

A ReactJS application for checking weather conditions at New Zealand beaches.

## Features

- **Check Specific Beach**: Search for a specific beach by name to check its weather
- **Beaches Near Me**: Find beaches within a custom radius from your location
- **Nearest Non-Rainy Beach**: Discover the closest beach with sunny weather
- **About**: Information about the application

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`

## Tech Stack

- React 18
- React Router DOM for navigation
- TailwindCSS for styling

## Project Structure

```
src/
├── pages/
│   ├── CheckSpecificBeach.js
│   ├── BeachesNearMe.js
│   ├── NearestNonRainyBeach.js
│   └── About.js
├── App.js
├── index.js
└── index.css
```

## Note

This is currently a UI-only implementation. Weather functionality will be added in future updates.
