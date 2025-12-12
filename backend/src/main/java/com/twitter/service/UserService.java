package com.twitter.service;

import com.twitter.model.User;
import com.twitter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * UserService - Business Logic for Users
 * SOLID: Single Responsibility - Only handles user-related logic
 * SOLID: Dependency Inversion - Depends on UserRepository interface
 * Encapsulation: All user logic is here, controllers don't access repo directly
 */
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Create new user
    public User createUser(String username, String email) {
        // Check if user already exists
        Optional<User> existing = userRepository.findByUsername(username);
        if (existing.isPresent()) {
            throw new RuntimeException("User already exists: " + username);
        }
        
        User user = new User(username, email);
        return userRepository.save(user);
    }
    
    // Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }
    
    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Get user by username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
    
    // Update user bio
    public User updateUserBio(Long id, String bio) {
        User user = getUserById(id);
        user.setBio(bio);
        return userRepository.save(user);
    }
}
