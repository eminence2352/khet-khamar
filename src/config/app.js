// Import required modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// This function creates and configures the Express app
function createApp() {
  const app = express();

  // Enable CORS (allows requests from different domains)
  app.use(cors());
  // Parse cookies from incoming requests
  app.use(cookieParser());
  // Parse JSON request bodies
  app.use(express.json());
  // Parse URL-encoded form data
  app.use(express.urlencoded({ extended: true }));

  // Configure session management (keeps users logged in)
  app.use(session({
    secret: process.env.SESSION_SECRET || 'khet-khamar-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // Sessions last 7 days
    },
  }));

  // Serve static files from the 'public' folder (HTML, CSS, JS, images)
  app.use(express.static(path.join(process.cwd(), 'public')));

  return app;
}

module.exports = createApp;
