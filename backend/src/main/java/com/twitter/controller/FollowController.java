package com.twitter.controller;

import com.twitter.service.FollowService;
import com.twitter.model.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * FollowController - REST API Endpoints for Follow/Unfollow
 * SOLID: Single Responsibility - Only handles follow HTTP requests
 */
@RestController
@RequestMapping("/api/follows")
public class FollowController {
    
    @Autowired
    private FollowService followService;
    
    /**
     * POST /api/follows/follow
     * Follow a user
     */
    @PostMapping("/follow")
    public ResponseEntity<?> followUser(@RequestBody Map<String, Object> request) {
        try {
            Long followerId = Long.parseLong(request.get("followerId").toString());
            Long followingId = Long.parseLong(request.get("followingId").toString());
            
            followService.followUser(followerId, followingId);
            return ResponseEntity.ok(Map.of("message", "Followed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * POST /api/follows/unfollow
     * Unfollow a user
     */
    @PostMapping("/unfollow")
    public ResponseEntity<?> unfollowUser(@RequestBody Map<String, Object> request) {
        try {
            Long followerId = Long.parseLong(request.get("followerId").toString());
            Long followingId = Long.parseLong(request.get("followingId").toString());
            
            followService.unfollowUser(followerId, followingId);
            return ResponseEntity.ok(Map.of("message", "Unfollowed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * GET /api/follows/{userId}/following
     * Get list of users this person is following
     */
    @GetMapping("/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(followService.getFollowing(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * GET /api/follows/{userId}/followers
     * Get followers of this user
     */
    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(followService.getFollowers(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * GET /api/follows/{userId}/feed
     * Get feed (posts from followed users) - OBSERVER PATTERN IN ACTION
     */
    @GetMapping("/{userId}/feed")
    public ResponseEntity<?> getUserFeed(@PathVariable Long userId) {
        try {
            List<Post> feed = followService.getUserFeed(userId);
            return ResponseEntity.ok(feed);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
