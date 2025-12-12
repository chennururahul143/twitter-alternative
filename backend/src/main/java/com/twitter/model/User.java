package com.twitter.model;

import javax.persistence.*;

/**
 * User Entity - Demonstrates Encapsulation & OOP Concepts
 * SOLID: Single Responsibility - Only manages user data
 */
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String email;
    
    @Column(name = "bio")
    private String bio;
    
    @Column(name = "created_at")
    private long createdAt = System.currentTimeMillis();
    
    // Default Constructor
    public User() {
    }
    
    // Constructor with username and email
    public User(String username, String email) {
        this.username = username;
        this.email = email;
        this.createdAt = System.currentTimeMillis();
    }
    
    // Constructor with all fields
    public User(Long id, String username, String email, String bio, long createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getBio() {
        return bio;
    }
    
    public void setBio(String bio) {
        this.bio = bio;
    }
    
    public long getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }
    
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", bio='" + bio + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
