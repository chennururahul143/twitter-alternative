// ==================== Global State ====================

let currentUserId = null;

// ==================== Helper Functions ====================

/**
 * Format timestamp to readable date/time
 * @param {Number} timestamp - Unix timestamp in milliseconds
 * @returns {String} Formatted date string
 */
function formatTime(timestamp) {
    if (!timestamp) {
        return 'Just now';
    }
    
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return 'Recently';
    }   
    
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
        return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// ==================== Tab Management ====================

/**
 * Switch between tabs (home, users)
 * @param {String} tabName - Tab to switch to
 */
/**
 * Switch between tabs (home, users, profile)
 * @param {String} tabName - Tab to switch to (without -tab suffix)
 */
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Hide all tab contents
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    const allButtons = document.querySelectorAll('.tab-button');
    allButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show the selected tab (add -tab suffix to match HTML id)
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
        console.log('✅ Tab switched to:', tabName);
    } else {
        console.error('❌ Tab not found:', tabName + '-tab');
    }
    
    // Activate the clicked button
    const clickedButton = document.getElementById('tab-' + tabName);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Load content based on tab
    if (tabName === 'users') {
        loadUsers();
    } else if (tabName === 'profile') {
        loadProfile();
    }
}

// ==================== User Management ====================

/**
 * Populate users dropdown from backend
 */
async function populateUsersDropdown() {
    const users = await getUsers();
    const select = document.getElementById('current-user-select');
    
    select.innerHTML = '<option value="">-- Select User --</option>';
    
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = `${user.username} (${user.email})`;
        select.appendChild(option);
    });
}

/**
 * Switch user from dropdown
 */
async function switchUser() {
    const select = document.getElementById('current-user-select');
    currentUserId = select.value ? parseInt(select.value) : null;
    
    if (currentUserId) {
        await loadFeed();
        await updateUserNotifications();
    } else {
        document.getElementById('feed').innerHTML = '<p class="placeholder">Select a user to view their feed</p>';
        await updateNotificationBadge();
    }
}

/**
 * Select user to view their profile/feed
 * @param {Number} userId - User ID to select
 */
async function selectUser(userId) {
    currentUserId = userId;
    
    // Update the select dropdown
    document.getElementById('current-user-select').value = userId;
    
    // Switch to home tab to show feed
    switchTab('home');
    
    // Load feed and notifications
    await loadFeed();
    await updateUserNotifications();
}

/**
 * Load and display all users in the users tab
 */
async function loadUsers() {
    const users = await getUsers();
    const usersGrid = document.getElementById('users-list');
    
    if (users.length === 0) {
        usersGrid.innerHTML = '<p class="placeholder">No users found</p>';
        return;
    }
    
    usersGrid.innerHTML = users.map(user => `
        <div class="user-card" onclick="selectUser(${user.id})">
            <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
            <h3>${user.username}</h3>
            <p>${user.email}</p>
            <button class="btn btn-primary" onclick="event.stopPropagation(); followUser(${user.id})">
                Follow
            </button>
        </div>
    `).join('');
}

/**
 * Follow a user
 * @param {Number} followingId - User ID to follow
 */
async function followUser(followingId) {
    if (!currentUserId) {
        alert('Please select a user first');
        return;
    }
    
    if (currentUserId === followingId) {
        alert('You cannot follow yourself!');
        return;
    }
    
    try {
        const result = await follow(currentUserId, followingId);
        if (result) {
            alert('Successfully followed user!');
            await loadFeed();
        }
    } catch (error) {
        if (error.message.includes('already following')) {
            alert('You are already following this user!');
        } else {
            alert('Error following user: ' + error.message);
        }
    }
}

// ==================== Post Management ====================

/**
 * Create a new post
 */
async function createPost() {
    if (!currentUserId) {
        alert('Please select a user first');
        return;
    }
    
    const content = document.getElementById('post-content').value.trim();
    
    if (!content) {
        alert('Post content cannot be empty');
        return;
    }
    
    if (content.length > 250) {
        alert('Post cannot exceed 250 characters');
        return;
    }
    
    const post = await createPostAPI(currentUserId, content);
    
    if (post) {
        document.getElementById('post-content').value = '';
        document.getElementById('char-count').textContent = '0';
        await loadFeed();
        alert('Post created successfully!');
    }
}

/**
 * Load and display feed for current user
 */
