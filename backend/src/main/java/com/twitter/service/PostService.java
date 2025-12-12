package com.twitter.service;

import com.twitter.model.Follow;
import com.twitter.model.Post;
import com.twitter.repository.FollowRepository;
import com.twitter.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * PostService - Business logic for posts
 * SOLID: Single Responsibility - Handles post operations
 */
@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private FollowRepository followRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Create a new post and notify all followers
     * @param userId - User creating the post
     * @param content - Post content
     * @return Created post
     */
    public Post createPost(Long userId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Post content cannot be empty");
        }
        
        if (content.length() > 250) {
            throw new IllegalArgumentException("Post cannot exceed 250 characters");
        }
        
        Post post = new Post(userId, content);
        Post savedPost = postRepository.save(post);
        
        // Get all followers of this user
        List<Follow> followers = followRepository.findByFollowingId(userId);
        
        // Create notification for each follower
        String message = "User " + userId + " posted: " + content;
        for (Follow follow : followers) {
            notificationService.createNotification(follow.getFollowerId(), message, "POST");
        }
        
        return savedPost;
    }
    
    /**
     * Get all posts by a specific user
     * @param userId - User ID
     * @return List of posts
     */
    public List<Post> getUserPosts(Long userId) {
        return postRepository.findByUserIdOrderByTimestampDesc(userId);  // ✅ CORRECTED
    }
    
    /**
     * Get a specific post by ID
     * @param postId - Post ID
     * @return Post or null if not found
     */
    public Post getPostById(Long postId) {
        Optional<Post> post = postRepository.findById(postId);
        return post.orElse(null);
    }
    
    /**
     * Delete a post
     * @param postId - Post ID to delete
     */
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }
    
    /**
     * Get all posts (for debugging/admin)
     * @return List of all posts
     */
    public List<Post> getAllPosts() {
        return postRepository.findAll();  // ✅ CORRECTED
    }
}
