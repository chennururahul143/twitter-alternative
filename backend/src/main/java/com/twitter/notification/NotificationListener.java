package com.twitter.notification;

import com.twitter.model.Notification;

/**
 * NotificationListener Interface - OBSERVER PATTERN
 * SOLID: Interface Segregation - Small, focused interface
 * Polymorphism: Different implementations can be created
 */
public interface NotificationListener {
    void update(Notification notification);
    void addListener(NotificationListener listener);
    void removeListener(NotificationListener listener);
}
