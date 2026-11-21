# ✈️ Travel Tracker

**A full-stack travel planning application built with JavaScript, Node.js, Express and EJS.**

Travel Tracker allows users to create, manage and explore holiday itineraries. Users can select destinations and accommodation, calculate travel information, submit trips to a public leaderboard and explore travel statistics.

This project is a rebuilt and improved version of a previous TAFE Queensland Web Programming Cluster project, with an updated user interface, improved functionality and responsive layouts.

## 🛠️ Technologies Used





\


**Additional technologies:** EJS, REST APIs, browser Local Storage and JSON.

## ✨ Features

### 🧳 Trip Management

- Create and save holiday itineraries.
- Edit existing trips.
- View saved trips in a responsive card layout.
- Delete trips with confirmation.
- Store personal trips using browser Local Storage.

### 🌏 Destination & Accommodation Planning

- Select destinations from available travel routes.
- View flight distances between destinations.
- Choose accommodation from available hotels.
- Build multi-destination itineraries.
- Review destinations and hotel stays.

### 📊 Trip Summary

- View the total number of hotels.
- Calculate total nights stayed.
- Calculate total distance travelled.
- Display estimated travel costs per person.
- Review the complete trip itinerary.

### 🏆 Public Leaderboard

- Submit trips to the server.
- View submitted trips and their itineraries.
- Rank trips by total distance travelled.
- Display destinations, hotels and nights stayed.
- Delete submitted trips from the leaderboard.

### 📈 Statistics Dashboard

- View the total number of submitted trips.
- Identify the most popular destination.
- Explore destination popularity using visual bars.
- Display statistics calculated from submitted trip data.

### 🎨 Responsive User Interface

- Modern blue-and-white design.
- Consistent navigation across pages.
- Responsive layouts for desktop and mobile.
- Styled trip cards, buttons and dashboard components.

## 📸 Screenshots

Screenshots of the completed application can be added here.

### 🧳 All My Trips

<img width="1917" height="871" alt="image" src="https://github.com/user-attachments/assets/68beed8d-c6cb-44fd-9976-81f7e5508f3f" />


### 🗺️ New / Edit Trip

<img width="1897" height="866" alt="image" src="https://github.com/user-attachments/assets/f89ff035-8318-4db8-be32-d950ec1844a3" />


### 📋 Trip Summary

<img width="1897" height="860" alt="image" src="https://github.com/user-attachments/assets/46b52cfe-a5d1-4906-9953-b6c77d9aff8d" />


### 🏆 Public Leaderboard

<img width="1896" height="866" alt="image" src="https://github.com/user-attachments/assets/583c13af-bb91-4f44-b8b5-8d7a9ae9ac92" />


### 📊 Statistics Dashboard

<img width="1897" height="873" alt="image" src="https://github.com/user-attachments/assets/88773ad6-57d2-48d3-b5f1-50b9021496ea" />


### 🚀 Getting Started

1. Click the green **`<> Code`** button at the top of this GitHub repository.

2. Select **Download ZIP**.

3. Extract the downloaded ZIP file.

4. Open the extracted project folder in VS Code.

5. Open the terminal and install dependencies:

   ```bash
   npm install
   ```

6. Start the application:

   ```bash
   npm start
   ```

7. Open [**http://localhost:8080**](http://localhost:8080) in your browser.

## 📁 Project Structure

```text
travel-tracker/
├── src/
│   ├── controllers/
│   │   ├── apiController.mjs
│   │   └── featuresController.mjs
│   ├── models/
│   │   ├── DestinationsModel.mjs
│   │   ├── HotelModel.mjs
│   │   └── ServerTripModel.mjs
│   ├── public/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── views/
│   ├── routers/
│   ├── views/
│   │   ├── publicLeaderboard.ejs
│   │   ├── publicStatistics.ejs
│   │   └── styles.css
│   └── server.mjs
├── screenshots/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 🧠 What I Learned

This project helped me understand and learn more about:

- JavaScript programming and DOM manipulation.
- Object-oriented programming using classes and models.
- Model-View-Controller (MVC) architecture.
- Creating REST API endpoints with Express.
- Working with GET, POST, PUT and DELETE requests.
- Managing data using browser Local Storage.
- Server-side rendering with EJS.
- Debugging frontend and backend functionality.
- Building responsive interfaces with HTML and CSS.
- Organising code into reusable components and modules.

## 📝 Technical Notes

Personal trips are stored in the browser using Local Storage.

Leaderboard submissions are stored in server memory, meaning submitted trips are cleared when the Node.js server restarts.

The application currently runs locally and requires the Node.js server to be running.

## 👨‍💻 Author

**Made by Shaurya Parmar**
