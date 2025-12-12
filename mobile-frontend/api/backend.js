import axios from 'axios';

const COMPUTER_IP = '192.168.1.42';  
const API_URL = `http://${COMPUTER_IP}:8080/api`;

// ==================== Users API ====================

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// ==================== Posts API ====================

export const createPost = async (userId, content) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, {
      userId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getFeed = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/feed/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error);
    return [];
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
};

// ==================== Follow API ====================

export const followUser = async (followerId, followingId) => {
  try {
    const response = await axios.post(`${API_URL}/follows/follow`, {
      followerId,
      followingId
    });
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (followerId, followingId) => {
  try {
    const response = await axios.post(`${API_URL}/follows/unfollow`, {
      followerId,
      followingId
    });
    return response.data;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

export const getFollowing = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/follows/${userId}/following`);
    return response.data;
  } catch (error) {
    console.error('Error fetching following:', error);
    return [];
  }
};

export const getFollowers = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/follows/${userId}/followers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
};

// ==================== Notifications API ====================

export const getNotifications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const getUnreadCount = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/${userId}/unread-count`);
    return response.data.unreadCount || 0;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await axios.post(`${API_URL}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking as read:', error);
    return null;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(`${API_URL}/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return null;
  }
};
