package com.twitter.controller;

import com.twitter.model.Notification;
import com.twitter.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * NotificationController - REST API endpoints for notifications
 * SOLID: Single Responsibility - Handles HTTP requests/responses
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Get all notifications for a user
     * GET /api/notifications/{userId}
     * @param userId - User ID
     * @return List of notifications
     */
    @GetMapping("/{userId}")
    public List<Notification> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId);
    }
    
    /**
     * Get unread notifications count for a user
     * GET /api/notifications/{userId}/unread-count
     * @param userId - User ID
     * @return Unread count
     */
    @GetMapping("/{userId}/unread-count")
    public Map<String, Object> getUnreadCount(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("unreadCount", notificationService.getUnreadCount(userId));
        return response;
    }
    
    /**
     * Get only unread notifications
     * GET /api/notifications/{userId}/unread
     * @param userId - User ID
     * @return List of unread notifications
     */
    @GetMapping("/{userId}/unread")
    public List<Notification> getUnreadNotifications(@PathVariable Long userId) {
        return notificationService.getUnreadNotifications(userId);
    }
    
    /**
     * Mark a notification as read
     * POST /api/notifications/{id}/read
     * @param id - Notification ID
     * @return Updated notification
     */
    @PostMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }
    
    /**
     * Delete a notification
     * DELETE /api/notifications/{id}
     * @param id - Notification ID
     * @return Success message
     */
    @DeleteMapping("/{id}")
    public Map<String, String> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted successfully");
        return response;
    }
}
