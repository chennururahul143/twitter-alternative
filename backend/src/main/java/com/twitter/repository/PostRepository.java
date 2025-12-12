package com.twitter.repository;

import com.twitter.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PostRepository - Data access for posts
 * SOLID: Single Responsibility - Only manages post data queries
 */
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    /**
     * Find all posts by a specific user, ordered by timestamp descending
     * @param userId - User ID
     * @return List of posts (newest first)
     */
    List<Post> findByUserIdOrderByTimestampDesc(Long userId);
    
    /**
     * Find all posts (for getting all posts)
     * This is already provided by JpaRepository.findAll()
     */
}
