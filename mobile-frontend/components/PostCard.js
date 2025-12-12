import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PostCard = ({ post, username }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Recently';
    
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.username}>{username || `User ${post.userId}`}</Text>
          <Text style={styles.time}>{formatTime(post.timestamp)}</Text>
        </View>
      </View>
      <Text style={styles.content}>{post.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});

export default PostCard;
