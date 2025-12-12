import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import NotificationCard from '../components/NotificationCard';
import { getNotifications, markAsRead, deleteNotification } from '../api/backend';

const NotificationsScreen = ({ currentUserId, onUnreadCountChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  const loadNotifications = async () => {
    if (!currentUserId) return;
    const notifData = await getNotifications(currentUserId);
    setNotifications(notifData);
    
    // Update unread count
    const unreadCount = notifData.filter(n => !n.isRead).length;
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
    await loadNotifications();
  };

  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId);
    await loadNotifications();
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
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications</Text>
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

export default NotificationsScreen;
