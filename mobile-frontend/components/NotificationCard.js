import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Recently';
    
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return date.toLocaleDateString();
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'FOLLOW': return '#ff9500';
      case 'POST': return '#32c77e';
      default: return '#667eea';
    }
  };

  return (
    <View style={[styles.card, !notification.isRead && styles.unread]}>
      <View style={[styles.typeBadge, { backgroundColor: getTypeColor(notification.type) }]}>
        <Text style={styles.typeText}>{notification.type}</Text>
      </View>
      <Text style={styles.message}>{notification.message}</Text>
      <Text style={styles.time}>{formatTime(notification.createdAt)}</Text>
      <View style={styles.actions}>
        {!notification.isRead && (
          <TouchableOpacity
            style={styles.markReadButton}
            onPress={() => onMarkAsRead(notification.id)}
          >
            <Text style={styles.markReadText}>Mark Read</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(notification.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
  unread: {
    backgroundColor: '#e8f4f8',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  markReadButton: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  markReadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NotificationCard;