async function loadFeed() {
    if (!currentUserId) {
        document.getElementById('feed').innerHTML = '<p class="placeholder">Select a user to view their feed</p>';
        return;
    }
    
    const posts = await getFeed(currentUserId);
    const feedDiv = document.getElementById('feed');
    
    if (posts.length === 0) {
        feedDiv.innerHTML = '<p class="placeholder">No posts yet. Follow users or create a post!</p>';
        return;
    }
    
    feedDiv.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <div class="post-avatar">U${post.userId}</div>
                <div class="post-info">
                    <h4>User ${post.userId}</h4>
                    <span class="post-time">${formatTime(post.timestamp)}</span>
                </div>
            </div>
            <div class="post-content">${post.content}</div>
        </div>
    `).join('');
}

// ==================== Notification Management ====================

let notificationDropdownOpen = false;
let notificationRefreshInterval = null;

/**
 * Toggle notification dropdown visibility
 */
function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    notificationDropdownOpen = !notificationDropdownOpen;
    
    if (notificationDropdownOpen) {
        dropdown.classList.add('active');
        loadNotifications();
    } else {
        dropdown.classList.remove('active');
    }
}

/**
 * Load and display notifications for current user
 */
async function loadNotifications() {
    if (!currentUserId) {
        return;
    }
    
    const notifications = await getNotifications(currentUserId);
    const notificationList = document.getElementById('notification-list');
    
    if (notifications.length === 0) {
        notificationList.innerHTML = '<div class="notification-placeholder">No notifications</div>';
        return;
    }
    
    notificationList.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.isRead ? '' : 'unread'}">
            <span class="notification-item-type ${notif.type}">${notif.type}</span>
            <div class="notification-item-message">${notif.message}</div>
            <div class="notification-item-time">${formatTime(notif.createdAt)}</div>
            <div class="notification-item-actions">
                ${!notif.isRead ? `<button class="mark-read-btn" onclick="handleMarkAsRead(${notif.id})">Mark Read</button>` : ''}
                <button class="delete-btn" onclick="handleDeleteNotification(${notif.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

/**
 * Update notification badge count
 */
async function updateNotificationBadge() {
    if (!currentUserId) {
        const badge = document.getElementById('notification-badge');
        if (badge) {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
        return;
    }
    
    const unreadCount = await getUnreadCount(currentUserId);
    const badge = document.getElementById('notification-badge');
    
    if (badge) {
        badge.textContent = unreadCount;
        
        // Hide badge if count is 0
        if (unreadCount === 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}

/**
 * Mark notification as read and refresh
 * @param {Number} notificationId - Notification ID
 */
async function handleMarkAsRead(notificationId) {
    await markNotificationAsRead(notificationId);
    await loadNotifications();
    await updateNotificationBadge();
}

/**
 * Delete notification and refresh
 * @param {Number} notificationId - Notification ID
 */
async function handleDeleteNotification(notificationId) {
    await deleteNotification(notificationId);
    await loadNotifications();
    await updateNotificationBadge();
}

/**
 * Start auto-refreshing notifications every 5 seconds
 */
function startNotificationRefresh() {
    if (notificationRefreshInterval) {
        clearInterval(notificationRefreshInterval);
    }
    
    notificationRefreshInterval = setInterval(async () => {
        if (currentUserId) {
            await updateNotificationBadge();
            if (notificationDropdownOpen) {
                await loadNotifications();
            }
        }
    }, 5000); // Refresh every 5 seconds
}

/**
 * Stop auto-refreshing notifications
 */
function stopNotificationRefresh() {
    if (notificationRefreshInterval) {
        clearInterval(notificationRefreshInterval);
        notificationRefreshInterval = null;
    }
}

/**
 * Update current user and refresh notifications
 */
async function updateUserNotifications() {
    await updateNotificationBadge();
    await startNotificationRefresh();
}

/**
 * Load and display current user's profile
 */
async function loadProfile() {
    if (!currentUserId) {
        document.getElementById('profile-info').innerHTML = '<p class="placeholder">Select a user to view profile</p>';
        document.getElementById('my-posts').innerHTML = '';
        document.getElementById('posts-count').textContent = '0';
        document.getElementById('followers-count').textContent = '0';
        document.getElementById('following-count').textContent = '0';
        return;
    }
    
    // Get user info
    const users = await getUsers();
    const currentUser = users.find(u => u.id === currentUserId);
    
    if (currentUser) {
        document.getElementById('profile-info').innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar-large">${currentUser.username.charAt(0).toUpperCase()}</div>
                <div>
                    <h3>${currentUser.username}</h3>
                    <p>${currentUser.email}</p>
                </div>
            </div>
        `;
    }
    
    // Get user's posts
    const posts = await getUserPosts(currentUserId);
    document.getElementById('posts-count').textContent = posts.length;
    
    // Get followers/following counts
    const followers = await getFollowers(currentUserId);
    const following = await getFollowing(currentUserId);
    document.getElementById('followers-count').textContent = followers.length;
    document.getElementById('following-count').textContent = following.length;
    
    // Display user's posts
    const myPostsDiv = document.getElementById('my-posts');
    if (posts.length === 0) {
        myPostsDiv.innerHTML = '<p class="placeholder">No posts yet</p>';
    } else {
        myPostsDiv.innerHTML = `<h3>My Posts</h3>` + posts.map(post => `
            <div class="post-card">
                <div class="post-header">
                    <div class="post-avatar">U${post.userId}</div>
                    <div class="post-info">
                        <h4>${currentUser.username}</h4>
                        <span class="post-time">${formatTime(post.timestamp)}</span>
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
            </div>
        `).join('');
    }
}



// ==================== Initialization ====================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('✅ DOM ready, initializing app...');
    
    // Set up character counter
    const textarea = document.getElementById('post-content');
    if (textarea) {
        textarea.addEventListener('input', function() {
            document.getElementById('char-count').textContent = this.value.length;
        });
    }
    
    // Load users from backend and populate dropdown + users grid
    await populateUsersDropdown();
    await loadUsers();
    
    // Close notification dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const notificationBell = document.querySelector('.notification-bell');
        if (notificationBell && !notificationBell.contains(event.target) && notificationDropdownOpen) {
            toggleNotificationDropdown();
        }
    });
    
    console.log('✅ App initialized successfully');
});
