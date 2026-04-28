// This function creates middleware functions that check user authentication
function createAuthMiddleware(db) {
  // MIDDLEWARE 1: Check if a normal user is logged in
  const requireAuth = (req, res, next) => {
    // If no session user ID, they're not logged in
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    // If they're in admin mode, reject (normal user endpoints should not allow admins)
    if (req.session.authMode === 'admin') {
      return res.status(403).json({ message: 'Please login as a normal user for this action.' });
    }

    // User is logged in as a normal user, allow them to proceed
    next();
  };

  // MIDDLEWARE 2: Check if an admin is logged in
  const requireAdmin = async (req, res, next) => {
    // If no session user ID, they're not logged in
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    try {
      // Look up the user's role in the database
      const [rows] = await db.query('SELECT role FROM users WHERE id = ? LIMIT 1', [req.session.userId]);

      // If user doesn't exist or is not an Admin, reject
      if (rows.length === 0 || rows[0].role !== 'Admin') {
        return res.status(403).json({ message: 'Admin access required.' });
      }

      // User is an admin, allow them to proceed
      next();
    } catch (error) {
      console.error('Failed to verify admin access:', error.message);
      res.status(500).json({ message: 'Failed to verify admin access' });
    }
  };

  return { requireAuth, requireAdmin };
}

module.exports = createAuthMiddleware;
