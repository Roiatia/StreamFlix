# StreamFlix – Streaming UI Clone

A modern streaming-platform frontend inspired by services like Netflix, built as part of a college web development project.

StreamFlix recreates the core streaming experience — from authentication and profile selection to personalized recommendations and dynamic content browsing — using a custom dark-themed brand identity.

---

# Features

## Authentication & Login
- Client-side form validation using Vanilla JavaScript (ES6+)
- Email format validation with Regex
- Password length validation
- Inline error messages
- Dynamic error clearing while typing
- Redirect flow after successful login

## Profile Selection
- “Who’s Watching?” style profile screen
- Multiple user profiles
- Avatar-based profile cards
- Manage profiles button

## Main Dashboard
- Netflix-inspired interface
- Hero content sections
- Trending rows
- Watch buttons
- Like counters
- Smooth hover effects

## Personalized Experience
- Continue Watching section
- Genre-based recommendations
- Per-profile saved state using `localStorage`

## Search System
- Live content filtering
- Search overlay across pages
- Dynamic search results

## My List
- Save favorite titles
- Remove titles dynamically
- Dedicated My List page

## Responsive Design
- Built with Bootstrap 5
- Responsive layouts for multiple screen sizes
- Optimized spacing and alignment

---

# Screenshots

| Login Screen | Profile Selection |
| --- | --- |
| ![StreamFlix login screen](images/screenshots/streamflix-login.png) | ![StreamFlix profile selection screen](images/screenshots/streamflix-profiles.png) |

| Home Dashboard | Recommendations Feed |
| --- | --- |
| ![StreamFlix home dashboard](images/screenshots/streamflix-home.png) | ![StreamFlix recommendations page](images/screenshots/streamflix-recommendations.png) |

---

# Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Custom styling, animations, gradients |
| Bootstrap 5.3 | Responsive layout and UI utilities |
| JavaScript (ES6+) | Validation, search, rendering, state management |
| localStorage | Profile persistence and saved content |

---

# Project Structure

```text
StreamFlix/
├── css/
│   ├── LoginPage.css
│   ├── users.css
│   └── interface.css
│
├── js/
│   ├── login.js
│   ├── content.js
│   ├── nav.js
│   └── search.js
│
├── images/
│   └── screenshots/
│
├── content-images/
│
├── index.html
├── UserScreen.html
├── interface.html
└── README.md
```

---

# Project Goals

The purpose of this project was to practice:
- Modern frontend development
- Responsive UI design
- DOM manipulation
- Form validation
- Dynamic rendering
- State management using `localStorage`
- Creating a polished real-world user experience

---

# Disclaimer

This project was created for educational and portfolio purposes only.

All trademarks, streaming references, and brand identities related to Netflix belong to their respective owners.