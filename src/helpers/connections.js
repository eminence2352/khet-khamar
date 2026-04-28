// This file contains helper functions for managing user-to-user connections

// Normalize a pair of user IDs so the smaller one always comes first
// This ensures the same pair always produces the same order (for database lookups)
function normalizeConnectionPair(userA, userB) {
  return userA < userB ? [userA, userB] : [userB, userA];
}

// Create helper functions for connection management
function createConnectionHelpers(db) {
  // Check the connection status between two users
  async function getConnectionRelation(currentUserId, targetUserId) {
    // If checking the same user or invalid IDs
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      return { status: 'self', pendingRequestId: null };
    }

    // Normalize the pair so we search consistently
    const [firstUserId, secondUserId] = normalizeConnectionPair(currentUserId, targetUserId);
    
    // Check if the two users are already connected
    const [connectedRows] = await db.query(
      `SELECT id
       FROM connections
       WHERE user_one_id = ? AND user_two_id = ?
       LIMIT 1`,
      [firstUserId, secondUserId]
    );

    if (connectedRows.length > 0) {
      return { status: 'connected', pendingRequestId: null };
    }

    // Check for pending connection requests between them
    const [pendingRows] = await db.query(
      `SELECT id, sender_id
       FROM connection_requests
       WHERE status = 'pending'
         AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
       ORDER BY created_at DESC
       LIMIT 1`,
      [currentUserId, targetUserId, targetUserId, currentUserId]
    );

    // If no pending request, they're not connected
    if (pendingRows.length === 0) {
      return { status: 'none', pendingRequestId: null };
    }

    // If pending request exists, check if current user sent it or received it
    const pendingRow = pendingRows[0];
    if (pendingRow.sender_id === currentUserId) {
      return { status: 'outgoing_pending', pendingRequestId: pendingRow.id };
    }

    return { status: 'incoming_pending', pendingRequestId: pendingRow.id };
  }

  return { getConnectionRelation };
}

module.exports = {
  normalizeConnectionPair,
  createConnectionHelpers,
};
