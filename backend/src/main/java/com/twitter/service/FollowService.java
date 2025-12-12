package com.twitter.service;

import com.twitter.model.Follow;
import com.twitter.model.Post;
import com.twitter.repository.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * FollowService - Business logic for follow/unfollow operations
 * SOLID: Single Responsibility - Handles follow relationships
 */
@Service
public class FollowService {
    
    @Autowired
    private FollowRepository followRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    /**
     * Follow a user (with duplicate prevention)
     * @param followerId - User who wants to follow
     * @param followingId - User to be followed
     * @return Follow object
     */
    public Follow followUser(Long followerId, Long followingId) {
        // Check if user is trying to follow themselves
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("User cannot follow themselves");
        }
        
        // ✅ CHECK IF ALREADY FOLLOWING (Prevents duplicates)
        List<Follow> existingFollows = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (!existingFollows.isEmpty()) {
            throw new IllegalArgumentException("You are already following this user");
        }
        
        // Create new follow relationship
        Follow follow = new Follow(followerId, followingId);
        Follow savedFollow = followRepository.save(follow);
        
        // Create notification for the user being followed
        String message = "User " + followerId + " followed you!";
        notificationService.createNotification(followingId, message, "FOLLOW");
        
        return savedFollow;
    }
    
    /**
     * Unfollow a user
     * @param followerId - User who wants to unfollow
     * @param followingId - User to be unfollowed
     */
    public void unfollowUser(Long followerId, Long followingId) {
        List<Follow> follows = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        
        if (follows.isEmpty()) {
            throw new IllegalArgumentException("You are not following this user");
        }
        
        // Delete all follow relationships (should only be one due to duplicate prevention)
        followRepository.deleteAll(follows);
    }
    
    /**
     * Get all users that a specific user is following
     * @param userId - User ID
     * @return List of follow relationships
     */
    public List<Follow> getFollowing(Long userId) {
        return followRepository.findByFollowerId(userId);
    }
    
    /**
     * Get all followers of a specific user
     * @param userId - User ID
     * @return List of follow relationships
     */
    public List<Follow> getFollowers(Long userId) {
        return followRepository.findByFollowingId(userId);
    }
    
    /**
     * Check if user A is following user B
     * @param followerId - Follower ID
     * @param followingId - Following ID
     * @return true if following, false otherwise
     */
    public boolean isFollowing(Long followerId, Long followingId) {
        List<Follow> follows = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        return !follows.isEmpty();
    }
    
    /**
     * Get following count for a user
     * @param userId - User ID
     * @return Number of users this user is following
     */
    public long getFollowingCount(Long userId) {
        return followRepository.countByFollowerId(userId);
    }
    
    /**
     * Get follower count for a user
     * @param userId - User ID
     * @return Number of followers this user has
     */
    public long getFollowerCount(Long userId) {
        return followRepository.countByFollowingId(userId);
    }

    public List<Post> getUserFeed(Long userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUserFeed'");
    }
}
