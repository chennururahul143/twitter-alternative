import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  Alert,
} from 'react-native';
import UserCard from '../components/UserCard';
import { getUsers, followUser, getFollowing } from '../api/backend';

const UsersScreen = ({ currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
    loadFollowing();
  }, [currentUserId]);

  const loadUsers = async () => {
    const userData = await getUsers();
    setUsers(userData);
  };

  const loadFollowing = async () => {
    if (!currentUserId) return;
    const followingData = await getFollowing(currentUserId);
    setFollowing(followingData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    await loadFollowing();
    setRefreshing(false);
  };

  const handleFollow = async (followingId) => {
    if (!currentUserId) {
      Alert.alert('Error', 'Please select a user first');
      return;
    }

    if (currentUserId === followingId) {
      Alert.alert('Error', 'You cannot follow yourself!');
      return;
    }

    try {
      await followUser(currentUserId, followingId);
      await loadFollowing();
      Alert.alert('Success', 'User followed!');
    } catch (error) {
      if (error.message && error.message.includes('already following')) {
        Alert.alert('Info', 'You are already following this user');
      } else {
        Alert.alert('Error', 'Failed to follow user');
      }
    }
  };

  const isFollowing = (userId) => {
    return following.some(f => f.followingId === userId);
  };

  if (!currentUserId) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Please select a user from Profile tab</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users.filter(u => u.id !== currentUserId)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onFollow={handleFollow}
            isFollowing={isFollowing(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default UsersScreen;
