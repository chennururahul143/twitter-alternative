// API Base URL
const API_URL = 'http://localhost:8080/api';

// ==================== Users API ====================

/**
 * Get all users
 * @returns {Promise<Array>} Array of user objects
 */
async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

/**
 * Get user by ID
 * @param {Number} userId - User ID
 * @returns {Promise<Object>} User object
 */
async function getUserById(userId) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

// ==================== Posts API ====================

/**
 * Create a new post
 * @param {Number} userId - User ID creating the post
 * @param {String} content - Post content
 * @returns {Promise<Object>} Created post
 */
async function createPostAPI(userId, content) {
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, content })
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating post:', error);
        return null;
    }
}

/**
 * Get feed for a user (posts from users they follow + their own posts)
 * @param {Number} userId - User ID
 * @returns {Promise<Array>} Array of posts
 */
async function getFeed(userId) {
    try {
        const response = await fetch(`${API_URL}/posts/feed/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching feed:', error);
        return [];
    }
}

/**
 * Get all posts by a specific user
 * @param {Number} userId - User ID
 * @returns {Promise<Array>} Array of posts
 */
async function getUserPosts(userId) {
    try {
        const response = await fetch(`${API_URL}/posts/user/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return [];
    }
}

// ==================== Follow API ====================

/**
 * Follow a user
 * @param {Number} followerId - User who is following
 * @param {Number} followingId - User being followed
 * @returns {Promise<Object>} Follow object
 */
async function follow(followerId, followingId) {
    try {
        const response = await fetch(`${API_URL}/follows/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ followerId, followingId })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to follow user');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
}

/**
 * Unfollow a user
 * @param {Number} followerId - User who is unfollowing
 * @param {Number} followingId - User being unfollowed
 * @returns {Promise<Object>} Response
 */
async function unfollow(followerId, followingId) {
    try {
        const response = await fetch(`${API_URL}/follows/unfollow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ followerId, followingId })
        });
        return await response.json();
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return null;
    }
}

/**
 * Get users that a specific user is following
 * @param {Number} userId - User ID
 * @returns {Promise<Array>} Array of follow objects
 */
async function getFollowing(userId) {
    try {
        const response = await fetch(`${API_URL}/follows/${userId}/following`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching following:', error);
        return [];
    }
}

/**
 * Get followers of a specific user
 * @param {Number} userId - User ID
 * @returns {Promise<Array>} Array of follow objects
 */
async function getFollowers(userId) {
    try {
        const response = await fetch(`${API_URL}/follows/${userId}/followers`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching followers:', error);
        return [];
    }
}

// ==================== Notifications API ====================

/**
 * Get all notifications for a user
 * @param {Number} userId - User ID
 * @returns {Promise<Array>} Array of notification objects
 */
async function getNotifications(userId) {
    try {
        const response = await fetch(`${API_URL}/notifications/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}

/**
 * Get unread notification count for a user
 * @param {Number} userId - User ID
 * @returns {Promise<Number>} Count of unread notifications
 */
async function getUnreadCount(userId) {
    try {
        const response = await fetch(`${API_URL}/notifications/${userId}/unread-count`);
        const data = await response.json();
        return data.unreadCount || 0;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
}

/**
 * Mark a notification as read
 * @param {Number} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
async function markNotificationAsRead(notificationId) {
    try {
        const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return null;
    }
}

/**
 * Delete a notification
 * @param {Number} notificationId - Notification ID
 * @returns {Promise<Object>} Response
 */
async function deleteNotification(notificationId) {
    try {
        const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting notification:', error);
        return null;
    }
}
