// Import bcryptjs for hashing passwords securely
const bcrypt = require('bcryptjs');

// This function registers all authentication-related API routes
function registerAuthRoutes(app, { db }) {
  // SIGNUP ENDPOINT: Receives form data and creates a new user account
  app.post('/api/auth/signup', async (req, res) => {
    // Extract data sent from the signup form
    const { mobile_number, email, password, full_name, district_location } = req.body;

    // Check that all required fields were provided
    if (!mobile_number || !email || !password || !full_name || !district_location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
      // Check if a user with this mobile number or email already exists in the database
      const [existingUsers] = await db.query(
        'SELECT id FROM users WHERE mobile_number = ? OR email = ? LIMIT 1',
        [mobile_number, email]
      );

      // If user exists, reject the signup
      if (existingUsers.length > 0) {
        return res.status(409).json({ message: 'Mobile number or email already registered' });
      }

      // Hash the password before storing it (never store plain passwords!)
      const passwordHash = await bcrypt.hash(password, 10);
      // Insert the new user into the users table
      const [result] = await db.query(
        `INSERT INTO users (mobile_number, email, password_hash, full_name, district_location)
         VALUES (?, ?, ?, ?, ?)`,
        [mobile_number, email, passwordHash, full_name, district_location]
      );

      // Get the new user's ID from the database insert result
      const userId = result.insertId;
      // Store user ID in the session (this keeps them logged in)
      req.session.userId = userId;
      req.session.authMode = 'user';

      // Send success response to the frontend
      res.status(201).json({
        message: 'Signup successful',
        userId,
        user: { mobile_number, email, full_name },
      });
    } catch (error) {
      console.error('Signup error:', error.message);
      res.status(500).json({ message: 'Signup failed' });
    }
  });

  // LOGIN ENDPOINT: Validates credentials and logs in a normal user
  app.post('/api/auth/login', async (req, res) => {
    // Extract mobile number and password from the login form
    const { mobile_number, password } = req.body;

    // Check that both fields were provided
    if (!mobile_number || !password) {
      return res.status(400).json({ message: 'Mobile number and password are required' });
    }

    try {
      // Look up the user by mobile number in the users table
      const [users] = await db.query(
        'SELECT id, password_hash, full_name, email, role FROM users WHERE mobile_number = ? LIMIT 1',
        [mobile_number]
      );

      // If no user found, send generic error message (don't reveal whether email exists)
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid mobile number or password' });
      }

      // Get the first matching user
      const user = users[0];
      // Compare the typed password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid mobile number or password' });
      }

      // Block admins from using the normal login page (they must use /admin-login.html)
      if (user.role === 'Admin') {
        return res.status(403).json({ message: 'Admin must login from admin login page.' });
      }

      // Store the user ID in the session (keeps them logged in)
      req.session.userId = user.id;
      req.session.authMode = 'user';

      // Send success response with user data
      res.json({
        message: 'Login successful',
        userId: user.id,
        user: { id: user.id, full_name: user.full_name, email: user.email },
      });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // LOGOUT ENDPOINT: Destroys the user's session to log them out
  app.post('/api/auth/logout', (req, res) => {
    // Clear the session data (removes login state)
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logout successful' });
    });
  });

  // ADMIN LOGIN ENDPOINT: Similar to normal login but requires Admin role
  app.post('/api/admin/login', async (req, res) => {
    // Extract credentials from the admin login form
    const { mobile_number, password } = req.body;

    // Check that both fields were provided
    if (!mobile_number || !password) {
      return res.status(400).json({ message: 'Mobile number and password are required' });
    }

    try {
      const [users] = await db.query(
        'SELECT id, password_hash, full_name, email, role FROM users WHERE mobile_number = ? LIMIT 1',
        [mobile_number]
      );

      // Check that user exists AND has the Admin role
      if (users.length === 0 || users[0].role !== 'Admin') {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      const adminUser = users[0];
      const passwordMatch = await bcrypt.compare(password, adminUser.password_hash);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      // Store the admin ID in the session and mark mode as 'admin'
      req.session.userId = adminUser.id;
      req.session.authMode = 'admin';

      // Send success response
      res.json({
        message: 'Admin login successful',
        userId: adminUser.id,
        user: {
          id: adminUser.id,
          full_name: adminUser.full_name,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    } catch (error) {
      console.error('Admin login error:', error.message);
      res.status(500).json({ message: 'Admin login failed' });
    }
  });

  // GET CURRENT USER ENDPOINT: Returns the logged-in user's profile data
  app.get('/api/auth/me', async (req, res) => {
    // Check if user is logged in (session ID exists)
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      // Fetch the full user profile from the database
      const [users] = await db.query(
        'SELECT id, mobile_number, email, full_name, role, district_location, profile_picture_path, bio FROM users WHERE id = ? LIMIT 1',
        [req.session.userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(users[0]);
    } catch (error) {
      console.error('Get user error:', error.message);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // CHECK AUTH STATUS ENDPOINT: Tells the frontend whether user is logged in and what mode they're in
  app.get('/api/auth/check', (req, res) => {
    // If no session ID, user is a guest
    if (!req.session.userId) {
      return res.json({ authenticated: false, userId: null, mode: 'guest' });
    }

    // If session mode is 'admin', send admin mode (treated as not authenticated for regular endpoints)
    if (req.session.authMode === 'admin') {
      return res.json({ authenticated: false, userId: null, mode: 'admin' });
    }

    // Otherwise, user is logged in as a normal user
    res.json({ authenticated: true, userId: req.session.userId, mode: 'user' });
  });

  app.get('/api/status', (req, res) => {
    res.json({ message: 'Server is running' });
  });
}

module.exports = registerAuthRoutes;
