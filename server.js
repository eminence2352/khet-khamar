const path = require('path');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'khet-khamar-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

app.use(express.static(path.join(__dirname, 'public')));

const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    cb(null, `post-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const allowedExtensions = new Set([
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tif', '.tiff', '.svg',
      '.heic', '.heif', '.avif', '.jfif', '.ico',
    ]);

    if ((file.mimetype && file.mimetype.startsWith('image/')) || allowedExtensions.has(extension)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only image files are allowed'));
  },
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

let externalNewsCache = {
  rows: [],
  cachedAt: 0,
};

function detectLanguageFromText(text) {
  const safeText = String(text || '');

  if (/[\u0980-\u09FF]/.test(safeText)) {
    return 'bn';
  }

  // Accept English only when the text is plain Latin/ASCII.
  if (/[A-Za-z]/.test(safeText) && !/[^\x00-\x7F]/.test(safeText)) {
    return 'en';
  }

  return null;
}

function detectArticleLanguage(article) {
  const rawLanguage = String(article.language || article.lang || '').trim().toLowerCase();

  if (rawLanguage.includes('bangla') || rawLanguage.includes('bengali') || rawLanguage === 'bn') {
    return 'bn';
  }

  if (rawLanguage.includes('english') || rawLanguage === 'en') {
    return 'en';
  }

  const combinedText = `${article.title || ''} ${article.seendate || ''}`;
  return detectLanguageFromText(combinedText);
}

function buildNestedComments(flatComments) {
  const byId = new Map();
  const roots = [];

  flatComments.forEach((comment) => {
    byId.set(comment.id, {
      ...comment,
      replies: [],
    });
  });

  flatComments.forEach((comment) => {
    const current = byId.get(comment.id);
    if (!current) {
      return;
    }

    if (comment.parentCommentId && byId.has(comment.parentCommentId)) {
      byId.get(comment.parentCommentId).replies.push(current);
    } else {
      roots.push(current);
    }
  });

  return roots;
}

async function createNotification({ recipientUserId, actorUserId, postId, commentId = null, type }) {
  if (!recipientUserId || !actorUserId || recipientUserId === actorUserId) {
    return;
  }

  await db.query(
    `INSERT INTO Notifications (recipient_user_id, actor_user_id, post_id, comment_id, type)
     VALUES (?, ?, ?, ?, ?)`,
    [recipientUserId, actorUserId, postId, commentId, type]
  );
}

async function notifyAudienceForNewPost(authorUserId, postId) {
  const recipientIds = new Set();

  const [bondRows] = await db.query(
    `SELECT
      CASE WHEN user_low_id = ? THEN user_high_id ELSE user_low_id END AS recipientUserId
     FROM Krishi_Bonds
     WHERE user_low_id = ? OR user_high_id = ?`,
    [authorUserId, authorUserId, authorUserId]
  );

  bondRows.forEach((row) => {
    if (row.recipientUserId && row.recipientUserId !== authorUserId) {
      recipientIds.add(row.recipientUserId);
    }
  });

  const [watchRows] = await db.query(
    `SELECT follower_user_id AS recipientUserId
     FROM Expert_Watch
     WHERE specialist_user_id = ?`,
    [authorUserId]
  );

  watchRows.forEach((row) => {
    if (row.recipientUserId && row.recipientUserId !== authorUserId) {
      recipientIds.add(row.recipientUserId);
    }
  });

  const notifications = Array.from(recipientIds).map((recipientUserId) => {
    const type = watchRows.some((row) => row.recipientUserId === recipientUserId)
      ? 'expert_watch_post'
      : 'krishi_bond_post';

    return createNotification({
      recipientUserId,
      actorUserId: authorUserId,
      postId,
      type,
    });
  });

  await Promise.all(notifications);
}

async function ensureSocialFeaturesSchema() {
  try {
    await db.query(
      `CREATE TABLE IF NOT EXISTS Post_Likes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_post_user_like (post_id, user_id),
        INDEX idx_post_like_post (post_id),
        INDEX idx_post_like_user (user_id),
        FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await db.query(
      `CREATE TABLE IF NOT EXISTS Notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        recipient_user_id INT NOT NULL,
        actor_user_id INT NOT NULL,
        post_id INT NOT NULL,
        comment_id INT NULL,
        type VARCHAR(40) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_notifications_recipient (recipient_user_id),
        INDEX idx_notifications_post (post_id),
        INDEX idx_notifications_read (is_read),
        FOREIGN KEY (recipient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (actor_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES Comments(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await db.query(
      `CREATE TABLE IF NOT EXISTS Krishi_Bonds (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_low_id INT NOT NULL,
        user_high_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_krishi_bond (user_low_id, user_high_id),
        INDEX idx_krishi_low (user_low_id),
        INDEX idx_krishi_high (user_high_id),
        FOREIGN KEY (user_low_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (user_high_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await db.query(
      `CREATE TABLE IF NOT EXISTS Expert_Watch (
        id INT PRIMARY KEY AUTO_INCREMENT,
        follower_user_id INT NOT NULL,
        specialist_user_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_expert_watch (follower_user_id, specialist_user_id),
        INDEX idx_watch_follower (follower_user_id),
        INDEX idx_watch_specialist (specialist_user_id),
        FOREIGN KEY (follower_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (specialist_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await db.query(
      `CREATE TABLE IF NOT EXISTS Saved_Posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_saved_post (post_id, user_id),
        INDEX idx_saved_post_post (post_id),
        INDEX idx_saved_post_user (user_id),
        FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );

    await db.query(
      `ALTER TABLE Notifications
       MODIFY COLUMN type VARCHAR(40) NOT NULL`
    );

    const [columns] = await db.query(
      `SELECT COUNT(*) AS total
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'Comments'
       AND COLUMN_NAME = 'parent_comment_id'`
    );

    if (columns[0].total === 0) {
      await db.query('ALTER TABLE Comments ADD COLUMN parent_comment_id INT NULL AFTER user_id');
      await db.query('ALTER TABLE Comments ADD INDEX idx_parent_comment (parent_comment_id)');
      await db.query(
        `ALTER TABLE Comments
         ADD CONSTRAINT fk_comments_parent
         FOREIGN KEY (parent_comment_id) REFERENCES Comments(id)
         ON DELETE CASCADE ON UPDATE CASCADE`
      );
    }
  } catch (error) {
    console.error('Schema migration warning:', error.message);
  }
}

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('MySQL database connected successfully.');
  connection.release();
});

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  next();
};

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  const { mobile_number, email, password, full_name, district_location } = req.body;

  if (!mobile_number || !email || !password || !full_name || !district_location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT id FROM Users WHERE mobile_number = ? OR email = ? LIMIT 1',
      [mobile_number, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Mobile number or email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.query(
      `INSERT INTO Users (mobile_number, email, password_hash, full_name, district_location, preferred_language)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [mobile_number, email, passwordHash, full_name, district_location, 'en']
    );

    const userId = result.insertId;

    // Set session
    req.session.userId = userId;

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

// Login
app.post('/api/auth/login', async (req, res) => {
  const { mobile_number, password } = req.body;

  if (!mobile_number || !password) {
    return res.status(400).json({ message: 'Mobile number and password are required' });
  }

  try {
    // Find user
    const [users] = await db.query(
      'SELECT id, password_hash, full_name, email FROM Users WHERE mobile_number = ? LIMIT 1',
      [mobile_number]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    const user = users[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid mobile number or password' });
    }

    // Set session
    req.session.userId = user.id;

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

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const [users] = await db.query(
      'SELECT id, mobile_number, email, full_name, district_location, profile_picture_path, bio FROM Users WHERE id = ? LIMIT 1',
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

// Check authentication status
app.get('/api/auth/check', (req, res) => {
  res.json({ authenticated: !!req.session.userId, userId: req.session.userId });
});

app.get('/api/status', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        p.id,
        p.user_id AS userId,
        p.text_content AS textContent,
        p.image_path AS imagePath,
        COALESCE(pl.likesCount, p.likes_count, 0) AS likesCount,
        COALESCE(pc.commentsCount, 0) AS commentsCount,
        CASE WHEN myLikes.user_id IS NULL THEN FALSE ELSE TRUE END AS likedByMe,
        CASE WHEN mySaves.user_id IS NULL THEN FALSE ELSE TRUE END AS savedByMe,
        p.created_at AS createdAt,
        u.full_name AS userName
      FROM Posts p
      LEFT JOIN Users u ON p.user_id = u.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS likesCount
        FROM Post_Likes
        GROUP BY post_id
      ) pl ON pl.post_id = p.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS commentsCount
        FROM Comments
        GROUP BY post_id
      ) pc ON pc.post_id = p.id
      LEFT JOIN Post_Likes myLikes ON myLikes.post_id = p.id AND myLikes.user_id = ?
      LEFT JOIN Saved_Posts mySaves ON mySaves.post_id = p.id AND mySaves.user_id = ?
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC`,
      [req.session.userId || 0, req.session.userId || 0]
    );

    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch posts:', error.message);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

app.post('/api/posts', requireAuth, upload.single('image'), async (req, res) => {
  const { textContent } = req.body;
  const trimmedText = String(textContent || '').trim();
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  if (!trimmedText && !imagePath) {
    return res.status(400).json({ message: 'textContent or image is required' });
  }

  try {
    const userId = req.session.userId;

    const [result] = await db.query(
      'INSERT INTO Posts (user_id, text_content, image_path) VALUES (?, ?, ?)',
      [userId, trimmedText || '', imagePath]
    );

    await notifyAudienceForNewPost(userId, result.insertId);

    res.status(201).json({
      message: 'Post created successfully',
      postId: result.insertId,
      imagePath,
    });
  } catch (error) {
    console.error('Failed to create post:', error.message);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

app.post('/api/news/share', requireAuth, async (req, res) => {
  const title = String(req.body.title || '').trim();
  const excerpt = String(req.body.excerpt || '').trim();
  const source = String(req.body.source || 'Agricultural News').trim();
  const url = String(req.body.url || '').trim();

  if (!title) {
    return res.status(400).json({ message: 'News title is required' });
  }

  const safeUrl = url ? `\nSource Link: ${url}` : '';
  const textContent = `[News Share]\n${title}\n${excerpt || ''}\nSource: ${source}${safeUrl}`.trim();

  try {
    const userId = req.session.userId;
    const [result] = await db.query(
      'INSERT INTO Posts (user_id, text_content, image_path) VALUES (?, ?, NULL)',
      [userId, textContent]
    );

    await notifyAudienceForNewPost(userId, result.insertId);

    res.status(201).json({
      message: 'News shared to home feed',
      postId: result.insertId,
    });
  } catch (error) {
    console.error('Failed to share news:', error.message);
    res.status(500).json({ message: 'Failed to share news' });
  }
});

app.post('/api/posts/:postId/like', requireAuth, async (req, res) => {
  const postId = Number.parseInt(req.params.postId, 10);

  if (!Number.isInteger(postId) || postId <= 0) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const [posts] = await db.query(
      'SELECT id, user_id AS userId FROM Posts WHERE id = ? AND is_active = TRUE LIMIT 1',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const post = posts[0];
    const userId = req.session.userId;

    const [existingLikes] = await db.query(
      'SELECT id FROM Post_Likes WHERE post_id = ? AND user_id = ? LIMIT 1',
      [postId, userId]
    );

    let liked = false;
    if (existingLikes.length > 0) {
      await db.query('DELETE FROM Post_Likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
    } else {
      await db.query('INSERT INTO Post_Likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      liked = true;

      await createNotification({
        recipientUserId: post.userId,
        actorUserId: userId,
        postId,
        type: 'like',
      });
    }

    const [likeRows] = await db.query('SELECT COUNT(*) AS total FROM Post_Likes WHERE post_id = ?', [postId]);
    const likesCount = likeRows[0].total;

    await db.query('UPDATE Posts SET likes_count = ? WHERE id = ?', [likesCount, postId]);

    res.json({
      liked,
      likesCount,
    });
  } catch (error) {
    console.error('Failed to toggle like:', error.message);
    res.status(500).json({ message: 'Failed to update like' });
  }
});

app.post('/api/posts/:postId/save', requireAuth, async (req, res) => {
  const postId = Number.parseInt(req.params.postId, 10);

  if (!Number.isInteger(postId) || postId <= 0) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const [posts] = await db.query(
      'SELECT id FROM Posts WHERE id = ? AND is_active = TRUE LIMIT 1',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.session.userId;

    const [existingSaves] = await db.query(
      'SELECT id FROM Saved_Posts WHERE post_id = ? AND user_id = ? LIMIT 1',
      [postId, userId]
    );

    let saved = false;
    if (existingSaves.length > 0) {
      await db.query('DELETE FROM Saved_Posts WHERE post_id = ? AND user_id = ?', [postId, userId]);
    } else {
      await db.query('INSERT INTO Saved_Posts (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      saved = true;
    }

    res.json({ saved });
  } catch (error) {
    console.error('Failed to toggle save:', error.message);
    res.status(500).json({ message: 'Failed to update save' });
  }
});

app.get('/api/posts/:postId/comments', async (req, res) => {
  const postId = Number.parseInt(req.params.postId, 10);

  if (!Number.isInteger(postId) || postId <= 0) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  try {
    const [rows] = await db.query(
      `SELECT
        c.id,
        c.post_id AS postId,
        c.user_id AS userId,
        c.parent_comment_id AS parentCommentId,
        c.text_content AS textContent,
        c.created_at AS createdAt,
        u.full_name AS userName
      FROM Comments c
      LEFT JOIN Users u ON u.id = c.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC`,
      [postId]
    );

    res.json(buildNestedComments(rows));
  } catch (error) {
    console.error('Failed to fetch comments:', error.message);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
});

app.post('/api/posts/:postId/comments', requireAuth, async (req, res) => {
  const postId = Number.parseInt(req.params.postId, 10);
  const parentCommentId = req.body.parentCommentId == null
    ? null
    : Number.parseInt(req.body.parentCommentId, 10);
  const textContent = String(req.body.textContent || '').trim();

  if (!Number.isInteger(postId) || postId <= 0) {
    return res.status(400).json({ message: 'Invalid post ID' });
  }

  if (!textContent) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  if (parentCommentId !== null && (!Number.isInteger(parentCommentId) || parentCommentId <= 0)) {
    return res.status(400).json({ message: 'Invalid parent comment ID' });
  }

  try {
    const [posts] = await db.query(
      'SELECT id, user_id AS userId FROM Posts WHERE id = ? AND is_active = TRUE LIMIT 1',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const post = posts[0];
    let parentComment = null;

    if (parentCommentId !== null) {
      const [parentRows] = await db.query(
        'SELECT id, user_id AS userId FROM Comments WHERE id = ? AND post_id = ? LIMIT 1',
        [parentCommentId, postId]
      );

      if (parentRows.length === 0) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }

      parentComment = parentRows[0];
    }

    const userId = req.session.userId;

    const [insertResult] = await db.query(
      `INSERT INTO Comments (post_id, user_id, parent_comment_id, text_content)
       VALUES (?, ?, ?, ?)`,
      [postId, userId, parentCommentId, textContent]
    );

    await createNotification({
      recipientUserId: post.userId,
      actorUserId: userId,
      postId,
      commentId: insertResult.insertId,
      type: parentComment ? 'reply' : 'comment',
    });

    if (parentComment && parentComment.userId !== post.userId) {
      await createNotification({
        recipientUserId: parentComment.userId,
        actorUserId: userId,
        postId,
        commentId: insertResult.insertId,
        type: 'reply',
      });
    }

    res.status(201).json({
      message: 'Comment added',
      commentId: insertResult.insertId,
    });
  } catch (error) {
    console.error('Failed to add comment:', error.message);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

app.get('/api/notifications', requireAuth, async (req, res) => {
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 25, 1), 50);

  try {
    const [rows] = await db.query(
      `SELECT
        n.id,
        n.type,
        n.is_read AS isRead,
        n.created_at AS createdAt,
        n.post_id AS postId,
        n.comment_id AS commentId,
        actor.full_name AS actorName,
        p.text_content AS postText,
        c.text_content AS commentText
      FROM Notifications n
      LEFT JOIN Users actor ON actor.id = n.actor_user_id
      LEFT JOIN Posts p ON p.id = n.post_id
      LEFT JOIN Comments c ON c.id = n.comment_id
      WHERE n.recipient_user_id = ?
      ORDER BY n.created_at DESC
      LIMIT ?`,
      [req.session.userId, limit]
    );

    const notifications = rows.map((row) => ({
      ...row,
      actorName: row.actorName || 'Someone',
      postPreview: String(row.postText || '').slice(0, 80),
      commentPreview: String(row.commentText || '').slice(0, 80),
    }));

    res.json(notifications);
  } catch (error) {
    console.error('Failed to fetch notifications:', error.message);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications/read', requireAuth, async (req, res) => {
  const notificationId = req.body.notificationId == null
    ? null
    : Number.parseInt(req.body.notificationId, 10);

  try {
    if (notificationId && Number.isInteger(notificationId) && notificationId > 0) {
      const [result] = await db.query(
        `UPDATE Notifications
         SET is_read = TRUE
         WHERE id = ? AND recipient_user_id = ?`,
        [notificationId, req.session.userId]
      );

      return res.json({ updated: result.affectedRows });
    }

    const [result] = await db.query(
      `UPDATE Notifications
       SET is_read = TRUE
       WHERE recipient_user_id = ? AND is_read = FALSE`,
      [req.session.userId]
    );

    res.json({ updated: result.affectedRows });
  } catch (error) {
    console.error('Failed to update notifications:', error.message);
    res.status(500).json({ message: 'Failed to update notifications' });
  }
});

app.get('/api/profile/overview', requireAuth, async (req, res) => {
  try {
    const [meRows] = await db.query(
      `SELECT id, full_name AS fullName, role, district_location AS location, bio, profile_picture_path AS profilePicture
       FROM Users
       WHERE id = ?
       LIMIT 1`,
      [req.session.userId]
    );

    if (meRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const me = meRows[0];

    const [bondCountRows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM Krishi_Bonds
       WHERE user_low_id = ? OR user_high_id = ?`,
      [req.session.userId, req.session.userId]
    );

    const [watchCountRows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM Expert_Watch
       WHERE follower_user_id = ?`,
      [req.session.userId]
    );

    res.json({
      me,
      krishiBondCount: bondCountRows[0].total,
      expertWatchCount: watchCountRows[0].total,
    });
  } catch (error) {
    console.error('Failed to fetch profile overview:', error.message);
    res.status(500).json({ message: 'Failed to fetch profile overview' });
  }
});

app.get('/api/profile/discover', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        u.id,
        u.full_name AS fullName,
        u.role,
        u.district_location AS location,
        u.bio,
        CASE
          WHEN kb.id IS NULL THEN FALSE
          ELSE TRUE
        END AS bonded,
        CASE
          WHEN ew.id IS NULL THEN FALSE
          ELSE TRUE
        END AS expertWatched
      FROM Users u
      LEFT JOIN Krishi_Bonds kb
        ON ((kb.user_low_id = LEAST(u.id, ?) AND kb.user_high_id = GREATEST(u.id, ?)))
      LEFT JOIN Expert_Watch ew
        ON ew.follower_user_id = ? AND ew.specialist_user_id = u.id
      WHERE u.id <> ?
      ORDER BY u.is_verified DESC, u.role DESC, u.created_at DESC
      LIMIT 50`,
      [req.session.userId, req.session.userId, req.session.userId, req.session.userId]
    );

    const specialists = rows.filter((row) => row.role === 'Verified Expert');
    const community = rows.filter((row) => row.role !== 'Verified Expert');

    res.json({
      specialists,
      community,
    });
  } catch (error) {
    console.error('Failed to fetch discover data:', error.message);
    res.status(500).json({ message: 'Failed to fetch discover data' });
  }
});

app.get('/api/profile/posts', requireAuth, async (req, res) => {
  const mode = String(req.query.mode || 'mine').toLowerCase();
  const userId = req.session.userId;

  try {
    let query = '';
    let params = [];

    if (mode === 'saved') {
      query = `SELECT
        p.id,
        p.user_id AS userId,
        p.text_content AS textContent,
        p.image_path AS imagePath,
        p.created_at AS createdAt,
        u.full_name AS userName
      FROM Saved_Posts sp
      INNER JOIN Posts p ON p.id = sp.post_id
      LEFT JOIN Users u ON u.id = p.user_id
      WHERE sp.user_id = ? AND p.is_active = TRUE
      ORDER BY sp.created_at DESC`;
      params = [userId];
    } else {
      query = `SELECT
        p.id,
        p.user_id AS userId,
        p.text_content AS textContent,
        p.image_path AS imagePath,
        p.created_at AS createdAt,
        u.full_name AS userName
      FROM Posts p
      LEFT JOIN Users u ON u.id = p.user_id
      WHERE p.user_id = ? AND p.is_active = TRUE
      ORDER BY p.created_at DESC`;
      params = [userId];
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch profile posts:', error.message);
    res.status(500).json({ message: 'Failed to fetch profile posts' });
  }
});

app.post('/api/profile/krishi-bond/:targetUserId', requireAuth, async (req, res) => {
  const targetUserId = Number.parseInt(req.params.targetUserId, 10);
  const myUserId = req.session.userId;

  if (!Number.isInteger(targetUserId) || targetUserId <= 0 || targetUserId === myUserId) {
    return res.status(400).json({ message: 'Invalid target user' });
  }

  const low = Math.min(myUserId, targetUserId);
  const high = Math.max(myUserId, targetUserId);

  try {
    const [existing] = await db.query(
      'SELECT id FROM Krishi_Bonds WHERE user_low_id = ? AND user_high_id = ? LIMIT 1',
      [low, high]
    );

    let bonded = false;
    if (existing.length > 0) {
      await db.query('DELETE FROM Krishi_Bonds WHERE user_low_id = ? AND user_high_id = ?', [low, high]);
    } else {
      await db.query('INSERT INTO Krishi_Bonds (user_low_id, user_high_id) VALUES (?, ?)', [low, high]);
      bonded = true;
    }

    res.json({ bonded });
  } catch (error) {
    console.error('Failed to toggle KrishiBond:', error.message);
    res.status(500).json({ message: 'Failed to update KrishiBond' });
  }
});

app.post('/api/profile/expert-watch/:specialistUserId', requireAuth, async (req, res) => {
  const specialistUserId = Number.parseInt(req.params.specialistUserId, 10);
  const myUserId = req.session.userId;

  if (!Number.isInteger(specialistUserId) || specialistUserId <= 0 || specialistUserId === myUserId) {
    return res.status(400).json({ message: 'Invalid specialist user' });
  }

  try {
    const [specialists] = await db.query(
      `SELECT id FROM Users WHERE id = ? AND role = 'Verified Expert' LIMIT 1`,
      [specialistUserId]
    );

    if (specialists.length === 0) {
      return res.status(400).json({ message: 'User is not a specialist' });
    }

    const [existing] = await db.query(
      `SELECT id
       FROM Expert_Watch
       WHERE follower_user_id = ? AND specialist_user_id = ?
       LIMIT 1`,
      [myUserId, specialistUserId]
    );

    let expertWatched = false;
    if (existing.length > 0) {
      await db.query(
        `DELETE FROM Expert_Watch
         WHERE follower_user_id = ? AND specialist_user_id = ?`,
        [myUserId, specialistUserId]
      );
    } else {
      await db.query(
        `INSERT INTO Expert_Watch (follower_user_id, specialist_user_id)
         VALUES (?, ?)`,
        [myUserId, specialistUserId]
      );
      expertWatched = true;
    }

    res.json({ expertWatched });
  } catch (error) {
    console.error('Failed to toggle ExpertWatch:', error.message);
    res.status(500).json({ message: 'Failed to update ExpertWatch' });
  }
});

app.get('/api/marketplace', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        m.id,
        m.product_title AS productTitle,
        m.description,
        m.price,
        m.category,
        m.location,
        m.image_path AS imagePath,
        m.quantity,
        m.unit,
        m.created_at AS createdAt,
        u.id AS sellerId,
        u.full_name AS sellerName,
        u.mobile_number AS sellerMobile,
        u.is_verified AS isVerifiedSeller
      FROM Marketplace_Ads m
      LEFT JOIN Users u ON m.vendor_id = u.id
      WHERE m.is_active = TRUE
      ORDER BY m.created_at DESC`
    );

    let filteredRows = rows;
    const selectedCategory = req.query.category;
    if (selectedCategory && selectedCategory !== '') {
      filteredRows = rows.filter(item => item.category === selectedCategory);
    }
    res.json(filteredRows);
  } catch (error) {
    console.error('Failed to fetch marketplace ads:', error.message);
    res.status(500).json({ message: 'Failed to fetch marketplace ads' });
  }
});

// Weather Endpoint
app.get('/api/weather', async (req, res) => {
  const locations = [
    { name: 'Dhaka', lat: 23.8103, lon: 90.4125 },
    { name: 'Gazipur', lat: 23.9957, lon: 90.4152 },
    { name: 'Bogura', lat: 24.8465, lon: 89.3687 },
    { name: 'Rajshahi', lat: 24.3745, lon: 88.6042 },
    { name: 'Khulna', lat: 22.8456, lon: 89.5403 },
    { name: 'Chattogram', lat: 22.3569, lon: 91.7832 },
  ];

  const areaQuery = String(req.query.area || 'Dhaka').trim();
  const daysQuery = Number.parseInt(req.query.days, 10);
  const forecastDays = Number.isInteger(daysQuery) ? Math.min(Math.max(daysQuery, 7), 21) : 14;
  const selectedLocation = locations.find((location) => location.name.toLowerCase() === areaQuery.toLowerCase());

  if (!selectedLocation) {
    return res.status(400).json({
      message: 'Invalid area',
      availableAreas: locations.map((location) => location.name),
    });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&forecast_days=${forecastDays}&timezone=Asia/Dhaka`;
    const response = await fetch(url);
    const json = await response.json();

    const conditions = {
      0: 'Clear',
      1: 'Mostly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light Drizzle',
      53: 'Drizzle',
      55: 'Heavy Drizzle',
      61: 'Rainy',
      63: 'Heavy Rain',
      65: 'Very Heavy Rain',
      80: 'Light Showers',
      81: 'Showers',
      82: 'Heavy Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Hail',
      99: 'Thunderstorm with Hail',
    };

    const daily = json.daily || {};
    const forecast = (daily.time || []).map((date, index) => ({
      date,
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
      condition: conditions[daily.weather_code[index]] || 'Variable',
      rainfall: daily.precipitation_sum[index] || 0,
      windSpeed: Math.round(daily.wind_speed_10m_max[index] || 0),
    }));

    const current = json.current || {};

    res.json({
      area: selectedLocation.name,
      days: forecastDays,
      generatedAt: new Date().toISOString(),
      availableAreas: locations.map((location) => location.name),
      current: {
        temperature: Math.round(current.temperature_2m || 0),
        condition: conditions[current.weather_code] || 'Variable',
        humidity: current.relative_humidity_2m || 0,
        windSpeed: Math.round(current.wind_speed_10m || 0),
        rainfall: current.precipitation || 0,
      },
      forecast,
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    const today = new Date();
    const fallbackForecast = Array.from({ length: forecastDays }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() + index);
      const isoDate = day.toISOString().slice(0, 10);
      return {
        date: isoDate,
        maxTemp: 30,
        minTemp: 23,
        condition: 'Partly Cloudy',
        rainfall: 2,
        windSpeed: 10,
      };
    });

    res.json({
      area: selectedLocation.name,
      days: forecastDays,
      generatedAt: new Date().toISOString(),
      availableAreas: locations.map((location) => location.name),
      current: {
        temperature: 27,
        condition: 'Partly Cloudy',
        humidity: 78,
        windSpeed: 10,
        rainfall: 2,
      },
      forecast: fallbackForecast,
    });
  }
});

// Agricultural News
app.get('/api/news', async (req, res) => {
  try {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 20) : 10;
    const searchQuery = 'agriculture';
    const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(searchQuery)}&mode=ArtList&maxrecords=${limit}&format=json&sort=DateDesc`;

    try {
      let externalText = '';
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const externalResponse = await fetch(gdeltUrl);
        externalText = await externalResponse.text();

        if (!externalText.startsWith('Please limit requests')) {
          break;
        }

        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 5500));
        }
      }

      let externalJson = null;
      try {
        externalJson = JSON.parse(externalText);
      } catch (parseError) {
        throw new Error(`Non-JSON response from GDELT: ${externalText.slice(0, 120)}`);
      }

      const articles = Array.isArray(externalJson.articles) ? externalJson.articles : [];

      const externalRows = articles.map((article, index) => {
        const language = detectArticleLanguage(article);
        const title = String(article.title || '').trim();
        const excerpt = String(article.seendate || '').trim();
        const sourceName = String(article.domain || article.sourcecountry || 'External Source').trim();
        const text = `${title} ${excerpt}`.toLowerCase();

        let mappedCategory = 'Market';
        if (text.includes('weather') || text.includes('rain') || text.includes('monsoon')) mappedCategory = 'Weather';
        else if (text.includes('seed')) mappedCategory = 'Seeds';
        else if (text.includes('pest') || text.includes('insect') || text.includes('disease')) mappedCategory = 'Pest Control';
        else if (text.includes('irrigation') || text.includes('water')) mappedCategory = 'Irrigation';
        else if (text.includes('technology') || text.includes('drone') || text.includes('iot')) mappedCategory = 'Technology';
        else if (text.includes('policy') || text.includes('ministry') || text.includes('government')) mappedCategory = 'Government';
        else if (text.includes('tip') || text.includes('guide') || text.includes('practice')) mappedCategory = 'Tips';

        return {
          id: `ext-${index + 1}`,
          title: title || 'Agricultural update',
          excerpt: excerpt || 'Latest agricultural update',
          category: mappedCategory,
          imageUrl: article.socialimage || null,
          source: sourceName,
          isFeatured: index < 2 ? 1 : 0,
          createdAt: article.seendate || new Date().toISOString(),
          url: article.url || null,
          language,
        };
      }).filter((item) => item.language === 'bn' || item.language === 'en');

      if (externalRows.length > 0) {
        externalNewsCache = {
          rows: externalRows.slice(0, limit),
          cachedAt: Date.now(),
        };
        return res.json(externalRows.slice(0, limit));
      }
    } catch (externalError) {
      console.error('External news fetch failed:', externalError.message);

      // If the provider is rate-limited temporarily, serve recent cached API news.
      const cacheIsFresh = externalNewsCache.rows.length > 0 && (Date.now() - externalNewsCache.cachedAt) < (15 * 60 * 1000);
      if (cacheIsFresh) {
        return res.json(externalNewsCache.rows);
      }
    }

    // Fallback to local DB news if external feed is unavailable.
    const [rows] = await db.query(
      `SELECT
        id,
        title,
        excerpt,
        category,
        image_url AS imageUrl,
        source,
        is_featured AS isFeatured,
        created_at AS createdAt,
        NULL AS url
      FROM Agricultural_News
      WHERE is_active = TRUE
      ORDER BY is_featured DESC, created_at DESC
      LIMIT ?`,
      [limit]
    );

    const filtered = rows
      .map((item) => ({
        ...item,
        language: detectLanguageFromText(`${item.title || ''} ${item.excerpt || ''}`),
      }))
      .filter((item) => item.language === 'bn' || item.language === 'en');

    res.json(filtered);
  } catch (error) {
    console.error('Failed to fetch news:', error.message);
    res.status(500).json({ message: 'Failed to fetch news' });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image must be 5MB or less' });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(400).json({ message: err.message || 'Request failed' });
  }

  next();
});

async function startServer() {
  await ensureSocialFeaturesSchema();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
