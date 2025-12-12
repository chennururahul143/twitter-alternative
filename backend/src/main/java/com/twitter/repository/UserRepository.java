package com.twitter.repository;

import com.twitter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * UserRepository - SOLID: Dependency Inversion
 * Repository Pattern: Abstracts data access logic
 * Spring automatically provides CRUD methods
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
