package com.twitter.controller;

import com.twitter.model.Post;
import com.twitter.model.Follow;
import com.twitter.service.PostService;
import com.twitter.service.FollowService;
import com.twitter.notification.NotificationManager;
import com.twitter.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * PostController - REST API Endpoints for Posts
 * SOLID: Single Responsibility - Only handles post HTTP requests
 * Triggers Observer Pattern: When post is created, notifies followers
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @Autowired
    private FollowService followService;
    
    @Autowired
    private NotificationManager notificationManager;
    
    /**
     * POST /api/posts
     * Create a new post
     * OBSERVER PATTERN: Notifies all followers of this post
     */
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            String content = request.get("content").toString();
            
            // Create post
            Post post = postService.createPost(userId, content);
            
            // OBSERVER PATTERN: Notify all followers
            // ✅ FIX: Convert List<Follow> to List<Long>
            List<Follow> followersList = followService.getFollowers(userId);
            for (Follow follow : followersList) {
                Long followerId = follow.getFollowerId();
                Notification notification = new Notification(
                    followerId,
                    "New post from user " + userId + ": " + content,
                    "POST"
                );
                notificationManager.notifyListeners(notification);
            }
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * GET /api/posts
     * Get all posts
     */
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }
    
    /**
     * GET /api/posts/user/{userId}
     * Get posts by specific user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPosts(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(postService.getUserPosts(userId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * GET /api/posts/feed/{userId}
     * Get feed for a user (posts from users they follow + their own posts)
     */
    @GetMapping("/feed/{userId}")
    public ResponseEntity<?> getUserFeed(@PathVariable Long userId) {
        try {
            // Get all users this user is following
            List<Follow> following = followService.getFollowing(userId);
            
            // ✅ Convert Follow objects to user IDs
            List<Long> followingIds = new ArrayList<>();
            for (Follow follow : following) {
                followingIds.add(follow.getFollowingId());
            }
            
            
            // Get all posts from these users
            List<Post> feed = new ArrayList<>();
            for (Long id : followingIds) {
                feed.addAll(postService.getUserPosts(id));
            }
            
            // Sort by timestamp (newest first)
            feed.sort((p1, p2) -> Long.compare(p2.getTimestamp(), p1.getTimestamp()));
            
            return ResponseEntity.ok(feed);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
