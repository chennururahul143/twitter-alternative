package com.twitter.repository;

import com.twitter.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * NotificationRepository - Data access for notifications
 * SOLID: Single Responsibility - Only manages data queries
 * Extends JpaRepository: Provides CRUD operations automatically
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    /**
     * Find all notifications for a specific user
     * @param userId - User ID
     * @return List of notifications for that user (sorted by newest first)
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find all unread notifications for a user
     * @param userId - User ID
     * @return List of unread notifications
     */
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    
    /**
     * Count unread notifications for a user
     * @param userId - User ID
     * @return Count of unread notifications
     */
    long countByUserIdAndIsReadFalse(Long userId);
}
