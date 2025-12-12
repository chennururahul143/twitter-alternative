package com.twitter.repository;

import com.twitter.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * FollowRepository - Data access for follow relationships
 * SOLID: Single Responsibility - Only manages follow data queries
 */
@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    
    /**
     * Find all users that a specific user is following
     * @param followerId - User ID of the follower
     * @return List of follow relationships
     */
    List<Follow> findByFollowerId(Long followerId);
    
    /**
     * Find all followers of a specific user
     * @param followingId - User ID being followed
     * @return List of follow relationships
     */
    List<Follow> findByFollowingId(Long followingId);
    
    /**
     * Check if a follow relationship exists between two users
     * @param followerId - Follower ID
     * @param followingId - Following ID
     * @return List of follow relationships (empty if not following)
     */
    List<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    
    /**
     * Count how many users a specific user is following
     * @param followerId - User ID
     * @return Count of following
     */
    long countByFollowerId(Long followerId);
    
    /**
     * Count how many followers a specific user has
     * @param followingId - User ID
     * @return Count of followers
     */
    long countByFollowingId(Long followingId);
}
