package com.twitter.model;

import javax.persistence.*;

/**
 * Notification Entity - Database-persisted notifications
 * SOLID: Single Responsibility - Only manages notification data
 * Observer Pattern: Used to notify users of events
 */
@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, name = "user_id")
    private Long userId;  // User receiving notification
    
    @Column(nullable = false, length = 500)
    private String message;  // Notification message
    
    @Column(nullable = false)
    private String type;  // "POST", "FOLLOW", etc.
    
    @Column(name = "is_read")
    private boolean isRead = false;  // Whether notification has been read
    
    @Column(name = "created_at")
    private long createdAt = System.currentTimeMillis();
    
    // Default Constructor
    public Notification() {
    }
    
    // Constructor
    public Notification(Long userId, String message, String type) {
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.createdAt = System.currentTimeMillis();
    }
    
    // Constructor with all fields
    public Notification(Long id, Long userId, String message, String type, boolean isRead, long createdAt) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public boolean isRead() {
        return isRead;
    }
    
    public void setRead(boolean read) {
        isRead = read;
    }
    
    public long getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", userId=" + userId +
                ", message='" + message + '\'' +
                ", type='" + type + '\'' +
                ", isRead=" + isRead +
                ", createdAt=" + createdAt +
                '}';
    }
}
