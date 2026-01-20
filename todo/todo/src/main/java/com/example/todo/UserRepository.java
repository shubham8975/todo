package com.example.todo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    // Used for login
    Optional<User> findByUsername(String username);
}
