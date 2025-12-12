package com.twitter.notification;

import com.twitter.model.Notification;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * NotificationManager - OBSERVER PATTERN (Subject)
 * SOLID: Single Responsibility - Only manages notifications
 * When a post is created, it notifies all followers
 * 
 * OOP Concepts Demonstrated:
 * - Encapsulation: Private listener list
 * - Polymorphism: All listeners implement NotificationListener
 * - Design Pattern: Observer Pattern
 */
@Component
public class NotificationManager {
    
    private List<NotificationListener> listeners = new CopyOnWriteArrayList<>();
    private Map<Long, List<Notification>> userNotifications = new HashMap<>();
    
    /**
     * Add a listener (observer) - could be email, web, mobile, etc.
     */
    public void subscribe(NotificationListener listener) {
        if (!listeners.contains(listener)) {
            listeners.add(listener);
        }
    }
    
    /**
     * Remove a listener
     */
    public void unsubscribe(NotificationListener listener) {
        listeners.remove(listener);
    }
    
    /**
     * Notify all listeners of a new event
     * This is called when a user posts
     */
    public void notifyListeners(Notification notification) {
        System.out.println("[NOTIFICATION MANAGER] Notifying about: " + notification.getMessage());
        
        // Store notification for user
        userNotifications.computeIfAbsent(notification.getUserId(), k -> new ArrayList<>())
                        .add(notification);
        
        // Notify all listeners
        for (NotificationListener listener : listeners) {
            listener.update(notification);
        }
    }
    
    /**
     * Get notifications for a specific user
     */
    public List<Notification> getUserNotifications(Long userId) {
        return userNotifications.getOrDefault(userId, new ArrayList<>());
    }
    
    /**
     * Clear notifications for testing
     */
    public void clearNotifications(Long userId) {
        userNotifications.remove(userId);
    }
}
