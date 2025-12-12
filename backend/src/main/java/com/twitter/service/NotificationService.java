package com.twitter.service;

import com.twitter.model.Notification;
import com.twitter.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * NotificationService - Business logic for notifications
 * SOLID: Single Responsibility - Handles notification operations
 * Observer Pattern: Creates notifications when events occur
 */
@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    /**
     * Create and save a new notification
     * @param userId - User receiving notification
     * @param message - Notification message
     * @param type - Notification type (POST, FOLLOW, etc)
     * @return Saved notification
     */
    public Notification createNotification(Long userId, String message, String type) {
        Notification notification = new Notification(userId, message, type);
        return notificationRepository.save(notification);
    }
    
    /**
     * Get all notifications for a user
     * @param userId - User ID
     * @return List of all notifications (newest first)
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Get unread notifications for a user
     * @param userId - User ID
     * @return List of unread notifications
     */
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Get count of unread notifications
     * @param userId - User ID
     * @return Number of unread notifications
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    /**
     * Mark a notification as read
     * @param notificationId - Notification ID
     * @return Updated notification
     */
    public Notification markAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        return null;
    }
    
    /**
     * Delete a notification
     * @param notificationId - Notification ID
     */
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    /**
     * Get a specific notification by ID
     * @param notificationId - Notification ID
     * @return Notification or null if not found
     */
    public Notification getNotificationById(Long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        return notification.orElse(null);
    }
}
