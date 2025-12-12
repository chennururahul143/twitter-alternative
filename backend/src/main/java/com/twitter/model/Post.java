package com.twitter.model;

import javax.persistence.*;

/**
 * Post Model - Represents a post/tweet
 * SOLID: Single Responsibility - Only represents post data
 */
@Entity
@Table(name = "posts")
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false, length = 250)
    private String content;
    
    @Column(nullable = false)
    private Long timestamp;
    
    /**
     * Default constructor (required by JPA)
     */
    public Post() {
    }
    
    /**
     * Constructor with userId and content
     * Automatically sets timestamp to current time
     */
    public Post(Long userId, String content) {
        this.userId = userId;
        this.content = content;
        this.timestamp = System.currentTimeMillis();
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
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
    
    @Override
    public String toString() {
        return "Post{" +
                "id=" + id +
                ", userId=" + userId +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
