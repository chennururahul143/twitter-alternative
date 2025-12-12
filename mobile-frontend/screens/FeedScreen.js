import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import PostCard from '../components/PostCard';
import { getFeed, createPost, getUsers } from '../api/backend';

const FeedScreen = ({ currentUserId }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');

  useEffect(() => {
    loadFeed();
    loadUsers();
  }, [currentUserId]);

  const loadUsers = async () => {
    const userData = await getUsers();
    setUsers(userData);
  };

  const loadFeed = async () => {
    if (!currentUserId) return;
    const feedData = await getFeed(currentUserId);
    setPosts(feedData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const handleCreatePost = async () => {
    if (!currentUserId) {
      Alert.alert('Error', 'Please select a user first');
      return;
    }

    if (!postContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }

    if (postContent.length > 250) {
      Alert.alert('Error', 'Post cannot exceed 250 characters');
      return;
    }

    try {
      await createPost(currentUserId, postContent);
      setPostContent('');
      setModalVisible(false);
      await loadFeed();
      Alert.alert('Success', 'Post created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const getUsernameById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : `User ${userId}`;
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
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard post={item} username={getUsernameById(item.userId)} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet. Follow users to see their posts!</Text>
          </View>
        }
      />

      {/* Create Post Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TextInput
              style={styles.input}
              placeholder="What's on your mind?"
              multiline
              maxLength={250}
              value={postContent}
              onChangeText={setPostContent}
            />
            <Text style={styles.charCount}>{postContent.length}/250</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setPostContent('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.postButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  charCount: {
    textAlign: 'right',
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  postButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default FeedScreen;
