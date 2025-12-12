package com.twitter.model;

import javax.persistence.*;

/**
 * Follow Entity - Relationship between users
 * SOLID: Single Responsibility - Only manages follow relationships
 * Observer Pattern: This relationship enables notifications
 */
@Entity
@Table(name = "follows")
public class Follow {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, name = "follower_id")
    private Long followerId;  // User who is following
    
    @Column(nullable = false, name = "following_id")
    private Long followingId;  // User being followed
    
    @Column(name = "created_at")
    private long createdAt = System.currentTimeMillis();
    
    // Default Constructor
    public Follow() {
    }
    
    // Constructor
    public Follow(Long followerId, Long followingId) {
        this.followerId = followerId;
        this.followingId = followingId;
        this.createdAt = System.currentTimeMillis();
    }
    
    // Constructor with all fields
    public Follow(Long id, Long followerId, Long followingId, long createdAt) {
        this.id = id;
        this.followerId = followerId;
        this.followingId = followingId;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getFollowerId() {
        return followerId;
    }
    
    public void setFollowerId(Long followerId) {
        this.followerId = followerId;
    }
    
    public Long getFollowingId() {
        return followingId;
    }
    
    public void setFollowingId(Long followingId) {
        this.followingId = followingId;
    }
    
    public long getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "Follow{" +
                "id=" + id +
                ", followerId=" + followerId +
                ", followingId=" + followingId +
                ", createdAt=" + createdAt +
                '}';
    }
}
