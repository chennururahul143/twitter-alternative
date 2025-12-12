import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import PostCard from '../components/PostCard';
import {
  getUsers,
  getUserPosts,
  getFollowers,
  getFollowing,
} from '../api/backend';

const ProfileScreen = ({ currentUserId, onUserChange }) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadProfile();
    }
  }, [currentUserId]);

  const loadUsers = async () => {
    const userData = await getUsers();
    setUsers(userData);
  };

  const loadProfile = async () => {
    if (!currentUserId) return;

    const userPosts = await getUserPosts(currentUserId);
    const followers = await getFollowers(currentUserId);
    const following = await getFollowing(currentUserId);

    setPosts(userPosts);
    setStats({
      posts: userPosts.length,
      followers: followers.length,
      following: following.length,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const currentUser = users.find(u => u.id === currentUserId);

  return (
    <View style={styles.container}>
      {/* User Selection */}
      <View style={styles.userSelection}>
        <Text style={styles.label}>Select User:</Text>
        <View style={styles.userButtons}>
          {users.map(user => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.userButton,
                currentUserId === user.id && styles.userButtonActive,
              ]}
              onPress={() => onUserChange(user.id)}
            >
              <Text
                style={[
                  styles.userButtonText,
                  currentUserId === user.id && styles.userButtonTextActive,
                ]}
              >
                {user.username}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {currentUserId ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {currentUser?.username.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.username}>{currentUser?.username}</Text>
              <Text style={styles.email}>{currentUser?.email}</Text>

              {/* Stats */}
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{stats.posts}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{stats.followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{stats.following}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>My Posts</Text>
            </View>
          }
          renderItem={({ item }) => (
            <PostCard post={item} username={currentUser?.username} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Select a user to view profile</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userSelection: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
  },
  userButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  userButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  userButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  userButtonTextActive: {
    color: '#fff',
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProfileScreen;
